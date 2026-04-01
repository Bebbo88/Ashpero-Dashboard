import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAppDispatch } from "../../../app/hooks";
import { updateOrderStatus } from "../../../features/admin/adminSlice";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";

const ORDER_STATUSES = ["new", "processing", "shipped", "delivered"];

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

  const rows = useMemo(
    () =>
      [...orders]
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .map((order) => ({
          id: order._id,
          customerName: order.customerName,
          phone: order.phone,
          address: order.address,
          totalPrice: order.totalPrice,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          itemsCount: Array.isArray(order.items) ? order.items.length : 0,
          createdAt: order.createdAt
        })),
    [orders]
  );

  function resolveStatus(row) {
    return draftStatus[row.id] || row.orderStatus;
  }

  function handleStatusChange(id, value) {
    setDraftStatus((previous) => ({
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
            columns={[
              {
                field: "customerName",
                headerName: "Customer",
                minWidth: 140,
                flex: 1
              },
              {
                field: "phone",
                headerName: "Phone",
                minWidth: 130,
                flex: 1
              },
              {
                field: "itemsCount",
                headerName: "Items",
                minWidth: 80,
                flex: 0.6
              },
              {
                field: "totalPrice",
                headerName: "Total",
                minWidth: 110,
                flex: 0.8,
                valueFormatter: (value) => formatCurrency(value)
              },
              {
                field: "paymentStatus",
                headerName: "Payment",
                minWidth: 110,
                flex: 0.7
              },
              {
                field: "createdAt",
                headerName: "Created",
                minWidth: 170,
                flex: 1,
                valueFormatter: (value) => formatDateTime(value)
              },
              {
                field: "orderStatus",
                headerName: "Status",
                minWidth: 210,
                flex: 1.3,
                sortable: false,
                renderCell: (params) => (
                  <div className="flex w-full items-center gap-2 py-1">
                    <select
                      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold"
                      value={resolveStatus(params.row)}
                      onChange={(event) => handleStatusChange(params.row.id, event.target.value)}
                    >
                      {ORDER_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      onClick={() => handleStatusSave(params.row.id, params.row.orderStatus)}
                      disabled={mutationStatus === "loading"}
                      className="table-action-btn table-action-btn--neutral disabled:opacity-60"
                    >
                      Save
                    </button>
                  </div>
                )
              },
              {
                field: "detail",
                headerName: "Details",
                minWidth: 100,
                flex: 0.6,
                sortable: false,
                renderCell: (params) => (
                  <button
                    type="button"
                    onClick={() => onRequestOrderDetails(params.row.id)}
                    className="table-action-btn table-action-btn--primary"
                  >
                    View
                  </button>
                )
              }
            ]}
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
              <p className="mt-2 text-xs text-slate-700">Status: {selectedOrder.orderStatus}</p>
              <p className="text-xs text-slate-700">Payment: {selectedOrder.paymentStatus}</p>
              <p className="text-xs text-slate-700">Total: {formatCurrency(selectedOrder.totalPrice)}</p>
              <p className="text-xs text-slate-700">Created: {formatDateTime(selectedOrder.createdAt)}</p>
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
