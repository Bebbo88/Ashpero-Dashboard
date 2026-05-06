import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAppDispatch } from "../../../app/hooks";
import {
  updateOrderPaymentStatus,
  updateOrderStatus
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
  onCloseOrderDetails
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
        onRequestOrderDetails
      }),
    [
      mutationStatus,
      resolveStatus,
      resolvePaymentStatus,
      handleStatusChange,
      handleStatusSave,
      handlePaymentStatusChange,
      handlePaymentStatusSave,
      onRequestOrderDetails
    ]
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
      [id]: value
    }));
  }

  function handlePaymentStatusChange(id, value) {
    setDraftPaymentStatus((previous) => ({
      ...previous,
      [id]: value
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
          orderStatus: nextStatus
        })
      ).unwrap();

      setDraftStatus((previous) => {
        const nextDraft = { ...previous };
        delete nextDraft[id];
        return nextDraft;
      });
    } catch (_error) {
      // Error state is surfaced through admin slice.
    }
  }

  async function handlePaymentStatusSave(id, currentStatus) {
    const nextStatus = draftPaymentStatus[id] || currentStatus;

    if (nextStatus === currentStatus) {
      return;
    }

    try {
      await dispatch(
        updateOrderPaymentStatus({
          orderId: id,
          paymentStatus: nextStatus
        })
      ).unwrap();

      setDraftPaymentStatus((previous) => {
        const nextDraft = { ...previous };
        delete nextDraft[id];
        return nextDraft;
      });
    } catch (_error) {
      // Error state is surfaced through admin slice.
    }
  }

  return (
    <section className="space-y-4">
      <article className="panel p-4">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-900">Order Operations</h3>
          <p className="text-xs text-slate-500">Update fulfillment state and inspect full order details.</p>
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
                  page: 0
                }
              }
            }}
            disableRowSelectionOnClick
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                borderBottomColor: "#e2e8f0"
              },
              "& .MuiDataGrid-cell": {
                borderBottomColor: "#eef2ff"
              }
            }}
          />
        </div>
      </article>

      <article className="panel p-4">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Selected Order Details</h3>
            <p className="text-xs text-slate-500">Powered by `/admin/orders/:id` endpoint.</p>
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
          <p className="text-sm text-slate-500">Click "View" on any row to inspect complete order details.</p>
        ) : null}

        {selectedOrder ? (
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Customer</p>
              <p className="mt-2 text-sm font-semibold text-slate-900">{selectedOrder.customerName}</p>
              <p className="text-xs text-slate-600">{selectedOrder.phone}</p>
              <p className="mt-1 text-xs text-slate-600">{selectedOrder.address}</p>
              <p className="mt-1 text-xs text-slate-600">{selectedOrder.email || "No email"}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Order Info</p>
              <p className="mt-2 text-xs text-slate-700">Order Ref: {selectedOrder.merchantOrderId || selectedOrder._id}</p>
              <p className="text-xs text-slate-700">Status: {selectedOrder.orderStatus}</p>
              <p className="text-xs text-slate-700">Payment: {selectedOrder.paymentStatus}</p>
              <p className="text-xs text-slate-700">Method: {selectedOrder.paymentMethod}</p>
              <p className="text-xs text-slate-700">Total: {formatCurrency(selectedOrder.finalPrice || selectedOrder.totalPrice)}</p>
              <p className="text-xs text-slate-700">Created: {formatDateTime(selectedOrder.createdAt)}</p>
              <p className="text-xs text-slate-700">Reference: {selectedOrder.paymentReference || "N/A"}</p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 md:col-span-2">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Items</p>
              <ul className="mt-2 space-y-2 text-xs text-slate-700">
                {(selectedOrder.items || []).map((item) => (
                  <li key={item._id || item.productId?._id || item.productId} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <p className="font-semibold text-slate-800">
                      {item.productName || item.productId?.name_en || item.productId?.name || "Product"}
                    </p>
                    <p>
                      Qty: {item.quantity} | Unit: {formatCurrency(item.unitPrice || item.priceAtPurchase)} | Final: {formatCurrency(item.priceAtPurchase)}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ) : null}
      </article>
    </section>
  );
}

export default OrdersPanel;
