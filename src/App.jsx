import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import LoginView from "./components/layout/LoginView";
import DashboardLayout from "./components/layout/DashboardLayout";
import OverviewPanel from "./components/dashboard/overview";
import OrdersPanel from "./components/dashboard/orders";
import ProductsPanel from "./components/dashboard/products/ProductsPanel";
import VideoReviewsPanel from "./components/dashboard/videoReviews/VideoReviewsPanel";
import OffersPanel from "./components/dashboard/offers";
import CouponsPanel from "./components/dashboard/coupons";
import TipsPanel from "./components/dashboard/tips";
import ContentPanel from "./components/dashboard/content";
import ReviewsPanel from "./components/dashboard/reviews/ReviewsPanel";
import ShippingPanel from "./components/dashboard/shipping/ShippingPanel";
import { clearAuthError, loginAdmin, logoutAdmin, refreshAdminToken } from "./features/auth/authSlice";
import {
  clearAdminError,
  fetchAdminSnapshot,
  clearAdminMessage,
  fetchOrderDetails,
  clearSelectedOrder
} from "./features/admin/adminSlice";
import { adminApi } from "./features/admin/state/api";
import { getApiBaseUrl } from "./utils/apiClient";

function App() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.auth.token);
  const authStatus = useAppSelector((state) => state.auth.status);
  const authError = useAppSelector((state) => state.auth.error);
  const admin = useAppSelector((state) => state.auth.admin);

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
    shippingSettings,
    snapshotStatus,
    mutationStatus,
    error,
    lastMessage
  } = useAppSelector((state) => state.admin);

  const [lastUpdatedAt, setLastUpdatedAt] = useState("");

  const role = admin?.role || "super_admin";
  const isOrderManager = role === "order_manager";
  const defaultDashboardPath = isOrderManager ? "/dashboard/orders" : "/dashboard/overview";

  // Silent refresh on mount if token is absent
  useEffect(() => {
    if (!token && authStatus === "idle") {
      dispatch(refreshAdminToken());
    }
  }, [dispatch, token, authStatus]);

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
      <Route path="/" element={<Navigate to={defaultDashboardPath} replace />} />
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
        <Route index element={<Navigate to={isOrderManager ? "orders" : "overview"} replace />} />
        
        {/* Orders panel accessible by all authorized roles */}
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

        {/* Super Admin exclusive routes */}
        {!isOrderManager && (
          <>
            <Route path="overview" element={<OverviewPanel dashboard={dashboard} orders={orders} inventory={inventory} />} />
            <Route path="products" element={<ProductsPanel products={products} mutationStatus={mutationStatus} />} />
            <Route path="shipping" element={<ShippingPanel shippingSettings={shippingSettings} mutationStatus={mutationStatus} />} />
            <Route path="text-reviews" element={<ReviewsPanel products={products} mutationStatus={mutationStatus} />} />
            <Route path="video-reviews" element={<VideoReviewsPanel products={products} mutationStatus={mutationStatus} />} />
            <Route path="offers" element={<OffersPanel offers={offers} products={products} mutationStatus={mutationStatus} />} />
            <Route path="coupons" element={<CouponsPanel coupons={coupons} mutationStatus={mutationStatus} />} />
            <Route path="tips" element={<TipsPanel tips={tips} mutationStatus={mutationStatus} />} />
            <Route path="content" element={<ContentPanel content={content} mutationStatus={mutationStatus} />} />
          </>
        )}

        <Route path="*" element={<Navigate to={defaultDashboardPath} replace />} />
      </Route>
      <Route path="*" element={<Navigate to={defaultDashboardPath} replace />} />
    </Routes>
  );
}

export default App;
