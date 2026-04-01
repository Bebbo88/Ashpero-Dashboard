import { useEffect, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { updateSiteContent } from "../../../features/admin/adminSlice";
import { parseLineSeparatedText, toLineSeparatedText } from "../../../utils/formatters";

function appendTextArray(formData, key, values) {
  for (const value of values) {
    const trimmedValue = String(value || "").trim();

    if (trimmedValue) {
      formData.append(key, trimmedValue);
    }
  }
}

function ContentPanel({ content, mutationStatus }) {
  const dispatch = useAppDispatch();
  const [heroImageFiles, setHeroImageFiles] = useState([]);
  const [bannerFiles, setBannerFiles] = useState([]);
  const [marketingSectionsText, setMarketingSectionsText] = useState("");

  useEffect(() => {
    setHeroImageFiles([]);
    setBannerFiles([]);
    setMarketingSectionsText(toLineSeparatedText(content.marketingSections || []));
  }, [content]);

  async function handleSubmit(event) {
    event.preventDefault();

    const formData = new FormData();

    for (const file of heroImageFiles) {
      formData.append("heroImages", file);
    }

    for (const file of bannerFiles) {
      formData.append("banners", file);
    }

    const marketingSections = parseLineSeparatedText(marketingSectionsText);

    if (marketingSections.length === 0) {
      formData.append("marketingSections", "");
    } else {
      appendTextArray(formData, "marketingSections", marketingSections);
    }

    try {
      await dispatch(updateSiteContent(formData)).unwrap();
      setHeroImageFiles([]);
      setBannerFiles([]);
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
            Upload hero and banner images as files. Existing images stay saved when you add new files.
          </p>
        </div>
        <form className="grid gap-3" onSubmit={handleSubmit}>
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
            Marketing Sections (one entry per line)
            <textarea
              rows={5}
              value={marketingSectionsText}
              onChange={(event) => setMarketingSectionsText(event.target.value)}
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
        <div className="mt-3 grid gap-3 lg:grid-cols-3">
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
              Marketing Sections
            </p>
            <ul className="mt-2 space-y-1 text-xs text-slate-700">
              {(content.marketingSections || []).map((entry) => (
                <li key={entry} className="truncate">
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>
    </section>
  );
}

export default ContentPanel;

