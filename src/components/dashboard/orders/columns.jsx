import { formatCurrency, formatDateTime } from "../../../utils/formatters";
import { ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "./helpers";

export function getOrdersColumns({
  statuses,
  paymentStatuses,
  mutationStatus,
  resolveStatus,
  resolvePaymentStatus,
  onStatusChange,
  onStatusSave,
  onPaymentStatusChange,
  onPaymentStatusSave,
  onRequestOrderDetails,
}) {
  return [
    {
      field: "merchantOrderId",
      headerName: "Order Ref",
      minWidth: 140,
      flex: 0.9,
      renderCell: (params) => (
        <div className="flex flex-col justify-center py-1">
          <span className="font-mono text-xs font-bold text-slate-900">
            {params.row.merchantOrderId}
          </span>
          <span className="text-[10px] text-slate-600">
            {formatDateTime(params.row.createdAt)}
          </span>
        </div>
      ),
    },
    {
      field: "customerName",
      headerName: "Customer",
      minWidth: 160,
      flex: 1.1,
      renderCell: (params) => (
        <div className="flex flex-col justify-center py-1">
          <span className="text-xs font-semibold text-slate-900">
            {params.row.customerName}
          </span>
          <span className="text-[11px] text-slate-600 font-mono">
            {params.row.phone}
          </span>
        </div>
      ),
    },
    {
      field: "location",
      headerName: "Destination",
      minWidth: 140,
      flex: 0.9,
      renderCell: (params) => (
        <div className="flex flex-col justify-center py-1">
          <span className="text-xs font-medium text-slate-800">
            {params.row.governorate || "Egypt"}
          </span>
          <span className="truncate text-[10px] text-slate-600">
            {params.row.city || params.row.address}
          </span>
        </div>
      ),
    },
    {
      field: "totalPrice",
      headerName: "Total",
      minWidth: 110,
      flex: 0.8,
      renderCell: (params) => (
        <div className="flex flex-col justify-center py-1">
          <span className="text-xs font-bold text-slate-900">
            {formatCurrency(params.row.totalPrice)}
          </span>
          <span className="text-[10px] text-slate-600">
            {params.row.itemsCount} {params.row.itemsCount === 1 ? "item" : "items"}
          </span>
        </div>
      ),
    },
    {
      field: "paymentStatus",
      headerName: "Payment",
      minWidth: 230,
      flex: 1.3,
      sortable: false,
      renderCell: (params) => {
        const currentPaymentStatus = resolvePaymentStatus(params.row);
        const config = PAYMENT_STATUS_CONFIG[currentPaymentStatus] || PAYMENT_STATUS_CONFIG.pending;
        const isModified = currentPaymentStatus !== params.row.paymentStatus;

        return (
          <div className="flex w-full items-center gap-1.5 py-1">
            <select
              className={`rounded-lg border px-2 py-1 text-xs font-semibold shadow-sm transition ${
                isModified
                  ? "border-brand-mint ring-2 ring-brand-mint/20 bg-amber-50"
                  : "border-slate-300 bg-white"
              }`}
              value={currentPaymentStatus}
              onChange={(event) =>
                onPaymentStatusChange(params.row.id, event.target.value)
              }
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status.toUpperCase()}
                </option>
              ))}
            </select>

            {isModified && (
              <button
                type="button"
                onClick={() =>
                  onPaymentStatusSave(
                    params.row.id,
                    params.row.paymentStatus,
                    params.row.paymentMethod
                  )
                }
                disabled={mutationStatus === "loading"}
                className="rounded-md bg-brand-mint px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow-sm hover:bg-brand-mint/90 disabled:opacity-60"
              >
                Save
              </button>
            )}

            <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-slate-600">
              {params.row.paymentMethod}
            </span>
          </div>
        );
      },
    },
    {
      field: "orderStatus",
      headerName: "Order Status",
      minWidth: 220,
      flex: 1.3,
      sortable: false,
      renderCell: (params) => {
        const currentStatus = resolveStatus(params.row);
        const config = ORDER_STATUS_CONFIG[currentStatus] || ORDER_STATUS_CONFIG.new;
        const isModified = currentStatus !== params.row.orderStatus;

        return (
          <div className="flex w-full items-center gap-1.5 py-1">
            <select
              className={`rounded-lg border px-2 py-1 text-xs font-semibold shadow-sm transition ${
                isModified
                  ? "border-brand-mint ring-2 ring-brand-mint/20 bg-amber-50"
                  : "border-slate-300 bg-white"
              }`}
              value={currentStatus}
              onChange={(event) =>
                onStatusChange(params.row.id, event.target.value)
              }
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.toUpperCase()}
                </option>
              ))}
            </select>

            {isModified && (
              <button
                type="button"
                onClick={() => onStatusSave(params.row.id, params.row.orderStatus)}
                disabled={mutationStatus === "loading"}
                className="rounded-md bg-slate-900 px-2.5 py-1 text-[11px] font-bold text-white shadow-sm hover:bg-slate-800 disabled:opacity-60"
              >
                Save
              </button>
            )}
          </div>
        );
      },
    },
    {
      field: "detail",
      headerName: "Actions",
      minWidth: 110,
      flex: 0.7,
      sortable: false,
      renderCell: (params) => (
        <button
          type="button"
          onClick={() => onRequestOrderDetails(params.row.id)}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-300"
        >
          Manage
        </button>
      ),
    },
  ];
}
