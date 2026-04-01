import { formatDateTime } from "../../../utils/formatters";

export function getCouponsColumns({ onStartEdit, onRemoveCoupon }) {
  return [
    { field: "code", headerName: "Code", minWidth: 120, flex: 0.8 },
    { field: "discountType", headerName: "Type", minWidth: 100, flex: 0.7 },
    { field: "discountValue", headerName: "Value", minWidth: 90, flex: 0.6 },
    { field: "maxUsage", headerName: "Max", minWidth: 80, flex: 0.6 },
    { field: "usedCount", headerName: "Used", minWidth: 80, flex: 0.6 },
    {
      field: "expiresAt",
      headerName: "Expires",
      minWidth: 160,
      flex: 1,
      valueFormatter: (value) => formatDateTime(value)
    },
    {
      field: "isActive",
      headerName: "Active",
      minWidth: 80,
      flex: 0.6,
      valueFormatter: (value) => (value ? "Yes" : "No")
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 160,
      flex: 1,
      sortable: false,
      renderCell: (params) => (
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onStartEdit(params.row)}
            className="table-action-btn table-action-btn--primary"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onRemoveCoupon(params.row.id)}
            className="table-action-btn table-action-btn--danger"
          >
            Delete
          </button>
        </div>
      )
    }
  ];
}
