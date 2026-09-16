import { lazy, useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import LoginView from "./components/layout/LoginView";
import DashboardLayout from "./components/layout/DashboardLayout";

// Lazy-loaded so a role that only ever sees Orders (order_manager) doesn't
// download every other panel's code (and its dependencies, e.g. Chart.js).
const OverviewPanel = lazy(() => import("./components/dashboard/overview"));
const OrdersPanel = lazy(() => import("./components/dashboard/orders"));
const ProductsPanel = lazy(() => import("./components/dashboard/products/ProductsPanel"));
const VideoReviewsPanel = lazy(() => import("./components/dashboard/videoReviews/VideoReviewsPanel"));
const OffersPanel = lazy(() => import("./components/dashboard/offers"));
const CouponsPanel = lazy(() => import("./components/dashboard/coupons"));
const TipsPanel = lazy(() => import("./components/dashboard/tips"));
const ContentPanel = lazy(() => import("./components/dashboard/content"));
const ReviewsPanel = lazy(() => import("./components/dashboard/reviews/ReviewsPanel"));
const ShippingPanel = lazy(() => import("./components/dashboard/shipping/ShippingPanel"));
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

  // Fail closed: an unrecognized/missing role should see the *least*
  // privileged view, never silently default to full super_admin access.
  const role = admin?.role || "order_manager";
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
      // This unmounts every panel immediately, discarding any unsaved form
      // input (a half-written product description, an in-progress offer,
      // etc.) with no other warning. The alert blocks here specifically so
      // the still-visible form stays on screen long enough to copy anything
      // important before the forced logout below tears it down.
      window.alert(
        "Your session has expired. Please copy any unsaved changes now — you'll need to log in again after closing this message."
      );

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
              snapshotStatus={snapshotStatus}
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
            <Route path="overview" element={<OverviewPanel dashboard={dashboard} orders={orders} inventory={inventory} snapshotStatus={snapshotStatus} />} />
            <Route path="products" element={<ProductsPanel products={products} mutationStatus={mutationStatus} snapshotStatus={snapshotStatus} />} />
            <Route path="shipping" element={<ShippingPanel shippingSettings={shippingSettings} mutationStatus={mutationStatus} snapshotStatus={snapshotStatus} />} />
            <Route path="text-reviews" element={<ReviewsPanel products={products} mutationStatus={mutationStatus} snapshotStatus={snapshotStatus} />} />
            <Route path="video-reviews" element={<VideoReviewsPanel products={products} mutationStatus={mutationStatus} snapshotStatus={snapshotStatus} />} />
            <Route path="offers" element={<OffersPanel offers={offers} products={products} mutationStatus={mutationStatus} snapshotStatus={snapshotStatus} />} />
            <Route path="coupons" element={<CouponsPanel coupons={coupons} mutationStatus={mutationStatus} snapshotStatus={snapshotStatus} />} />
            <Route path="tips" element={<TipsPanel tips={tips} mutationStatus={mutationStatus} snapshotStatus={snapshotStatus} />} />
            <Route path="content" element={<ContentPanel content={content} mutationStatus={mutationStatus} snapshotStatus={snapshotStatus} />} />
          </>
        )}

        <Route path="*" element={<Navigate to={defaultDashboardPath} replace />} />
      </Route>
      <Route path="*" element={<Navigate to={defaultDashboardPath} replace />} />
    </Routes>
  );
}

export default App;
