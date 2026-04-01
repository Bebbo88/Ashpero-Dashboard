import { formatDateTime } from "../../../utils/formatters";

export function getTipsColumns({ onStartEdit, onRemoveTip }) {
  return [
    { field: "title_en", headerName: "Title EN", minWidth: 180, flex: 1.1 },
    { field: "title_ar", headerName: "Title AR", minWidth: 150, flex: 1 },
    { field: "type", headerName: "Type", minWidth: 90, flex: 0.6 },
    {
      field: "createdAt",
      headerName: "Created",
      minWidth: 160,
      flex: 1,
      valueFormatter: (value) => formatDateTime(value)
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
            onClick={() => onRemoveTip(params.row.id)}
            className="table-action-btn table-action-btn--danger"
          >
            Delete
          </button>
        </div>
      )
    }
  ];
}
