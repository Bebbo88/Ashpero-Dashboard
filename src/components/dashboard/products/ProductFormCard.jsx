function ProductFormCard({
  editingProductId,
  mutationStatus,
  form,
  productImageFiles,
  editingPreview,
  customCategory,
  sizeDraft,
  categoryOptions,
  onFieldChange,
  onCategoryChange,
  onCustomCategoryChange,
  onSizeDraftChange,
  onSizeDraftKeyDown,
  onAddSize,
  onRemoveSize,
  onImageFilesChange,
  onSubmit,
  onReset
}) {
  return (
    <article className="panel p-4">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-slate-900">
          {editingProductId ? "Edit Product" : "Create Product"}
        </h3>
        <p className="text-xs text-slate-500">
          English + Arabic product fields are required. Category is required. Sizes are optional.
        </p>
      </div>

      <form className="grid gap-3 md:grid-cols-2" onSubmit={onSubmit}>
        <input
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          name="name_en"
          placeholder="Name (English)"
          value={form.name_en}
          onChange={onFieldChange}
          required
        />
        <input
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          name="name_ar"
          placeholder="Name (Arabic)"
          value={form.name_ar}
          onChange={onFieldChange}
          required
        />

        <textarea
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm md:col-span-2"
          rows={2}
          name="description_en"
          placeholder="Description (English)"
          value={form.description_en}
          onChange={onFieldChange}
          required
        />
        <textarea
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm md:col-span-2"
          rows={2}
          name="description_ar"
          placeholder="Description (Arabic)"
          value={form.description_ar}
          onChange={onFieldChange}
          required
        />

        <label className="text-xs font-semibold text-slate-600">
          Category
          <select
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            name="category"
            value={form.category}
            onChange={onCategoryChange}
            required
          >
            <option value="" disabled>
              Select category
            </option>
            {categoryOptions.map((categoryOption) => (
              <option key={categoryOption} value={categoryOption}>
                {categoryOption}
              </option>
            ))}
            <option value="__custom__">+ Add custom category</option>
          </select>
        </label>

        {form.category === "__custom__" ? (
          <input
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            placeholder="Custom category"
            value={customCategory}
            onChange={onCustomCategoryChange}
            required
          />
        ) : (
          <div className="hidden md:block" />
        )}

        <input
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          name="price"
          placeholder="Price"
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={onFieldChange}
          required
        />
        <input
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
          name="stock"
          placeholder="Stock"
          type="number"
          min="0"
          step="1"
          value={form.stock}
          onChange={onFieldChange}
          required
        />

        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2">
          <div className="mb-2 text-xs font-semibold text-slate-700">Sizes (Optional)</div>
          <div className="flex flex-wrap gap-2">
            <input
              className="min-w-[170px] flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              placeholder="Example: 50ml"
              value={sizeDraft}
              onChange={onSizeDraftChange}
              onKeyDown={onSizeDraftKeyDown}
            />
            <button
              type="button"
              onClick={onAddSize}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Add Size
            </button>
          </div>
          {form.sizes.length > 0 ? (
            <div className="mt-2 flex flex-wrap gap-2">
              {form.sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onRemoveSize(size)}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
                  title="Remove size"
                >
                  {size} x
                </button>
              ))}
            </div>
          ) : (
            <p className="mt-2 text-[11px] text-slate-500">No sizes added yet.</p>
          )}
        </div>

        <label className="text-xs font-semibold text-slate-600 md:col-span-2">
          Product Images (up to 5 files)
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onImageFilesChange}
            className="file-upload-input mt-1"
          />
        </label>

        {editingProductId ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 md:col-span-2">
            <p>Current product images: {editingPreview.images.length}</p>
            <p className="mt-1 text-[11px]">Uploading new files appends to current product images.</p>
          </div>
        ) : null}

        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
          <input type="checkbox" name="isActive" checked={form.isActive} onChange={onFieldChange} />
          Product is active
        </label>
        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
          <input
            type="checkbox"
            name="isBestSeller"
            checked={form.isBestSeller}
            onChange={onFieldChange}
          />
          Mark as best seller
        </label>

        <div className="flex flex-wrap gap-2 md:col-span-2">
          <button
            type="submit"
            disabled={mutationStatus === "loading"}
            className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {editingProductId ? "Update Product" : "Create Product"}
          </button>
          {editingProductId ? (
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
            >
              Cancel Edit
            </button>
          ) : null}
        </div>
      </form>
    </article>
  );
}

export default ProductFormCard;
