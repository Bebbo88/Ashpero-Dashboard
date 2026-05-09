import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAppDispatch } from "../../../app/hooks";
import {
  updateOrderPaymentStatus,
  updateOrderStatus,
} from "../../../features/admin/adminSlice";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";
import { getOrdersColumns } from "./columns";
import { mapOrderRows, ORDER_STATUSES, PAYMENT_STATUSES } from "./helpers";

function OrdersPanel({
  orders,
  mutationStatus,
  selectedOrder,
  orderDetailsStatus,
  onRequestOrderDetails,
  onCloseOrderDetails,
}) {
  const dispatch = useAppDispatch();

  const [draftStatus, setDraftStatus] = useState({});
  const [draftPaymentStatus, setDraftPaymentStatus] = useState({});

  const rows = useMemo(() => mapOrderRows(orders), [orders]);

  const columns = useMemo(
    () =>
      getOrdersColumns({
        statuses: ORDER_STATUSES,
        paymentStatuses: PAYMENT_STATUSES,
        mutationStatus,
        resolveStatus,
        resolvePaymentStatus,
        onStatusChange: handleStatusChange,
        onStatusSave: handleStatusSave,
        onPaymentStatusChange: handlePaymentStatusChange,
        onPaymentStatusSave: handlePaymentStatusSave,
        onRequestOrderDetails,
      }),
    [mutationStatus, onRequestOrderDetails, draftStatus, draftPaymentStatus],
  );

  function resolveStatus(row) {
    return draftStatus[row.id] || row.orderStatus;
  }

  function resolvePaymentStatus(row) {
    return draftPaymentStatus[row.id] || row.paymentStatus;
  }

  function handleStatusChange(id, value) {
    setDraftStatus((previous) => ({
      ...previous,
      [id]: value,
    }));
  }

  function handlePaymentStatusChange(id, value) {
    setDraftPaymentStatus((previous) => ({
      ...previous,
      [id]: value,
    }));
  }

  async function handleStatusSave(id, currentStatus) {
    const nextStatus = draftStatus[id] || currentStatus;

    if (nextStatus === currentStatus) {
      return;
    }

    try {
      await dispatch(
        updateOrderStatus({
          orderId: id,
          orderStatus: nextStatus,
        }),
      ).unwrap();

      setDraftStatus((previous) => {
        const nextDraft = { ...previous };
        delete nextDraft[id];
        return nextDraft;
      });
    } catch (_error) {
      // handled in slice
    }
  }

  async function handlePaymentStatusSave(id, currentStatus, paymentMethod) {
    if (paymentMethod !== "cash_on_delivery") {
      return;
    }

    const nextStatus = draftPaymentStatus[id] || currentStatus;

    if (nextStatus === currentStatus) {
      return;
    }

    try {
      await dispatch(
        updateOrderPaymentStatus({
          orderId: id,
          paymentStatus: nextStatus,
        }),
      ).unwrap();

      setDraftPaymentStatus((previous) => {
        const nextDraft = { ...previous };
        delete nextDraft[id];
        return nextDraft;
      });
    } catch (_error) {
      // handled in slice
    }
  }

  function getStatusBadgeClass(status) {
    switch (status) {
      case "delivered":
      case "paid":
        return "bg-emerald-100 text-emerald-700";

      case "pending":
      case "processing":
      case "shipped":
        return "bg-amber-100 text-amber-700";

      case "cancelled":
      case "failed":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <section className="space-y-4">
      <article className="panel p-4">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-900">Order Operations</h3>

          <p className="text-xs text-slate-500">
            Update fulfillment state and inspect full order details.
          </p>
        </div>

        <div className="h-[560px] w-full">
          <DataGrid
            rows={rows}
            columns={columns}
            pageSizeOptions={[10, 20, 50]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                  page: 0,
                },
              },
            }}
            disableRowSelectionOnClick
            sx={{
              border: 0,

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                borderBottomColor: "#e2e8f0",
              },

              "& .MuiDataGrid-cell": {
                borderBottomColor: "#eef2ff",
              },
            }}
          />
        </div>
      </article>

      <article className="panel p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Selected Order Details
            </h3>

            <p className="text-xs text-slate-500">
              Powered by `/admin/orders/:id` endpoint.
            </p>
          </div>

          {selectedOrder ? (
            <button
              type="button"
              onClick={onCloseOrderDetails}
              className="rounded border border-slate-300 px-3 py-1 text-xs font-semibold text-slate-700"
            >
              Clear
            </button>
          ) : null}
        </div>

        {orderDetailsStatus === "loading" ? (
          <p className="text-sm text-slate-600">Loading order details...</p>
        ) : null}

        {!selectedOrder && orderDetailsStatus !== "loading" ? (
          <p className="text-sm text-slate-500">
            Click "View" on any row to inspect complete order details.
          </p>
        ) : null}

        {selectedOrder ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Customer
              </p>

              <p className="mt-2 text-sm font-semibold text-slate-900">
                {selectedOrder.customerName}
              </p>

              <p className="text-xs text-slate-600">{selectedOrder.phone}</p>

              {selectedOrder.secondaryPhone ? (
                <p className="text-xs text-slate-600">
                  Secondary: {selectedOrder.secondaryPhone}
                </p>
              ) : null}

              <p className="mt-1 break-words text-xs text-slate-600">
                {selectedOrder.address}
              </p>

              <p className="mt-1 break-all text-xs text-slate-600">
                {selectedOrder.email || "No email"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Order Info
              </p>

              <p className="mt-2 break-all text-xs text-slate-700">
                Order Ref: {selectedOrder.merchantOrderId || selectedOrder._id}
              </p>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold text-slate-500">
                  Order:
                </span>

                <span
                  className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getStatusBadgeClass(
                    selectedOrder.orderStatus,
                  )}`}
                >
                  {selectedOrder.orderStatus}
                </span>

                <span className="text-[11px] font-semibold text-slate-500">
                  Payment:
                </span>

                <span
                  className={`rounded-full px-2 py-1 text-[11px] font-semibold ${getStatusBadgeClass(
                    selectedOrder.paymentStatus,
                  )}`}
                >
                  {selectedOrder.paymentStatus}
                </span>
              </div>

              <p className="mt-3 text-xs text-slate-700">
                Method: {selectedOrder.paymentMethod}
              </p>

              <p className="text-xs text-slate-700">
                Items: {selectedOrder.items?.length || 0}
              </p>

              <p className="text-xs text-slate-700">
                Total:{" "}
                {formatCurrency(
                  selectedOrder.finalPrice || selectedOrder.totalPrice,
                )}
              </p>

              <p className="text-xs text-slate-700">
                Created: {formatDateTime(selectedOrder.createdAt)}
              </p>

              <p className="break-all text-xs text-slate-700">
                Reference:{" "}
                {selectedOrder.paymentReference
                  ? `${selectedOrder.paymentReference.slice(0, 30)}...`
                  : "N/A"}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                Items
              </p>

              <div className="mt-3 flex flex-wrap gap-3">
                {(selectedOrder.items || []).map((item) => (
                  <div
                    key={item._id || item.productId?._id || item.productId}
                    className="min-w-[260px] flex-1 rounded-xl border border-slate-200 bg-white p-3"
                  >
                    <p className="font-semibold text-slate-800">
                      {item.productName ||
                        item.productId?.name_en ||
                        item.productId?.name ||
                        "Product"}
                    </p>

                    {item.selectedSize ? (
                      <span className="mt-2 inline-flex rounded-full bg-slate-100 px-2 py-1 text-[11px] font-semibold text-slate-700">
                        Size: {item.selectedSize}
                      </span>
                    ) : null}

                    <div className="mt-3 space-y-1 text-xs text-slate-600">
                      <p>
                        Quantity:{" "}
                        <span className="font-semibold">{item.quantity}</span>
                      </p>

                      <p>
                        Unit Price:{" "}
                        <span className="font-semibold">
                          {formatCurrency(
                            item.unitPrice || item.priceAtPurchase,
                          )}
                        </span>
                      </p>

                      <p>
                        Final Total:{" "}
                        <span className="font-semibold text-slate-800">
                          {formatCurrency(
                            (item.priceAtPurchase || 0) * (item.quantity || 0),
                          )}
                        </span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </article>
    </section>
  );
}

export default OrdersPanel;
