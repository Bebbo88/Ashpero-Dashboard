import { DataGrid } from "@mui/x-data-grid";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";
import { formatList, formatSizes } from "./helpers";

function ProductsTableCard({
  filteredRows,
  tableCategories,
  tableProductTypes,
  tableSkinTypes,
  categoryFilter,
  productTypeFilter,
  skinTypeFilter,
  stockDraft,
  onCategoryFilterChange,
  onProductTypeFilterChange,
  onSkinTypeFilterChange,
  onChangeStockDraft,
  onSaveStock,
  onStartEdit,
  onRemoveProduct
}) {
  return (
    <article className="panel p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Products</h3>
          <p className="text-xs text-slate-500">Edit, delete, patch stock, and filter by category, product type, and skin type.</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <label className="text-xs font-semibold text-slate-600">
            Category
            <select
              value={categoryFilter}
              onChange={onCategoryFilterChange}
              className="ml-2 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
            >
              <option value="all">All</option>
              {tableCategories.map((categoryOption) => (
                <option key={categoryOption} value={categoryOption}>
                  {categoryOption}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-slate-600">
            Product Type
            <select
              value={productTypeFilter}
              onChange={onProductTypeFilterChange}
              className="ml-2 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
            >
              <option value="all">All</option>
              {tableProductTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="text-xs font-semibold text-slate-600">
            Skin Type
            <select
              value={skinTypeFilter}
              onChange={onSkinTypeFilterChange}
              className="ml-2 rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs"
            >
              <option value="all">All</option>
              {tableSkinTypes.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="h-[560px] w-full">
        <DataGrid
          rows={filteredRows}
          columns={[
            {
              field: "name_en",
              headerName: "Name EN",
              minWidth: 160,
              flex: 1
            },
            {
              field: "name_ar",
              headerName: "Name AR",
              minWidth: 140,
              flex: 1
            },
            {
              field: "category",
              headerName: "Category",
              minWidth: 140,
              flex: 0.9
            },
            {
              field: "sizes",
              headerName: "Sizes",
              minWidth: 180,
              flex: 1,
              sortable: false,
              renderCell: (params) => (
                <span className="truncate text-xs text-slate-700">{formatSizes(params.row.sizes)}</span>
              )
            },
            {
              field: "productType",
              headerName: "Product Type",
              minWidth: 160,
              flex: 1,
              sortable: false,
              renderCell: (params) => (
                <span className="truncate text-xs text-slate-700">{formatList(params.row.productType)}</span>
              )
            },
            {
              field: "skinType",
              headerName: "Skin Type",
              minWidth: 160,
              flex: 1,
              sortable: false,
              renderCell: (params) => (
                <span className="truncate text-xs text-slate-700">{formatList(params.row.skinType)}</span>
              )
            },
            {
              field: "price",
              headerName: "Price",
              minWidth: 100,
              flex: 0.7,
              valueFormatter: (value) => formatCurrency(value)
            },
            {
              field: "stock",
              headerName: "Stock",
              minWidth: 190,
              flex: 1.2,
              sortable: false,
              renderCell: (params) => (
                <div className="flex w-full items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    step="1"
                    className="w-20 rounded border border-slate-300 px-2 py-1 text-xs"
                    value={stockDraft[params.row.id] ?? params.row.stock}
                    onChange={(event) => onChangeStockDraft(params.row.id, event.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => onSaveStock(params.row.id, params.row.stock)}
                    className="table-action-btn table-action-btn--neutral"
                  >
                    Save
                  </button>
                </div>
              )
            },
            {
              field: "isActive",
              headerName: "Active",
              minWidth: 80,
              flex: 0.5,
              valueFormatter: (value) => (value ? "Yes" : "No")
            },
            {
              field: "isBestSeller",
              headerName: "Best Seller",
              minWidth: 110,
              flex: 0.7,
              valueFormatter: (value) => (value ? "Yes" : "No")
            },
            {
              field: "updatedAt",
              headerName: "Updated",
              minWidth: 170,
              flex: 1,
              valueFormatter: (value, row) => formatDateTime(value || row.createdAt)
            },
            {
              field: "actions",
              headerName: "Actions",
              minWidth: 170,
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
                    onClick={() => onRemoveProduct(params.row.id)}
                    className="table-action-btn table-action-btn--danger"
                  >
                    Delete
                  </button>
                </div>
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
  );
}

export default ProductsTableCard;
