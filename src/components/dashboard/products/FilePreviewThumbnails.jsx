import { useEffect, useState } from "react";

// Renders small local previews for File objects the admin just picked, so
// they can confirm they selected the right image(s) before saving — only
// already-saved images had a preview before this.
export function FilePreviewThumbnails({ files }) {
  const fileList = Array.isArray(files) ? files : files ? [files] : [];
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    if (fileList.length === 0) {
      setPreviewUrls([]);
      return undefined;
    }

    const urls = fileList.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList.map((file) => `${file.name}-${file.size}-${file.lastModified}`).join("|")]);

  if (previewUrls.length === 0) {
    return null;
  }

  return (
    <div className="mt-2 flex flex-wrap gap-2">
      {previewUrls.map((url, index) => (
        <img
          key={url}
          src={url}
          alt={`Selected file preview ${index + 1}`}
          className="h-16 w-16 rounded-lg border border-slate-200 object-cover"
        />
      ))}
    </div>
  );
}

export default FilePreviewThumbnails;
