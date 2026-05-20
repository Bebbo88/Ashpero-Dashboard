import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { apiRequest } from "../../../utils/apiClient";
import { getErrorMessage } from "./helpers";

const EMPTY_CONTENT = {
  heroImages: [],
  topBannerText_en: "",
  topBannerText_ar: "",
  banners: [],
  spotlightImages: [],
  popupImage: "",
  popupExpiresAt: null
};

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getAdminSnapshot: builder.query({
      queryFn: async (_arg, { getState }) => {
        try {
          const token = getState().auth.token;

          const [
            dashboardResponse,
            inventoryResponse,
            ordersResponse,
            offersResponse,
            couponsResponse,
            tipsResponse,
            productsResponse,
            contentResponse
          ] = await Promise.all([
            apiRequest("/admin/dashboard", { token }),
            apiRequest("/admin/inventory", { token }),
            apiRequest("/admin/orders", { token }),
            apiRequest("/admin/offers", { token }),
            apiRequest("/admin/coupons", { token }),
            apiRequest("/admin/tips", { token }),
            apiRequest("/products", { token }),
            apiRequest("/content", { token })
          ]);

          return {
            data: {
              snapshotToken: token,
              dashboard: dashboardResponse.data || {},
              inventory: inventoryResponse.data || [],
              orders: ordersResponse.data || [],
              offers: offersResponse.data || [],
              coupons: couponsResponse.data || [],
              tips: tipsResponse.data || [],
              products: productsResponse.data || [],
              content: contentResponse.data || EMPTY_CONTENT
            }
          };
        } catch (error) {
          return {
            error: {
              message: getErrorMessage(error)
            }
          };
        }
      }
    }),
    getOrderDetails: builder.query({
      queryFn: async (orderId, { getState }) => {
        try {
          const token = getState().auth.token;
          const response = await apiRequest(`/admin/orders/${orderId}`, {
            token
          });

          return { data: response.data || null };
        } catch (error) {
          return {
            error: {
              message: getErrorMessage(error)
            }
          };
        }
      },
      keepUnusedDataFor: 180
    })
  })
});
