import { createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../../utils/apiClient";
import { getErrorMessage } from "./helpers";
import { adminApi } from "./api";

export const fetchAdminSnapshot = createAsyncThunk(
  "admin/fetchAdminSnapshot",
  async (arg, { dispatch, rejectWithValue }) => {
    try {
      const forceRefetch = Boolean(arg?.force);
      const data = await dispatch(
        adminApi.endpoints.getAdminSnapshot.initiate(undefined, {
          subscribe: false,
          forceRefetch
        })
      ).unwrap();

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
  {
    condition: (arg, { getState }) => {
      const state = getState();
      const force = Boolean(arg?.force);
      const token = state.auth.token || "";
      const adminState = state.admin;

      if (!token) {
        return false;
      }

      if (adminState.snapshotStatus === "loading") {
        return false;
      }

      if (force) {
        return true;
      }

      if (adminState.snapshotStatus === "succeeded" && adminState.snapshotToken === token) {
        return false;
      }

      return true;
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ orderId, orderStatus }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest(`/admin/orders/${orderId}/status`, {
        method: "PATCH",
        token,
        body: { orderStatus }
      });

      return {
        order: response.data,
        message: response.message || "Order status updated"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateOrderPaymentStatus = createAsyncThunk(
  "admin/updateOrderPaymentStatus",
  async ({ orderId, paymentStatus }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest(`/admin/orders/${orderId}/payment-status`, {
        method: "PATCH",
        token,
        body: { paymentStatus }
      });

      return {
        order: response.data,
        message: response.message || "Payment status updated"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateOrderDetails = createAsyncThunk(
  "admin/updateOrderDetails",
  async ({ orderId, payload }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest(`/admin/orders/${orderId}`, {
        method: "PATCH",
        token,
        body: payload
      });

      return {
        order: response.data,
        message: response.message || "Order updated successfully"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "admin/fetchOrderDetails",
  async (orderId, { getState, rejectWithValue }) => {
    try {
      const normalizedOrderId = String(orderId || "").trim();
      const token = getState().auth.token;
      const response = await apiRequest(`/admin/orders/${normalizedOrderId}`, {
        token
      });

      return response.data || null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest("/admin/products", {
        method: "POST",
        token,
        body: formData,
        isFormData: true
      });

      return {
        product: response.data,
        message: response.message || "Product created"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({ productId, formData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest(`/admin/products/${productId}`, {
        method: "PUT",
        token,
        body: formData,
        isFormData: true
      });

      return {
        product: response.data,
        message: response.message || "Product updated"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async (productId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await apiRequest(`/admin/products/${productId}`, {
        method: "DELETE",
        token
      });

      return productId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateProductStock = createAsyncThunk(
  "admin/updateProductStock",
  async ({ productId, stock }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest(`/admin/products/${productId}/stock`, {
        method: "PATCH",
        token,
        body: { stock }
      });

      return {
        product: response.data,
        message: response.message || "Product stock updated"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createOffer = createAsyncThunk(
  "admin/createOffer",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest("/admin/offers", {
        method: "POST",
        token,
        body: formData,
        isFormData: true
      });

      return {
        offer: response.data,
        message: response.message || "Offer created"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateOffer = createAsyncThunk(
  "admin/updateOffer",
  async ({ offerId, formData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest(`/admin/offers/${offerId}`, {
        method: "PUT",
        token,
        body: formData,
        isFormData: true
      });

      return {
        offer: response.data,
        message: response.message || "Offer updated"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteOffer = createAsyncThunk(
  "admin/deleteOffer",
  async (offerId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await apiRequest(`/admin/offers/${offerId}`, {
        method: "DELETE",
        token
      });

      return offerId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createCoupon = createAsyncThunk(
  "admin/createCoupon",
  async (body, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest("/admin/coupons", {
        method: "POST",
        token,
        body
      });

      return {
        coupon: response.data,
        message: response.message || "Coupon created"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateCoupon = createAsyncThunk(
  "admin/updateCoupon",
  async ({ couponId, body }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest(`/admin/coupons/${couponId}`, {
        method: "PUT",
        token,
        body
      });

      return {
        coupon: response.data,
        message: response.message || "Coupon updated"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteCoupon = createAsyncThunk(
  "admin/deleteCoupon",
  async (couponId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await apiRequest(`/admin/coupons/${couponId}`, {
        method: "DELETE",
        token
      });

      return couponId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createTip = createAsyncThunk(
  "admin/createTip",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest("/admin/tips", {
        method: "POST",
        token,
        body: formData,
        isFormData: true
      });

      return {
        tip: response.data,
        message: response.message || "Tip created"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateTip = createAsyncThunk(
  "admin/updateTip",
  async ({ tipId, formData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest("/admin/tips/" + tipId, {
        method: "PUT",
        token,
        body: formData,
        isFormData: true
      });

      return {
        tip: response.data,
        message: response.message || "Tip updated"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteTip = createAsyncThunk(
  "admin/deleteTip",
  async (tipId, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      await apiRequest(`/admin/tips/${tipId}`, {
        method: "DELETE",
        token
      });

      return tipId;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateSiteContent = createAsyncThunk(
  "admin/updateSiteContent",
  async (formData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest("/admin/content", {
        method: "PUT",
        token,
        body: formData,
        isFormData: true
      });

      return {
        content: response.data,
        message: response.message || "Site content updated"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateProductVideos = createAsyncThunk(
  "admin/updateProductVideos",
  async ({ productId, formData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest(`/admin/products/${productId}/videos`, {
        method: "PUT",
        token,
        body: formData,
        isFormData: true
      });

      return {
        product: response.data,
        message: response.message || "Product videos updated"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteProductReview = createAsyncThunk(
  "admin/deleteProductReview",
  async ({ productId, reviewId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest(`/admin/products/${productId}/reviews/${reviewId}`, {
        method: "DELETE",
        token
      });

      return {
        product: response.data,
        message: response.message || "Product review deleted"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateShippingSettings = createAsyncThunk(
  "admin/updateShippingSettings",
  async (body, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token;
      const response = await apiRequest("/admin/shipping", {
        method: "PUT",
        token,
        body
      });

      return {
        shippingSettings: response.data,
        message: response.message || "Shipping settings updated"
      };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const mutationThunks = [
  updateOrderStatus,
  updateOrderPaymentStatus,
  updateOrderDetails,
  createProduct,
  updateProduct,
  deleteProduct,
  updateProductStock,
  updateProductVideos,
  createOffer,
  updateOffer,
  deleteOffer,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  createTip,
  updateTip,
  deleteTip,
  updateSiteContent,
  deleteProductReview,
  updateShippingSettings
];
