function ProductFormCard({
  editingProductId,
  mutationStatus,
  form,
  productImageFiles,
  editingPreview,
  customCategory,
  sizeDraft,
  categoryOptions,
  productTypeOptions,
  skinTypeOptions,
  onFieldChange,
  onCategoryChange,
  onCustomCategoryChange,
  onSizeDraftChange,
  onSizeDraftKeyDown,
  onAddSize,
  onRemoveSize,
  onSizePriceChange,
  onToggleProductType,
  onToggleSkinType,
  onImageFilesChange,
  onSubmit,
  onReset,
  onAddVariant,
  onRemoveVariant,
  onChangeVariant,
}) {
  return (
    <article className="panel p-4">
      <div className="mb-3">
        <h3 className="text-sm font-bold text-slate-900">
          {editingProductId ? "Edit Product" : "Create Product"}
        </h3>
        <p className="text-xs text-slate-500">
          English + Arabic fields are required (name, description, ingredients,
          how to use). Category is required. Sizes are optional.
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

        <textarea
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm md:col-span-2"
          rows={2}
          name="ingredients_en"
          placeholder="Ingredients (English)"
          value={form.ingredients_en}
          onChange={onFieldChange}
          required
        />
        <textarea
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm md:col-span-2"
          rows={2}
          name="ingredients_ar"
          placeholder="Ingredients (Arabic)"
          value={form.ingredients_ar}
          onChange={onFieldChange}
          required
        />

        <textarea
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm md:col-span-2"
          rows={2}
          name="howToUse_en"
          placeholder="How To Use (English)"
          value={form.howToUse_en}
          onChange={onFieldChange}
          required
        />
        <textarea
          className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm md:col-span-2"
          rows={2}
          name="howToUse_ar"
          placeholder="How To Use (Arabic)"
          value={form.howToUse_ar}
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

        <div className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
          <p className="text-xs font-semibold text-slate-600">Product Type</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {productTypeOptions.map((option) => {
              const checked = form.productType.includes(option);

              return (
                <label
                  key={option}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleProductType(option)}
                  />
                  {option}
                </label>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
          <p className="text-xs font-semibold text-slate-600">Skin Type</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {skinTypeOptions.map((option) => {
              const checked = form.skinType.includes(option);

              return (
                <label
                  key={option}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => onToggleSkinType(option)}
                  />
                  {option}
                </label>
              );
            })}
          </div>
        </div>
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-700">
              Product Variants
            </p>

            <button
              type="button"
              onClick={onAddVariant}
              className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
            >
              Add Variant
            </button>
          </div>

          <div className="space-y-3">
            {form.variants.map((variant, index) => (
              <div key={index} className="grid gap-2 md:grid-cols-4">
                <input
                  type="text"
                  placeholder="Size"
                  value={variant.size}
                  onChange={(event) =>
                    onChangeVariant(index, "size", event.target.value)
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  required
                />

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="Price"
                  value={variant.price}
                  onChange={(event) =>
                    onChangeVariant(index, "price", event.target.value)
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  required
                />

                <input
                  type="number"
                  min="0"
                  step="1"
                  placeholder="Stock"
                  value={variant.stock}
                  onChange={(event) =>
                    onChangeVariant(index, "stock", event.target.value)
                  }
                  className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                  required
                />

                <button
                  type="button"
                  onClick={() => onRemoveVariant(index)}
                  className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
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
            <p className="mt-1 text-[11px]">
              Uploading new files appends to current product images.
            </p>
          </div>
        ) : null}

        <label className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700 md:col-span-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={onFieldChange}
          />
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
