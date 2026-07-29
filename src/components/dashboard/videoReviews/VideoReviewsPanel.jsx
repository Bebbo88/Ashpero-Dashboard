import { useState, useMemo } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { updateProductVideos } from "../../../features/admin/adminSlice";

export default function VideoReviewsPanel({ products, mutationStatus }) {
  const dispatch = useAppDispatch();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [videoFiles, setVideoFiles] = useState([]);
  const [uploadMessage, setUploadMessage] = useState("");

  const selectedProduct = useMemo(() => {
    return products.find((p) => String(p._id || p.id) === String(selectedProductId));
  }, [products, selectedProductId]);

  const existingVideos = useMemo(() => {
    return Array.isArray(selectedProduct?.customerReviewVideos)
      ? selectedProduct.customerReviewVideos
      : [];
  }, [selectedProduct]);

  function handleProductChange(e) {
    setSelectedProductId(e.target.value);
    setVideoFiles([]);
    setUploadMessage("");
  }

  function handleFileChange(e) {
    const files = Array.from(e.target.files || []).slice(0, 4);
    setVideoFiles(files);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!selectedProductId) {
      setUploadMessage("Please select a product first.");
      return;
    }
    if (videoFiles.length === 0) {
      setUploadMessage("Please select at least one video file to upload.");
      return;
    }

    const formData = new FormData();
    for (const file of videoFiles) {
      formData.append("reviewVideos", file);
    }

    try {
      setUploadMessage("Uploading review videos to Cloudinary...");
      await dispatch(
        updateProductVideos({ productId: selectedProductId, formData })
      ).unwrap();
      setUploadMessage("Review videos uploaded and updated successfully!");
      setVideoFiles([]);
    } catch (err) {
      setUploadMessage(`Error uploading videos: ${err || "Failed to update"}`);
    }
  }

  return (
    <article className="panel p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          Manage Customer Review Videos / تجارب العملاء
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Select a product and upload up to 4 customer review videos to display on the product page.
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Select Product
        </label>
        <select
          value={selectedProductId}
          onChange={handleProductChange}
          className="w-full max-w-md rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 shadow-sm focus:border-teal-600 focus:outline-none"
        >
          <option value="">-- Choose a Product --</option>
          {products.map((product) => (
            <option key={product._id || product.id} value={product._id || product.id}>
              {product.name_en || product.name || product.name_ar} (Videos: {product.customerReviewVideos?.length || 0})
            </option>
          ))}
        </select>
      </div>

      {selectedProduct ? (
        <form onSubmit={handleSubmit} className="space-y-6 border-t border-slate-100 pt-6">
          {/* Existing Videos Preview */}
          <div>
            <h4 className="text-sm font-bold text-slate-800 mb-3">
              Current Review Videos ({existingVideos.length} / 4)
            </h4>
            {existingVideos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {existingVideos.map((videoUrl, idx) => (
                  <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 bg-slate-900 aspect-video">
                    <video src={videoUrl} controls className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                      Video #{idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No review videos uploaded for this product yet.</p>
            )}
          </div>

          {/* Upload New Videos */}
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Upload New Review Videos (Up to 4 videos, MP4/WEBM/MOV, Max 50MB each)
            </label>
            <input
              type="file"
              multiple
              accept="video/*"
              onChange={handleFileChange}
              className="file-upload-input block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100"
            />
            {videoFiles.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {videoFiles.map((file, i) => (
                  <span key={i} className="text-xs bg-teal-100 text-teal-800 px-2.5 py-1 rounded-md font-medium">
                    {file.name} ({(file.size / (1024 * 1024)).toFixed(1)} MB)
                  </span>
                ))}
              </div>
            )}
            <p className="text-[11px] text-slate-500 mt-2">
              Note: Uploading new videos will update the customer review videos array for this product in MongoDB and Cloudinary.
            </p>
          </div>

          {uploadMessage && (
            <div className={`p-3 rounded-lg text-xs font-medium ${uploadMessage.includes("Error") ? "bg-red-50 text-red-700" : "bg-teal-50 text-teal-800"}`}>
              {uploadMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={mutationStatus === "loading" || videoFiles.length === 0}
            className="rounded-lg bg-teal-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-teal-800 disabled:opacity-50 transition-colors"
          >
            {mutationStatus === "loading" ? "Uploading to Cloudinary..." : "Upload & Save Videos"}
          </button>
        </form>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-sm text-slate-500">Select a product above to manage its customer review videos.</p>
        </div>
      )}
    </article>
  );
}
