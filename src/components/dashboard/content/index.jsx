import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { updateSiteContent } from "../../../features/admin/adminSlice";
import { buildContentFormData, toDateTimeInputValue } from "./helpers";

function ContentPanel({ content, mutationStatus }) {
  const dispatch = useAppDispatch();
  const [topBannerTextEn, setTopBannerTextEn] = useState("");
  const [topBannerTextAr, setTopBannerTextAr] = useState("");
  const [heroImageFiles, setHeroImageFiles] = useState([]);
  const [bannerFiles, setBannerFiles] = useState([]);
  const [spotlightImageFiles, setSpotlightImageFiles] = useState([]);
  const [popupImageFile, setPopupImageFile] = useState(null);
  const [popupExpiresAt, setPopupExpiresAt] = useState("");

  useEffect(() => {
    setTopBannerTextEn(content.topBannerText_en || "");
    setTopBannerTextAr(content.topBannerText_ar || "");
    setHeroImageFiles([]);
    setBannerFiles([]);
    setSpotlightImageFiles([]);
    setPopupImageFile(null);
    setPopupExpiresAt(toDateTimeInputValue(content.popupExpiresAt));
  }, [content]);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = buildContentFormData({
      topBannerTextEn,
      topBannerTextAr,
      heroImageFiles,
      bannerFiles,
      spotlightImageFiles,
      popupImageFile,
      popupExpiresAt
    });

    try {
      await dispatch(updateSiteContent(formData)).unwrap();
      setHeroImageFiles([]);
      setBannerFiles([]);
      setSpotlightImageFiles([]);
      setPopupImageFile(null);
    } catch (_error) {
      // Error state is surfaced through admin slice.
    }
  }

  return (
    <section className="space-y-4">
      <article className="panel p-4">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-900">Site Content Controls</h3>
          <p className="text-xs text-slate-500">
            Manage the top banner text and upload images for the controlled visual placements.
          </p>
        </div>
        <form className="grid gap-3" onSubmit={handleSubmit}>
          <label className="text-sm font-semibold text-slate-700">
            Top Banner Text EN
            <input
              value={topBannerTextEn}
              onChange={(event) => setTopBannerTextEn(event.target.value)}
              placeholder="Write the top banner text here"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Top Banner Text AR
            <input
              value={topBannerTextAr}
              onChange={(event) => setTopBannerTextAr(event.target.value)}
              placeholder="اكتب نص البانر العلوي بالعربي"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Hero Images Upload (multiple files)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => setHeroImageFiles(Array.from(event.target.files || []))}
              className="file-upload-input mt-1.5"
            />
            <span className="mt-1 block text-xs text-slate-500">
              Selected: {heroImageFiles.length || 0} file(s)
            </span>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Banner Images Upload (multiple files)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => setBannerFiles(Array.from(event.target.files || []))}
              className="file-upload-input mt-1.5"
            />
            <span className="mt-1 block text-xs text-slate-500">
              Selected: {bannerFiles.length || 0} file(s)
            </span>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Spotlight Images Upload (multiple files)
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => setSpotlightImageFiles(Array.from(event.target.files || []))}
              className="file-upload-input mt-1.5"
            />
            <span className="mt-1 block text-xs text-slate-500">
              Selected: {spotlightImageFiles.length || 0} file(s)
            </span>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Popup Offer Image
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setPopupImageFile(event.target.files?.[0] || null)}
              className="file-upload-input mt-1.5"
            />
            <span className="mt-1 block text-xs text-slate-500">
              {popupImageFile
                ? `Selected: ${popupImageFile.name}`
                : content.popupImage
                  ? `Current popup image: ${content.popupImage}`
                  : "Optional"}
            </span>
          </label>

          <label className="text-sm font-semibold text-slate-700">
            Popup Offer Ends At
            <input
              type="datetime-local"
              value={popupExpiresAt}
              onChange={(event) => setPopupExpiresAt(event.target.value)}
              required={Boolean(popupImageFile || content.popupImage)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </label>

          <button
            type="submit"
            disabled={mutationStatus === "loading"}
            className="w-fit rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            Save Content
          </button>
        </form>
      </article>

      <article className="panel p-4">
        <h3 className="text-sm font-bold text-slate-900">Current Content Snapshot</h3>
        <div className="mt-3 grid gap-3 lg:grid-cols-5">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Top Banner Text
            </p>
            <div className="mt-2 space-y-1 text-xs text-slate-700">
              <p className="truncate">EN: {content.topBannerText_en || "-"}</p>
              <p className="truncate">AR: {content.topBannerText_ar || "-"}</p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Hero Images</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {(content.heroImages || []).map((entry) => (
                <li key={entry} className="truncate">
                  {entry}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Banners</p>
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {(content.banners || []).map((entry) => (
                <li key={entry} className="truncate">
                  {entry}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Spotlight Images
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {(content.spotlightImages || []).map((entry) => (
                <li key={entry} className="truncate">
                  {entry}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
              Popup Offer
            </p>
            <div className="mt-2 space-y-1 text-xs text-slate-700">
              <p className="truncate">Image: {content.popupImage || "-"}</p>
              <p className="truncate">Ends: {content.popupExpiresAt || "-"}</p>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}

export default ContentPanel;
