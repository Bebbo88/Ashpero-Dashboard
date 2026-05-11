import { formatCurrency, formatDateTime } from "../../../utils/formatters";

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
      minWidth: 150,
      flex: 0.9,
    },
    {
      field: "customerName",
      headerName: "Customer",
      minWidth: 140,
      flex: 1,
    },
    {
      field: "phone",
      headerName: "Phone",
      minWidth: 130,
      flex: 1,
    },
    {
      field: "itemsCount",
      headerName: "Items",
      minWidth: 80,
      flex: 0.6,
    },
    {
      field: "totalPrice",
      headerName: "Total",
      minWidth: 110,
      flex: 0.8,
      valueFormatter: (value) => formatCurrency(value),
    },
    {
      field: "paymentStatus",
      headerName: "Payment",
      minWidth: 250,
      flex: 1.4,
      sortable: false,
      renderCell: (params) => {
        const isCashOnDelivery =
          params.row.paymentMethod === "cash_on_delivery";

        if (!isCashOnDelivery) {
          return (
            <div className="flex w-full items-center justify-between gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-700">
                {params.row.paymentStatus}
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-slate-600">
                {params.row.paymentMethod || "COD"}
              </span>
            </div>
          );
        }

        return (
          <div className="flex w-full items-center gap-2 py-1">
            <select
              className="w-full rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-semibold"
              value={resolvePaymentStatus(params.row)}
              onChange={(event) =>
                onPaymentStatusChange(params.row.id, event.target.value)
              }
            >
              {paymentStatuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() =>
                onPaymentStatusSave(params.row.id, params.row.paymentStatus)
              }
              disabled={mutationStatus === "loading"}
              className="table-action-btn table-action-btn--neutral disabled:opacity-60"
            >
              Save
            </button>
          </div>
        );
      },
    },
    {
      field: "createdAt",
      headerName: "Created",
      minWidth: 170,
      flex: 1,
      valueFormatter: (value) => formatDateTime(value),
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
            onChange={(event) =>
              onStatusChange(params.row.id, event.target.value)
            }
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onStatusSave(params.row.id, params.row.orderStatus)}
            disabled={mutationStatus === "loading"}
            className="table-action-btn table-action-btn--neutral disabled:opacity-60"
          >
            Save
          </button>
        </div>
      ),
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
      ),
    },
  ];
}
