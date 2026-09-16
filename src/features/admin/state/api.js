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
  popupExpiresAt: null,
  productsBannerImage: "",
  offersBannerImage: "",
  countdownEnabled: false,
  countdownTargetDate: null,
  countdownTitle_en: "",
  countdownTitle_ar: ""
};

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fakeBaseQuery(),
  keepUnusedDataFor: 300,
  endpoints: (builder) => ({
    getAdminSnapshot: builder.query({
      queryFn: async (_arg, { getState }) => {
        try {
          const state = getState();
          const token = state.auth.token;
          const adminRole = state.auth.admin?.role;
          // Fail closed: only an explicit "super_admin" gets the full,
          // privileged snapshot — a missing/unrecognized role (corrupted
          // profile, a future role value this client doesn't know about)
          // gets the restricted, orders-only view instead of silently
          // defaulting to full access.
          const isRestrictedToOrders = adminRole !== "super_admin";

          if (isRestrictedToOrders) {
            const ordersResponse = await apiRequest("/admin/orders", { token });
            return {
              data: {
                snapshotToken: token,
                dashboard: {},
                inventory: [],
                orders: ordersResponse.data || [],
                offers: [],
                coupons: [],
                tips: [],
                products: [],
                content: EMPTY_CONTENT,
                shippingSettings: {
                  globalFreeShipping: false,
                  defaultShippingCost: 50,
                  governorates: []
                }
              }
            };
          }

          const [
            dashboardResponse,
            inventoryResponse,
            ordersResponse,
            offersResponse,
            couponsResponse,
            tipsResponse,
            activeProductsResponse,
            inactiveProductsResponse,
            contentResponse,
            shippingResponse
          ] = await Promise.all([
            apiRequest("/admin/dashboard", { token }),
            apiRequest("/admin/inventory", { token }),
            apiRequest("/admin/orders", { token }),
            apiRequest("/admin/offers", { token }),
            apiRequest("/admin/coupons", { token }),
            apiRequest("/admin/tips", { token }),
            // The public /products endpoint defaults to isActive:true (correct
            // for the storefront) — the admin table needs both, otherwise a
            // product an admin deactivates disappears from their own view
            // with no way to find and re-activate it.
            apiRequest("/products?isActive=true", { token }),
            apiRequest("/products?isActive=false", { token }),
            apiRequest("/content", { token }),
            apiRequest("/admin/shipping", { token })
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
              products: [
                ...(activeProductsResponse.data || []),
                ...(inactiveProductsResponse.data || [])
              ],
              content: contentResponse.data || EMPTY_CONTENT,
              shippingSettings: shippingResponse.data || {
                globalFreeShipping: false,
                defaultShippingCost: 50,
                governorates: []
              }
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
    getFilteredOrders: builder.query({
      queryFn: async ({ orderStatus, search } = {}, { getState }) => {
        try {
          const token = getState().auth.token;
          const params = new URLSearchParams();

          if (orderStatus) {
            params.set("orderStatus", orderStatus);
          }

          if (search) {
            params.set("search", search);
          }

          const queryString = params.toString();
          const response = await apiRequest(
            `/admin/orders${queryString ? `?${queryString}` : ""}`,
            { token }
          );

          return { data: response.data || [] };
        } catch (error) {
          return {
            error: {
              message: getErrorMessage(error)
            }
          };
        }
      },
      keepUnusedDataFor: 30
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
