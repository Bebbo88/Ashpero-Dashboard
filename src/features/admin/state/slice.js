import { createSlice, isAnyOf } from "@reduxjs/toolkit";
import initialState from "./initialState";
import { replaceById } from "./helpers";
import { logoutAdmin } from "../../auth/authSlice";
import {
  fetchAdminSnapshot,
  updateOrderStatus,
  updateOrderPaymentStatus,
  fetchOrderDetails,
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
  mutationThunks
} from "./thunks";

function isOfferActiveNow(offer) {
  if (!offer || !offer.isActive) {
    return false;
  }

  const now = Date.now();
  const startDate = offer.startDate ? new Date(offer.startDate).getTime() : null;
  const endDate = offer.endDate ? new Date(offer.endDate).getTime() : null;

  if (Number.isFinite(startDate) && now < startDate) {
    return false;
  }

  if (Number.isFinite(endDate) && now > endDate) {
    return false;
  }

  return true;
}

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearAdminError(state) {
      state.error = "";
    },
    clearAdminMessage(state) {
      state.lastMessage = "";
    },
    clearSelectedOrder(state) {
      state.selectedOrderDetails = null;
      state.orderDetailsStatus = "idle";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminSnapshot.pending, (state) => {
        state.snapshotStatus = "loading";
        state.error = "";
      })
      .addCase(fetchAdminSnapshot.fulfilled, (state, action) => {
        state.snapshotStatus = "succeeded";
        state.snapshotLastFetchedAt = Date.now();
        state.snapshotToken = action.payload.snapshotToken || state.snapshotToken;
        state.dashboard = action.payload.dashboard;
        state.inventory = action.payload.inventory;
        state.orders = action.payload.orders;
        state.offers = action.payload.offers;
        state.coupons = action.payload.coupons;
        state.tips = action.payload.tips;
        state.products = action.payload.products;
        state.content = action.payload.content;
      })
      .addCase(fetchAdminSnapshot.rejected, (state, action) => {
        state.snapshotStatus = "failed";
        state.error = action.payload || "Unable to fetch admin snapshot";
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.orders = replaceById(state.orders, action.payload.order);
        const selectedOrderId = String(state.selectedOrderDetails?._id || state.selectedOrderDetails?.id || "");

        if (selectedOrderId && selectedOrderId === String(action.payload.order._id || action.payload.order.id)) {
          state.selectedOrderDetails = {
            ...state.selectedOrderDetails,
            ...action.payload.order
          };
          state.orderDetailsById[selectedOrderId] = state.selectedOrderDetails;
          state.orderDetailsFetchedAtById[selectedOrderId] = Date.now();
        }

        state.lastMessage = action.payload.message;
      })
      .addCase(updateOrderPaymentStatus.fulfilled, (state, action) => {
        state.orders = replaceById(state.orders, action.payload.order);
        const selectedOrderId = String(state.selectedOrderDetails?._id || state.selectedOrderDetails?.id || "");

        if (selectedOrderId && selectedOrderId === String(action.payload.order._id || action.payload.order.id)) {
          state.selectedOrderDetails = {
            ...state.selectedOrderDetails,
            ...action.payload.order
          };
          state.orderDetailsById[selectedOrderId] = state.selectedOrderDetails;
          state.orderDetailsFetchedAtById[selectedOrderId] = Date.now();
        }

        state.lastMessage = action.payload.message;
      })
      .addCase(fetchOrderDetails.pending, (state) => {
        state.orderDetailsStatus = "loading";
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        const orderId = String(action.payload?._id || action.payload?.id || "");
        state.selectedOrderDetails = action.payload;
        state.orderDetailsStatus = "succeeded";

        if (orderId) {
          state.orderDetailsById[orderId] = action.payload;
          state.orderDetailsFetchedAtById[orderId] = Date.now();
        }
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.orderDetailsStatus = "failed";
        state.error = action.payload || "Unable to fetch order details";
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        const createdProduct = action.payload.product;
        const createdProductId = String(createdProduct?._id || createdProduct?.id || "");
        const createdStock = Number(createdProduct?.stock || 0);
        const lowStockThreshold = 5;

        state.products.unshift(action.payload.product);
        state.dashboard.totalProducts = Number(state.dashboard.totalProducts || 0) + 1;

        if (createdProductId) {
          const inventoryRow = {
            id: createdProductId,
            name:
              createdProduct?.name_en ||
              createdProduct?.name_ar ||
              createdProduct?.name ||
              "Unnamed Product",
            currentStock: Number.isFinite(createdStock) ? createdStock : 0,
            lowStock: Number.isFinite(createdStock) ? createdStock <= lowStockThreshold : true
          };

          state.inventory = [inventoryRow, ...state.inventory.filter((item) => String(item.id) !== createdProductId)];
        }

        if (Number.isFinite(createdStock) && createdStock <= lowStockThreshold) {
          state.dashboard.lowStockProducts = Number(state.dashboard.lowStockProducts || 0) + 1;
        }

        state.lastMessage = action.payload.message;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const updatedProductId = String(action.payload.product?._id || action.payload.product?.id || "");
        const previousProduct = state.products.find((item) => String(item._id || item.id) === updatedProductId);
        const previousLowStock = Number(previousProduct?.stock || 0) <= 5;
        const nextLowStock = Number(action.payload.product?.stock || 0) <= 5;

        state.products = replaceById(state.products, action.payload.product);

        state.inventory = state.inventory.map((item) => {
          if (String(item.id) !== updatedProductId) {
            return item;
          }

          return {
            ...item,
            name:
              action.payload.product?.name_en ||
              action.payload.product?.name_ar ||
              action.payload.product?.name ||
              item.name,
            currentStock: Number(action.payload.product?.stock || 0),
            lowStock: nextLowStock
          };
        });

        if (previousLowStock !== nextLowStock) {
          const delta = nextLowStock ? 1 : -1;
          state.dashboard.lowStockProducts = Math.max(0, Number(state.dashboard.lowStockProducts || 0) + delta);
        }

        state.lastMessage = action.payload.message;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const targetId = String(action.payload);
        const removedProduct = state.products.find((item) => String(item._id || item.id) === targetId);

        state.products = state.products.filter(
          (item) => String(item._id || item.id) !== targetId
        );
        state.inventory = state.inventory.filter((item) => String(item.id) !== targetId);
        state.dashboard.totalProducts = Math.max(0, Number(state.dashboard.totalProducts || 0) - 1);

        if (Number(removedProduct?.stock || 0) <= 5) {
          state.dashboard.lowStockProducts = Math.max(0, Number(state.dashboard.lowStockProducts || 0) - 1);
        }

        state.lastMessage = "Product deleted";
      })
      .addCase(updateProductStock.fulfilled, (state, action) => {
        const targetId = String(action.payload.product._id || action.payload.product.id);
        const previousProduct = state.products.find((item) => String(item._id || item.id) === targetId);
        const previousLowStock = Number(previousProduct?.stock || 0) <= 5;
        const nextLowStock = Number(action.payload.product.stock || 0) <= 5;

        state.products = replaceById(state.products, action.payload.product);
        state.inventory = state.inventory.map((item) => {
          if (String(item.id) !== targetId) {
            return item;
          }

          return {
            ...item,
            currentStock: action.payload.product.stock,
            lowStock: action.payload.product.stock <= 5
          };
        });

        if (previousLowStock !== nextLowStock) {
          const delta = nextLowStock ? 1 : -1;
          state.dashboard.lowStockProducts = Math.max(0, Number(state.dashboard.lowStockProducts || 0) + delta);
        }

        state.lastMessage = action.payload.message;
      })
      .addCase(updateProductVideos.fulfilled, (state, action) => {
        state.products = replaceById(state.products, action.payload.product);
        state.lastMessage = action.payload.message;
      })
      .addCase(deleteProductReview.fulfilled, (state, action) => {
        state.products = replaceById(state.products, action.payload.product);
        state.lastMessage = action.payload.message;
      })
      .addCase(createOffer.fulfilled, (state, action) => {
        state.offers.unshift(action.payload.offer);

        if (isOfferActiveNow(action.payload.offer)) {
          state.dashboard.totalActiveOffers = Number(state.dashboard.totalActiveOffers || 0) + 1;
        }

        state.lastMessage = action.payload.message;
      })
      .addCase(updateOffer.fulfilled, (state, action) => {
        const updatedOfferId = String(action.payload.offer?._id || action.payload.offer?.id || "");
        const previousOffer = state.offers.find((item) => String(item._id || item.id) === updatedOfferId);
        const wasActive = isOfferActiveNow(previousOffer);
        const isActive = isOfferActiveNow(action.payload.offer);

        state.offers = replaceById(state.offers, action.payload.offer);

        if (wasActive !== isActive) {
          const delta = isActive ? 1 : -1;
          state.dashboard.totalActiveOffers = Math.max(0, Number(state.dashboard.totalActiveOffers || 0) + delta);
        }

        state.lastMessage = action.payload.message;
      })
      .addCase(deleteOffer.fulfilled, (state, action) => {
        const targetId = String(action.payload);
        const removedOffer = state.offers.find((item) => String(item._id || item.id) === targetId);
        state.offers = state.offers.filter((item) => String(item._id || item.id) !== targetId);

        if (isOfferActiveNow(removedOffer)) {
          state.dashboard.totalActiveOffers = Math.max(0, Number(state.dashboard.totalActiveOffers || 0) - 1);
        }

        state.lastMessage = "Offer deleted";
      })
      .addCase(createCoupon.fulfilled, (state, action) => {
        state.coupons.unshift(action.payload.coupon);
        state.lastMessage = action.payload.message;
      })
      .addCase(updateCoupon.fulfilled, (state, action) => {
        state.coupons = replaceById(state.coupons, action.payload.coupon);
        state.lastMessage = action.payload.message;
      })
      .addCase(deleteCoupon.fulfilled, (state, action) => {
        const targetId = String(action.payload);
        state.coupons = state.coupons.filter((item) => String(item._id || item.id) !== targetId);
        state.lastMessage = "Coupon deleted";
      })
      .addCase(createTip.fulfilled, (state, action) => {
        state.tips.unshift(action.payload.tip);
        state.lastMessage = action.payload.message;
      })
      .addCase(updateTip.fulfilled, (state, action) => {
        state.tips = replaceById(state.tips, action.payload.tip);
        state.lastMessage = action.payload.message;
      })
      .addCase(deleteTip.fulfilled, (state, action) => {
        const targetId = String(action.payload);
        state.tips = state.tips.filter((item) => String(item._id || item.id) !== targetId);
        state.lastMessage = "Tip deleted";
      })
      .addCase(updateSiteContent.fulfilled, (state, action) => {
        state.content = action.payload.content;
        state.lastMessage = action.payload.message;
      })
      .addCase(logoutAdmin, () => initialState)
      .addMatcher(
        isAnyOf(...mutationThunks.map((thunk) => thunk.pending)),
        (state) => {
          state.mutationStatus = "loading";
          state.error = "";
        }
      )
      .addMatcher(
        isAnyOf(...mutationThunks.map((thunk) => thunk.fulfilled)),
        (state) => {
          state.mutationStatus = "succeeded";
        }
      )
      .addMatcher(
        isAnyOf(...mutationThunks.map((thunk) => thunk.rejected)),
        (state, action) => {
          state.mutationStatus = "failed";
          state.error = action.payload || "Request failed";
        }
      );
  }
});

export const { clearAdminError, clearAdminMessage, clearSelectedOrder } = adminSlice.actions;

export default adminSlice.reducer;
