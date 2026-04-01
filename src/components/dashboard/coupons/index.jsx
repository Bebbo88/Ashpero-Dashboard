import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAppDispatch } from "../../../app/hooks";
import { createCoupon, deleteCoupon, updateCoupon } from "../../../features/admin/adminSlice";
import { formatDateTime } from "../../../utils/formatters";

const INITIAL_FORM = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  maxUsage: "",
  usedCount: "0",
  expiresAt: "",
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

function CouponsPanel({ coupons, mutationStatus }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(INITIAL_FORM);
  const [editingCouponId, setEditingCouponId] = useState("");

  const rows = useMemo(
    () =>
      [...coupons]
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .map((coupon) => ({
          id: coupon._id,
          ...coupon
        })),
    [coupons]
  );

  function setField(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setEditingCouponId("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const body = {
      code: form.code,
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      maxUsage: Number(form.maxUsage),
      usedCount: Number(form.usedCount),
      expiresAt: form.expiresAt,
      isActive: form.isActive
    };

    try {
      if (editingCouponId) {
        await dispatch(updateCoupon({ couponId: editingCouponId, body })).unwrap();
      } else {
        await dispatch(createCoupon(body)).unwrap();
      }

      resetForm();
    } catch (_error) {
      // Error state is surfaced through admin slice.
    }
  }

  function startEdit(row) {
    setEditingCouponId(row.id);
    setForm({
      code: row.code || "",
      discountType: row.discountType || "percentage",
      discountValue: row.discountValue ?? "",
      maxUsage: row.maxUsage ?? "",
      usedCount: row.usedCount ?? 0,
      expiresAt: toDateInputValue(row.expiresAt),
      isActive: Boolean(row.isActive)
    });
  }

  function removeCoupon(id) {
    dispatch(deleteCoupon(id));

    if (editingCouponId === id) {
      resetForm();
    }
  }

  return (
    <section className="space-y-4">
      <article className="panel p-4">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-900">
            {editingCouponId ? "Edit Coupon" : "Create Coupon"}
          </h3>
          <p className="text-xs text-slate-500">Control promotional coupon lifecycle and limits.</p>
        </div>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            name="code"
            value={form.code}
            onChange={setField}
            placeholder="Coupon code"
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
            name="maxUsage"
            type="number"
            min="1"
            value={form.maxUsage}
            onChange={setField}
            placeholder="Max usage"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="usedCount"
            type="number"
            min="0"
            value={form.usedCount}
            onChange={setField}
            placeholder="Used count"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="expiresAt"
            type="date"
            value={form.expiresAt}
            onChange={setField}
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
            <input type="checkbox" name="isActive" checked={form.isActive} onChange={setField} />
            Coupon is active
          </label>
          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={mutationStatus === "loading"}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {editingCouponId ? "Update Coupon" : "Create Coupon"}
            </button>
            {editingCouponId ? (
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
          <h3 className="text-sm font-bold text-slate-900">Coupons</h3>
          <p className="text-xs text-slate-500">Track validity, usage pressure, and activation state.</p>
        </div>
        <div className="h-[480px] w-full">
          <DataGrid
            rows={rows}
            columns={[
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
                      onClick={() => startEdit(params.row)}
                      className="table-action-btn table-action-btn--primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeCoupon(params.row.id)}
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

export default CouponsPanel;
