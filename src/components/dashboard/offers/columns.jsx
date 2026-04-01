import { formatDateTime } from "../../../utils/formatters";

export function getOffersColumns({ onStartEdit, onRemoveOffer }) {
  return [
    { field: "title_en", headerName: "Title EN", minWidth: 170, flex: 1 },
    { field: "title_ar", headerName: "Title AR", minWidth: 170, flex: 1 },
    { field: "discountType", headerName: "Type", minWidth: 100, flex: 0.7 },
    { field: "discountValue", headerName: "Value", minWidth: 100, flex: 0.7 },
    { field: "productsCount", headerName: "Products", minWidth: 100, flex: 0.6 },
    {
      field: "startDate",
      headerName: "Start",
      minWidth: 150,
      flex: 1,
      valueFormatter: (value) => formatDateTime(value)
    },
    {
      field: "endDate",
      headerName: "End",
      minWidth: 150,
      flex: 1,
      valueFormatter: (value) => formatDateTime(value)
    },
    {
      field: "isActive",
      headerName: "Active",
      minWidth: 80,
      flex: 0.5,
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
            onClick={() => onRemoveOffer(params.row.id)}
            className="table-action-btn table-action-btn--danger"
          >
            Delete
          </button>
        </div>
      )
    }
  ];
}
