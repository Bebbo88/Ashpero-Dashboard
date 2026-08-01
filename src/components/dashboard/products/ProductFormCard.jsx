export function ProductFormCard({
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
  onBeforeImageChange,
  onAfterImageChange,
  onPopupGalleryChange,
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
        {/* Big Premium Toggle for Is Bundle - Top Right / Span-2 */}
        <div className="md:col-span-2 flex items-center justify-between p-3.5 bg-slate-100 dark:bg-white/10 rounded-2xl border border-slate-300 dark:border-white/20 shadow-sm mb-2">
          <div>
            <h4 className="text-sm font-black text-slate-900 ">
              {form.isBundle ? "باقة/عرض نشط  (Bundle Active Mode)" : "منتج قياسي عادي (Standard Product Mode)"}
            </h4>
            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 mt-1">
              {form.isBundle ? "يتم إخفاء الحقول غير الأساسية تلقائياً لعرض الباقة فقط." : "عرض كافة الحقول القياسية لإنشاء منتج تقليدي."}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input
              type="checkbox"
              name="isBundle"
              checked={form.isBundle || false}
              onChange={onFieldChange}
              className="sr-only"
            />
            <div
              className={`w-14 h-7 rounded-full transition-colors relative duration-300 ${form.isBundle ? "bg-teal-600" : "bg-slate-300 dark:bg-slate-700"}`}
            >
              <div
                className={`absolute top-[2px] left-[2px] bg-white w-6 h-6 rounded-full transition-transform duration-300 shadow-sm ${form.isBundle ? "translate-x-[28px]" : "translate-x-0"}`}
              />
            </div>
          </label>
        </div>

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

        <div className="md:col-span-2 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Description (English)</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">Quick HTML tags:</span>
              <button
                type="button"
                onClick={() =>
                  onFieldChange({
                    target: {
                      name: "description_en",
                      value: (form.description_en || "") + "<b>Bold text</b>",
                    },
                  })
                }
                className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
              >
                <b>Bold</b>
              </button>
              <button
                type="button"
                onClick={() =>
                  onFieldChange({
                    target: {
                      name: "description_en",
                      value:
                        (form.description_en || "") +
                        '<span class="text-orange-500 font-bold">Orange text</span>',
                    },
                  })
                }
                className="px-2 py-0.5 rounded border border-amber-300 bg-amber-50 text-[11px] font-bold text-amber-700 hover:bg-amber-100"
              >
                Orange
              </button>
              <button
                type="button"
                onClick={() =>
                  onFieldChange({
                    target: {
                      name: "description_en",
                      value:
                        (form.description_en || "") +
                        '<span class="text-brand-mint font-bold">Mint text</span>',
                    },
                  })
                }
                className="px-2 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
              >
                Mint
              </button>
            </div>
          </div>
          <textarea
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            rows={2}
            name="description_en"
            placeholder="Description (English)"
            value={form.description_en}
            onChange={onFieldChange}
            required
          />
        </div>

        <div className="md:col-span-2 flex flex-col gap-1">
          <div className="flex items-center justify-between text-xs font-medium text-slate-500">
            <span>Description (Arabic)</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] text-slate-400">وسوم منسقة:</span>
              <button
                type="button"
                onClick={() =>
                  onFieldChange({
                    target: {
                      name: "description_ar",
                      value: (form.description_ar || "") + "<b>خط عريض</b>",
                    },
                  })
                }
                className="px-2 py-0.5 rounded border border-slate-300 bg-slate-50 text-[11px] font-bold text-slate-700 hover:bg-slate-100"
              >
                <b>عريض</b>
              </button>
              <button
                type="button"
                onClick={() =>
                  onFieldChange({
                    target: {
                      name: "description_ar",
                      value:
                        (form.description_ar || "") +
                        '<span class="text-orange-500 font-bold">نص برتقالي</span>',
                    },
                  })
                }
                className="px-2 py-0.5 rounded border border-amber-300 bg-amber-50 text-[11px] font-bold text-amber-700 hover:bg-amber-100"
              >
                برتقالي
              </button>
              <button
                type="button"
                onClick={() =>
                  onFieldChange({
                    target: {
                      name: "description_ar",
                      value:
                        (form.description_ar || "") +
                        '<span class="text-brand-mint font-bold">نص أخضر</span>',
                    },
                  })
                }
                className="px-2 py-0.5 rounded border border-emerald-300 bg-emerald-50 text-[11px] font-bold text-emerald-700 hover:bg-emerald-100"
              >
                أخضر
              </button>
            </div>
          </div>
          <textarea
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
            rows={2}
            name="description_ar"
            placeholder="Description (Arabic)"
            value={form.description_ar}
            onChange={onFieldChange}
            required
          />
        </div>

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

        {!form.isBundle && (
          <>
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
          </>
        )}

        {!form.isBundle && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 md:col-span-2">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-700">
                Product Variants (مقاسات وأسعار وكميات المنتج)
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
                    className="rounded-lg border border-slate-300 bg-red-50 px-3 py-2 text-sm font-semibold text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Pricing inputs before images */}
        {form.isBundle ? (
          <div className="md:col-span-2 grid gap-3 md:grid-cols-2 p-3 rounded-lg border border-slate-200 bg-slate-50">
            <label className="text-xs font-semibold text-slate-600">
              السعر (Price)
              <input
                type="number"
                className="w-full mt-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                name="price"
                placeholder="مثال: 350"
                value={form.price || ""}
                onChange={onFieldChange}
                required
              />
            </label>
            <label className="text-xs font-semibold text-slate-600">
              الكمية / المخزون (Stock)
              <input
                type="number"
                className="w-full mt-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
                name="stock"
                placeholder="مثال: 99"
                value={form.stock || ""}
                onChange={onFieldChange}
                required
              />
            </label>
          </div>
        ) : (
          <label className="text-xs font-semibold text-slate-600 md:col-span-2">
            السعر الأصلي (Original Price - اختياري)
            <input
              type="number"
              className="w-full mt-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm"
              name="oldPrice"
              placeholder="مثال: 500"
              value={form.oldPrice || ""}
              onChange={onFieldChange}
            />
          </label>
        )}

        <label className="text-xs font-semibold text-slate-600 md:col-span-2">
          Product Main Images (أول 4 صور سيتم عرضها كـ Collage داخل الباندل)
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={onImageFilesChange}
            className="file-upload-input mt-1"
          />
        </label>

        {!form.isBundle && (
          <>
            {/* Before / After Section */}
            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded-lg border border-slate-200 bg-slate-50">
              <label className="text-xs font-semibold text-slate-700">
                Before Image (Optional)
                <input
                  type="file"
                  accept="image/*"
                  onChange={onBeforeImageChange}
                  className="file-upload-input mt-1"
                />
              </label>
              <label className="text-xs font-semibold text-slate-700">
                After Image (Optional)
                <input
                  type="file"
                  accept="image/*"
                  onChange={onAfterImageChange}
                  className="file-upload-input mt-1"
                />
              </label>
            </div>

            {/* Popup Gallery Section */}
            <div className="md:col-span-2 p-3 rounded-lg border border-slate-200 bg-slate-50">
              <label className="text-xs font-semibold text-slate-700 block">
                Popup Gallery Images (Up to 4 images)
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onPopupGalleryChange}
                  className="file-upload-input mt-1"
                />
              </label>
            </div>
          </>
        )}

        {editingProductId ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 md:col-span-2">
            <p>Current product images: {editingPreview.images.length}</p>
            <p className="mt-1 text-[11px]">
              Uploading new images will replace the current product images.
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
