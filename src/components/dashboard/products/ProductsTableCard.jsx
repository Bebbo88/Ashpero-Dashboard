import { DataGrid } from "@mui/x-data-grid";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";
import { formatList } from "./helpers";

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
  onRemoveProduct,
}) {
  return (
    <article className="panel p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Products</h3>
          <p className="text-xs text-slate-500">
            Edit, delete, patch stock, and filter by category, product type, and
            skin type.
          </p>
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
              flex: 1,
            },
            {
              field: "name_ar",
              headerName: "Name AR",
              minWidth: 140,
              flex: 1,
            },
            {
              field: "category",
              headerName: "Category",
              minWidth: 140,
              flex: 0.9,
            },
            {
              field: "variants",
              headerName: "Variants",
              minWidth: 320,
              flex: 1.8,
              sortable: false,

              renderCell: (params) => (
                <div className="flex flex-col gap-1 py-2">
                  {(params.row.variants || []).map((variant, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <span className="rounded bg-slate-100 px-2 py-1 font-semibold">
                        {variant.size}
                      </span>

                      <span>{formatCurrency(variant.price)}</span>

                      <span className="text-slate-500">
                        Stock: {variant.stock}
                      </span>
                    </div>
                  ))}
                </div>
              ),
            },
            {
              field: "productType",
              headerName: "Product Type",
              minWidth: 160,
              flex: 1,
              sortable: false,
              renderCell: (params) => (
                <span className="truncate text-xs text-slate-700">
                  {formatList(params.row.productType)}
                </span>
              ),
            },
            {
              field: "skinType",
              headerName: "Skin Type",
              minWidth: 160,
              flex: 1,
              sortable: false,
              renderCell: (params) => (
                <span className="truncate text-xs text-slate-700">
                  {formatList(params.row.skinType)}
                </span>
              ),
            },

            {
              field: "inStock",
              headerName: "Stock Status",
              minWidth: 120,
              flex: 0.8,
              renderCell: (params) => (
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${
                    params.row.inStock !== false
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {params.row.inStock !== false ? "In Stock" : "Out of Stock"}
                </span>
              ),
            },
            {
              field: "badgeText",
              headerName: "Badge",
              minWidth: 130,
              flex: 0.9,
              renderCell: (params) => {
                const text = params.row.badgeText_ar || params.row.badgeText_en || params.row.badgeText;
                return text ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-xs font-semibold truncate max-w-[120px]">
                    ★ {text}
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">-</span>
                );
              },
            },
            {
              field: "isActive",
              headerName: "Active",
              minWidth: 80,
              flex: 0.5,
              valueFormatter: (value) => (value ? "Yes" : "No"),
            },
            {
              field: "isBestSeller",
              headerName: "Best Seller",
              minWidth: 110,
              flex: 0.7,
              valueFormatter: (value) => (value ? "Yes" : "No"),
            },
            {
              field: "updatedAt",
              headerName: "Updated",
              minWidth: 170,
              flex: 1,
              valueFormatter: (value, row) =>
                formatDateTime(value || row.createdAt),
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
              ),
            },
          ]}
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
  );
}

export default ProductsTableCard;
