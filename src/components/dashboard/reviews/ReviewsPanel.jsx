import { useState, useMemo } from "react";
import { useAppDispatch } from "../../../app/hooks";
import { deleteProductReview } from "../../../features/admin/adminSlice";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import CircularProgress from "@mui/material/CircularProgress";

export default function ReviewsPanel({ products, mutationStatus }) {
  const dispatch = useAppDispatch();
  const [selectedProductId, setSelectedProductId] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const selectedProduct = useMemo(() => {
    return products.find((p) => String(p._id || p.id) === String(selectedProductId));
  }, [products, selectedProductId]);

  const existingReviews = useMemo(() => {
    return Array.isArray(selectedProduct?.reviews) ? selectedProduct.reviews : [];
  }, [selectedProduct]);

  function handleProductChange(e) {
    setSelectedProductId(e.target.value);
    setDeleteMessage("");
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm("Are you sure you want to delete this review? It will be removed from the website.")) {
      return;
    }

    setDeletingId(reviewId);
    setDeleteMessage("");

    try {
      await dispatch(
        deleteProductReview({ productId: selectedProductId, reviewId })
      ).unwrap();
      setDeleteMessage("Review deleted successfully.");
    } catch (err) {
      setDeleteMessage(`Error deleting review: ${err || "Failed"}`);
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <article className="panel p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-900">
          Manage Text Reviews / تقييمات العملاء
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Select a product to view and manage its text reviews. You can delete inappropriate or unwanted reviews here.
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
              {product.name_en || product.name || product.name_ar} (Reviews: {product.reviews?.length || 0})
            </option>
          ))}
        </select>
      </div>

      {deleteMessage && (
        <div className={`mb-6 p-3 rounded-lg text-sm font-medium ${deleteMessage.includes("Error") ? "bg-red-50 text-red-700" : "bg-teal-50 text-teal-800"}`}>
          {deleteMessage}
        </div>
      )}

      {selectedProduct ? (
        <div className="border-t border-slate-100 pt-6">
          <h4 className="text-sm font-bold text-slate-800 mb-4">
            Current Reviews ({existingReviews.length})
          </h4>
          
          {existingReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {existingReviews.map((review) => (
                <div key={review._id} className="flex flex-col p-4 rounded-xl border border-slate-200 bg-slate-50 relative">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">{review.reviewerName}</h5>
                      <p className="text-xs text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex text-orange-400">
                      {[...Array(5)].map((_, i) => (
                        <StarRoundedIcon 
                          key={i} 
                          fontSize="small" 
                          className={i < review.rating ? "text-orange-400" : "text-slate-300"} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-slate-700 mt-2 flex-grow bg-white p-3 rounded-lg border border-slate-100 italic">
                    "{review.comment}"
                  </p>
                  
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => handleDeleteReview(review._id)}
                      disabled={deletingId === review._id}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg border border-red-100 hover:bg-red-100 transition-colors disabled:opacity-50"
                    >
                      {deletingId === review._id ? (
                        <CircularProgress size={14} color="inherit" />
                      ) : (
                        <DeleteOutlineRoundedIcon fontSize="small" />
                      )}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic bg-slate-50 p-6 rounded-lg text-center border border-dashed border-slate-200">
              No text reviews found for this product.
            </p>
          )}
        </div>
      ) : (
        <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
          <p className="text-sm text-slate-500">Select a product above to view its text reviews.</p>
        </div>
      )}
    </article>
  );
}
