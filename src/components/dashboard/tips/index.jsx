import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { useAppDispatch } from "../../../app/hooks";
import { createTip, deleteTip, updateTip } from "../../../features/admin/adminSlice";
import { getTipsColumns } from "./columns";
import { buildTipFormData, INITIAL_FORM, mapTipsRows } from "./helpers";

const EMPTY_MEDIA_FILES = {
  videoFile: null,
  primaryImage: null,
  secondaryImage: null
};

const EMPTY_PREVIEW_MEDIA = {
  videoUrl: "",
  primaryImage: "",
  secondaryImage: ""
};

function TipsPanel({ tips, mutationStatus }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(INITIAL_FORM);
  const [mediaFiles, setMediaFiles] = useState(EMPTY_MEDIA_FILES);
  const [editingTipId, setEditingTipId] = useState("");
  const [editingPreviewMedia, setEditingPreviewMedia] = useState(EMPTY_PREVIEW_MEDIA);

  const rows = useMemo(() => mapTipsRows(tips), [tips]);
  const columns = useMemo(
    () =>
      getTipsColumns({
        onStartEdit: startEdit,
        onRemoveTip: removeTip
      }),
    [startEdit, removeTip]
  );

  function setField(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value
    }));
  }

  function setMediaField(fieldName, file) {
    setMediaFiles((previous) => ({
      ...previous,
      [fieldName]: file
    }));
  }

  function resetForm() {
    setForm(INITIAL_FORM);
    setMediaFiles(EMPTY_MEDIA_FILES);
    setEditingTipId("");
    setEditingPreviewMedia(EMPTY_PREVIEW_MEDIA);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = buildTipFormData(form, mediaFiles);

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
    setMediaFiles(EMPTY_MEDIA_FILES);
    setEditingPreviewMedia({
      videoUrl: row.videoUrl || "",
      primaryImage: row.primaryImage || "",
      secondaryImage: row.secondaryImage || ""
    });

    setForm({
      videoTitle_en: row.videoTitle_en || "",
      videoTitle_ar: row.videoTitle_ar || "",
      videoUrl: row.videoUrl || "",
      primaryTitle_en: row.primaryTitle_en || "",
      primaryTitle_ar: row.primaryTitle_ar || "",
      primaryDescription_en: row.primaryDescription_en || "",
      primaryDescription_ar: row.primaryDescription_ar || "",
      secondaryTitle_en: row.secondaryTitle_en || "",
      secondaryTitle_ar: row.secondaryTitle_ar || "",
      secondaryDescription_en: row.secondaryDescription_en || "",
      secondaryDescription_ar: row.secondaryDescription_ar || ""
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
            {editingTipId ? "Edit Tip Container" : "Create Tip Container"}
          </h3>
          <p className="text-xs text-slate-500">
            Each tip includes one video section and two image sections in one container.
          </p>
        </div>

        <form className="grid gap-3 md:grid-cols-2" onSubmit={handleSubmit}>
          <h4 className="md:col-span-2 text-xs font-bold uppercase tracking-wide text-slate-600">
            Video Section
          </h4>
          <input
            name="videoTitle_en"
            value={form.videoTitle_en}
            onChange={setField}
            placeholder="Video Title EN"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="videoTitle_ar"
            value={form.videoTitle_ar}
            onChange={setField}
            placeholder="Video Title AR"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="videoUrl"
            value={form.videoUrl}
            onChange={setField}
            placeholder="Video URL (optional when uploading file)"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm md:col-span-2"
          />
          <label className="text-xs font-semibold text-slate-600 md:col-span-2">
            Video File
            <input
              type="file"
              accept="video/*"
              onChange={(event) => setMediaField("videoFile", event.target.files?.[0] || null)}
              required={!editingTipId && !form.videoUrl.trim()}
              className="file-upload-input mt-1"
            />
          </label>

          <h4 className="md:col-span-2 mt-2 text-xs font-bold uppercase tracking-wide text-slate-600">
            First Image Card
          </h4>
          <input
            name="primaryTitle_en"
            value={form.primaryTitle_en}
            onChange={setField}
            placeholder="Image 1 Title EN"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="primaryTitle_ar"
            value={form.primaryTitle_ar}
            onChange={setField}
            placeholder="Image 1 Title AR"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            name="primaryDescription_en"
            value={form.primaryDescription_en}
            onChange={setField}
            placeholder="Image 1 Details EN"
            rows={2}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            name="primaryDescription_ar"
            value={form.primaryDescription_ar}
            onChange={setField}
            placeholder="Image 1 Details AR"
            rows={2}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <label className="text-xs font-semibold text-slate-600 md:col-span-2">
            First Image File
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setMediaField("primaryImage", event.target.files?.[0] || null)}
              required={!editingTipId}
              className="file-upload-input mt-1"
            />
          </label>

          <h4 className="md:col-span-2 mt-2 text-xs font-bold uppercase tracking-wide text-slate-600">
            Second Image Card
          </h4>
          <input
            name="secondaryTitle_en"
            value={form.secondaryTitle_en}
            onChange={setField}
            placeholder="Image 2 Title EN"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            name="secondaryTitle_ar"
            value={form.secondaryTitle_ar}
            onChange={setField}
            placeholder="Image 2 Title AR"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            name="secondaryDescription_en"
            value={form.secondaryDescription_en}
            onChange={setField}
            placeholder="Image 2 Details EN"
            rows={2}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            name="secondaryDescription_ar"
            value={form.secondaryDescription_ar}
            onChange={setField}
            placeholder="Image 2 Details AR"
            rows={2}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <label className="text-xs font-semibold text-slate-600 md:col-span-2">
            Second Image File
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setMediaField("secondaryImage", event.target.files?.[0] || null)}
              required={!editingTipId}
              className="file-upload-input mt-1"
            />
          </label>

          {editingTipId ? (
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 md:col-span-2 space-y-1">
              <p>Current video: {editingPreviewMedia.videoUrl || "None"}</p>
              <p>Current first image: {editingPreviewMedia.primaryImage || "None"}</p>
              <p>Current second image: {editingPreviewMedia.secondaryImage || "None"}</p>
            </div>
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
          <p className="text-xs text-slate-500">Manage website tip containers.</p>
        </div>
        <div className="h-[470px] w-full">
          <DataGrid
            rows={rows}
            columns={columns}
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
