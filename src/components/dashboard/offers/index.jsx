import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAppDispatch } from "../../../app/hooks";
import { createOffer, deleteOffer, updateOffer } from "../../../features/admin/adminSlice";
import { formatDateTime } from "../../../utils/formatters";

const INITIAL_FORM = {
  title_en: "",
  title_ar: "",
  discountType: "percentage",
  discountValue: "",
  startDate: "",
  endDate: "",
  productIds: [],
  isActive: true
};

function toDateInputValue(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

function getProductLabel(product) {
  const englishName = product?.name_en || product?.name || "";
  const arabicName = product?.name_ar || "";

  if (englishName && arabicName) {
    return `${englishName} | ${arabicName}`;
  }

  return englishName || arabicName || "Unnamed Product";
}

function OffersPanel({ offers, products, mutationStatus }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingOfferId, setEditingOfferId] = useState("");

  const availableProducts = useMemo(
    () =>
      [...products].sort((left, right) =>
        getProductLabel(left).localeCompare(getProductLabel(right), "en", { sensitivity: "base" })
      ),
    [products]
  );

  const rows = useMemo(
    () =>
      [...offers]
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .map((offer) => ({
          id: offer._id,
          ...offer,
          title_en: offer.title_en || offer.title || "",
          title_ar: offer.title_ar || "",
          productsCount: Array.isArray(offer.productIds) ? offer.productIds.length : 0
        })),
    [offers]
  );

  function setField(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function setProductIds(event) {
    const selectedProductIds = Array.from(event.target.selectedOptions, (option) => option.value);

    setForm((previous) => ({
      ...previous,
      productIds: selectedProductIds
    }));
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setEditingOfferId("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const body = {
      title_en: form.title_en.trim(),
      title_ar: form.title_ar.trim(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      startDate: form.startDate,
      endDate: form.endDate,
      productIds: form.productIds,
      isActive: form.isActive
    };

    try {
      if (editingOfferId) {
        await dispatch(updateOffer({ offerId: editingOfferId, body })).unwrap();
      } else {
        await dispatch(createOffer(body)).unwrap();
      }

      resetForm();
    } catch (_error) {
      // Error state is surfaced through admin slice.
    }
  }

  function startEdit(row) {
    const ids = (row.productIds || []).map((entry) =>
      typeof entry === "string" ? entry : entry?._id || entry?.id || ""
    );

    setEditingOfferId(row.id);
    setForm({
      title_en: row.title_en || row.title || "",
      title_ar: row.title_ar || "",
      discountType: row.discountType || "percentage",
      discountValue: row.discountValue ?? "",
      startDate: toDateInputValue(row.startDate),
      endDate: toDateInputValue(row.endDate),
      productIds: ids.filter(Boolean),
      isActive: Boolean(row.isActive)
    });
  }

  function removeOffer(id) {
    dispatch(deleteOffer(id));

    if (editingOfferId === id) {
      resetForm();
    }
  }

  return (
    <section className="space-y-4">
      <article className="panel p-4">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-900">
            {editingOfferId ? "Edit Offer" : "Create Offer"}
          </h3>
          <p className="text-xs text-slate-500">
            English + Arabic titles are mandatory. Select products directly from the list.
          </p>
        </div>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            name="title_en"
            value={form.title_en}
            onChange={setField}
            placeholder="Offer Title EN"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="title_ar"
            value={form.title_ar}
            onChange={setField}
            placeholder="Offer Title AR"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            name="discountType"
            value={form.discountType}
            onChange={setField}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="percentage">percentage</option>
            <option value="fixed">fixed</option>
          </select>
          <input
            name="discountValue"
            type="number"
            min="0"
            value={form.discountValue}
            onChange={setField}
            placeholder="Discount value"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="startDate"
            type="date"
            value={form.startDate}
            onChange={setField}
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="endDate"
            type="date"
            value={form.endDate}
            onChange={setField}
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />

          <label className="md:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-slate-600">
              Offer Products (Ctrl/Cmd + click for multi-select)
            </span>
            <select
              multiple
              value={form.productIds}
              onChange={setProductIds}
              required
              className="h-44 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            >
              {availableProducts.map((product) => (
                <option key={product._id} value={product._id}>
                  {getProductLabel(product)}
                </option>
              ))}
            </select>
            <span className="mt-1 block text-xs text-slate-500">
              Selected products: {form.productIds.length || 0}
            </span>
          </label>

          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={setField} />
            Offer is active
          </label>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={mutationStatus === "loading"}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {editingOfferId ? "Update Offer" : "Create Offer"}
            </button>
            {editingOfferId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700"
              >
                Cancel Edit
              </button>
            ) : null}
          </div>
        </form>
      </article>

      <article className="panel p-4">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-900">Offers</h3>
          <p className="text-xs text-slate-500">Edit and retire campaigns from this table.</p>
        </div>
        <div className="h-[480px] w-full">
          <DataGrid
            rows={rows}
            columns={[
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
                      onClick={() => startEdit(params.row)}
                      className="table-action-btn table-action-btn--primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeOffer(params.row.id)}
                      className="table-action-btn table-action-btn--danger"
                    >
                      Delete
                    </button>
                  </div>
                )
              }
            ]}
            pageSizeOptions={[10, 20]}
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
    </section>
  );
}

export default OffersPanel;
