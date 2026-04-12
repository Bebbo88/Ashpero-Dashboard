import { formatDateTime } from "../../../utils/formatters";

export function getTipsColumns({ onStartEdit, onRemoveTip }) {
  return [
    { field: "videoTitle_en", headerName: "Video Title EN", minWidth: 180, flex: 1.1 },
    { field: "primaryTitle_en", headerName: "Image 1 Title EN", minWidth: 170, flex: 1 },
    { field: "secondaryTitle_en", headerName: "Image 2 Title EN", minWidth: 170, flex: 1 },
    {
      field: "createdAt",
      headerName: "Created",
      minWidth: 160,
      flex: 0.9,
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
