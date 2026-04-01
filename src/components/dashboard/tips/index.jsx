import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAppDispatch } from "../../../app/hooks";
import { createTip, deleteTip, updateTip } from "../../../features/admin/adminSlice";
import { formatDateTime } from "../../../utils/formatters";

const INITIAL_FORM = {
  title_en: "",
  title_ar: "",
  description_en: "",
  description_ar: "",
  type: "image",
  videoUrl: ""
};

function TipsPanel({ tips, mutationStatus }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(INITIAL_FORM);
  const [imageFile, setImageFile] = useState(null);
  const [editingTipId, setEditingTipId] = useState("");
  const [editingPreviewImage, setEditingPreviewImage] = useState("");

  const rows = useMemo(
    () =>
      [...tips]
        .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
        .map((tip) => ({
          id: tip._id,
          ...tip
        })),
    [tips]
  );

  function setField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setImageFile(null);
    setEditingTipId("");
    setEditingPreviewImage("");
  }

  function buildFormData() {
    const formData = new FormData();

    formData.append("title_en", form.title_en.trim());
    formData.append("title_ar", form.title_ar.trim());
    formData.append("description_en", form.description_en.trim());
    formData.append("description_ar", form.description_ar.trim());
    formData.append("type", form.type);

    if (form.videoUrl.trim()) {
      formData.append("videoUrl", form.videoUrl.trim());
    }

    if (imageFile) {
      formData.append("image", imageFile);
    }

    return formData;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = buildFormData();

    try {
      if (editingTipId) {
        await dispatch(updateTip({ tipId: editingTipId, formData })).unwrap();
      } else {
        await dispatch(createTip(formData)).unwrap();
      }

      resetForm();
    } catch (_error) {
      // Error state is surfaced through admin slice.
    }
  }

  function startEdit(row) {
    setEditingTipId(row.id);
    setImageFile(null);
    setEditingPreviewImage(row.image || "");
    setForm({
      title_en: row.title_en || "",
      title_ar: row.title_ar || "",
      description_en: row.description_en || "",
      description_ar: row.description_ar || "",
      type: row.type || "image",
      videoUrl: row.videoUrl || ""
    });
  }

  function removeTip(id) {
    dispatch(deleteTip(id));

    if (editingTipId === id) {
      resetForm();
    }
  }

  return (
    <section className="space-y-4">
      <article className="panel p-4">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-900">
            {editingTipId ? "Edit Tip" : "Create Tip"}
          </h3>
          <p className="text-xs text-slate-500">
            Tip images are uploaded as files. Use video URL when type is video.
          </p>
        </div>
        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <input
            name="title_en"
            value={form.title_en}
            onChange={setField}
            placeholder="Title EN"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="title_ar"
            value={form.title_ar}
            onChange={setField}
            placeholder="Title AR"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            name="description_en"
            value={form.description_en}
            onChange={setField}
            placeholder="Description EN"
            rows={2}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            name="description_ar"
            value={form.description_ar}
            onChange={setField}
            placeholder="Description AR"
            rows={2}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />

          <select
            name="type"
            value={form.type}
            onChange={setField}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="image">image</option>
            <option value="video">video</option>
          </select>

          <label className="text-xs font-semibold text-slate-600">
            Tip Image File
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
              required={form.type === "image" && !editingTipId}
              className="file-upload-input mt-1"
            />
          </label>

          <input
            name="videoUrl"
            value={form.videoUrl}
            onChange={setField}
            placeholder="Video URL"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
          />

          {editingTipId ? (
            <p className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 md:col-span-2">
              Current image: {editingPreviewImage || "None"}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2 md:col-span-2">
            <button
              type="submit"
              disabled={mutationStatus === "loading"}
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {editingTipId ? "Update Tip" : "Create Tip"}
            </button>
            {editingTipId ? (
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
          <h3 className="text-sm font-bold text-slate-900">Tips</h3>
          <p className="text-xs text-slate-500">Manage educational or media snippets for customers.</p>
        </div>
        <div className="h-[470px] w-full">
          <DataGrid
            rows={rows}
            columns={[
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
                      onClick={() => startEdit(params.row)}
                      className="table-action-btn table-action-btn--primary"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => removeTip(params.row.id)}
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

export default TipsPanel;

