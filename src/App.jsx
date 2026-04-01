import { useEffect, useState } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import LoginView from "./components/layout/LoginView";
import OverviewPanel from "./components/dashboard/overview";
import OrdersPanel from "./components/dashboard/orders";
import ProductsPanel from "./components/dashboard/products/ProductsPanel";
import OffersPanel from "./components/dashboard/offers";
import CouponsPanel from "./components/dashboard/coupons";
import TipsPanel from "./components/dashboard/tips";
import ContentPanel from "./components/dashboard/content";
import { clearAuthError, loginAdmin, logoutAdmin } from "./features/auth/authSlice";
import {
  clearAdminError,
  fetchAdminSnapshot,
  clearAdminMessage,
  fetchOrderDetails,
  clearSelectedOrder
} from "./features/admin/adminSlice";
import { adminApi } from "./features/admin/state/api";
import { getApiBaseUrl } from "./utils/apiClient";

function DashboardLayout({
  admin,
  lastUpdatedAt,
  snapshotStatus,
  mutationStatus,
  lastMessage,
  error,
  onRefresh,
  onLogout,
  onDismissError
}) {
  return (
    <main className="mx-auto w-full max-w-[1650px] px-3 py-4 md:px-6 md:py-6">
      <div className="grid gap-4 md:grid-cols-[18rem_1fr] md:items-start">
        <Sidebar />

        <section className="min-w-0">
          <TopBar
            admin={admin}
            onRefresh={onRefresh}
            onLogout={onLogout}
            lastMessage={lastMessage}
            snapshotStatus={snapshotStatus}
            mutationStatus={mutationStatus}
            lastUpdatedAt={lastUpdatedAt}
          />

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <div className="flex items-start justify-between gap-3">
                <span>{error}</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-red-700 underline"
                  onClick={onDismissError}
                >
                  dismiss
                </button>
              </div>
            </div>
          ) : null}

          <Outlet />
        </section>
      </div>
    </main>
  );
}

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const authStatus = useAppSelector((state) => state.auth.status);
  const authError = useAppSelector((state) => state.auth.error);

  const {
    dashboard,
    inventory,
    orders,
    selectedOrderDetails,
    orderDetailsStatus,
    offers,
    coupons,
    tips,
    products,
    content,
    snapshotStatus,
    mutationStatus,
    error,
    lastMessage
  } = useAppSelector((state) => state.admin);
  const admin = useAppSelector((state) => state.auth.admin);

  const [lastUpdatedAt, setLastUpdatedAt] = useState("");

  useEffect(() => {
    if (!token) {
      return;
    }

    dispatch(fetchAdminSnapshot());
  }, [dispatch, token]);

  useEffect(() => {
    if (!token || snapshotStatus !== "succeeded") {
      return;
    }

    setLastUpdatedAt(new Date().toISOString());
  }, [token, snapshotStatus]);

  useEffect(() => {
    if (!lastMessage) {
      return undefined;
    }

    const timer = setTimeout(() => {
      dispatch(clearAdminMessage());
    }, 3800);

    return () => clearTimeout(timer);
  }, [dispatch, lastMessage]);

  useEffect(() => {
    function handleAuthExpired() {
      dispatch(adminApi.util.resetApiState());
      dispatch(logoutAdmin());
      dispatch(clearAdminError());
    }

    window.addEventListener("ashpero:auth-expired", handleAuthExpired);

    return () => {
      window.removeEventListener("ashpero:auth-expired", handleAuthExpired);
    };
  }, [dispatch]);

  function onLogin(credentials) {
    dispatch(clearAuthError());
    dispatch(loginAdmin(credentials));
  }

  function refreshSnapshot() {
    dispatch(fetchAdminSnapshot({ force: true }));
  }

  function logout() {
    dispatch(adminApi.util.resetApiState());
    dispatch(logoutAdmin());
  }

  if (!token) {
    return (
      <LoginView
        onSubmit={onLogin}
        status={authStatus}
        error={authError}
        apiBaseUrl={getApiBaseUrl()}
      />
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/overview" replace />} />
      <Route
        path="/dashboard"
        element={
          <DashboardLayout
            admin={admin}
            lastUpdatedAt={lastUpdatedAt}
            snapshotStatus={snapshotStatus}
            mutationStatus={mutationStatus}
            lastMessage={lastMessage}
            error={error}
            onRefresh={refreshSnapshot}
            onLogout={logout}
            onDismissError={() => dispatch(clearAdminError())}
          />
        }
      >
        <Route index element={<Navigate to="overview" replace />} />
        <Route path="overview" element={<OverviewPanel dashboard={dashboard} orders={orders} inventory={inventory} />} />
        <Route
          path="orders"
          element={
            <OrdersPanel
              orders={orders}
              mutationStatus={mutationStatus}
              selectedOrder={selectedOrderDetails}
              orderDetailsStatus={orderDetailsStatus}
              onRequestOrderDetails={(orderId) => dispatch(fetchOrderDetails(orderId))}
              onCloseOrderDetails={() => dispatch(clearSelectedOrder())}
            />
          }
        />
        <Route path="products" element={<ProductsPanel products={products} mutationStatus={mutationStatus} />} />
        <Route path="offers" element={<OffersPanel offers={offers} products={products} mutationStatus={mutationStatus} />} />
        <Route path="coupons" element={<CouponsPanel coupons={coupons} mutationStatus={mutationStatus} />} />
        <Route path="tips" element={<TipsPanel tips={tips} mutationStatus={mutationStatus} />} />
        <Route path="content" element={<ContentPanel content={content} mutationStatus={mutationStatus} />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard/overview" replace />} />
    </Routes>
  );
}

export default App;
