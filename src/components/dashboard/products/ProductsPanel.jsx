import { useMemo, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import {
  createProduct,
  deleteProduct,
  updateProduct,
  updateProductStock
} from "../../../features/admin/adminSlice";
import { DEFAULT_CATEGORIES, INITIAL_FORM } from "./constants";
import { normalizeList } from "./helpers";
import ProductFormCard from "./ProductFormCard";
import ProductsTableCard from "./ProductsTableCard";

function syncSizePricesWithSizes(sizePrices = [], sizes = []) {
  const nextSizes = normalizeList(sizes);

  return nextSizes.map((size) => {
    const existing = (sizePrices || []).find(
      (entry) => String(entry.size || "").trim().toLowerCase() === size.toLowerCase()
    );

    return {
      size,
      price: existing?.price ?? ""
    };
  });
}

function ProductsPanel({ products, mutationStatus }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(INITIAL_FORM);
  const [productImageFiles, setProductImageFiles] = useState([]);
  const [editingProductId, setEditingProductId] = useState("");
  const [editingPreview, setEditingPreview] = useState({
    images: []
  });
  const [stockDraft, setStockDraft] = useState({});
  const [customCategory, setCustomCategory] = useState("");
  const [sizeDraft, setSizeDraft] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const rows = useMemo(
    () =>
      [...products]
        .sort(
          (left, right) =>
            new Date(right.updatedAt || right.createdAt) - new Date(left.updatedAt || left.createdAt)
        )
        .map((product) => ({
          id: product._id,
          ...product,
          sizes: Array.isArray(product.sizes) ? normalizeList(product.sizes) : [],
          sizePrices: Array.isArray(product.sizePrices)
            ? product.sizePrices.map((entry) => ({
                size: String(entry?.size || "").trim(),
                price: entry?.price ?? ""
              }))
            : []
        })),
    [products]
  );

  const categoryOptions = useMemo(() => {
    const productCategories = products.map((product) => product.category);
    return normalizeList([...DEFAULT_CATEGORIES, ...productCategories]);
  }, [products]);

  const tableCategories = useMemo(
    () => normalizeList(rows.map((row) => row.category)),
    [rows]
  );

  const filteredRows = useMemo(() => {
    if (categoryFilter === "all") {
      return rows;
    }

    return rows.filter(
      (row) => String(row.category || "").trim().toLowerCase() === categoryFilter.toLowerCase()
    );
  }, [rows, categoryFilter]);

  function resetForm() {
    setForm(INITIAL_FORM);
    setProductImageFiles([]);
    setEditingProductId("");
    setEditingPreview({ images: [] });
    setCustomCategory("");
    setSizeDraft("");
  }

  function onFieldChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value
    }));
  }

  function onCategoryChange(event) {
    const { value } = event.target;

    setForm((previous) => ({
      ...previous,
      category: value
    }));

    if (value !== "__custom__") {
      setCustomCategory("");
    }
  }

  function resolveCategory() {
    if (form.category === "__custom__") {
      return customCategory.trim();
    }

    return String(form.category || "").trim();
  }

  function addSize() {
    const sizeValue = sizeDraft.trim();

    if (!sizeValue) {
      return;
    }

    setForm((previous) => {
      const nextSizes = normalizeList([...previous.sizes, sizeValue]);
      return {
        ...previous,
        sizes: nextSizes,
        sizePrices: syncSizePricesWithSizes(previous.sizePrices, nextSizes)
      };
    });
    setSizeDraft("");
  }

  function removeSize(sizeToRemove) {
    setForm((previous) => {
      const nextSizes = previous.sizes.filter((size) => size !== sizeToRemove);
      return {
        ...previous,
        sizes: nextSizes,
        sizePrices: syncSizePricesWithSizes(previous.sizePrices, nextSizes)
      };
    });
  }

  function changeSizePrice(size, value) {
    const nextValue = value === "" ? "" : String(value);

    setForm((previous) => ({
      ...previous,
      sizePrices: previous.sizePrices.map((entry) =>
        entry.size === size
          ? {
              ...entry,
              price: nextValue
            }
          : entry
      )
    }));
  }

  function buildFormData() {
    const formData = new FormData();
    const categoryValue = resolveCategory();

    formData.append("name_en", form.name_en.trim());
    formData.append("name_ar", form.name_ar.trim());
    formData.append("description_en", form.description_en.trim());
    formData.append("description_ar", form.description_ar.trim());
    formData.append("ingredients_en", form.ingredients_en.trim());
    formData.append("ingredients_ar", form.ingredients_ar.trim());
    formData.append("howToUse_en", form.howToUse_en.trim());
    formData.append("howToUse_ar", form.howToUse_ar.trim());
    formData.append("category", categoryValue);
    formData.append("price", String(form.price).trim());
    formData.append("stock", String(form.stock).trim());
    formData.append("isActive", String(form.isActive));
    formData.append("isBestSeller", String(form.isBestSeller));

    for (const size of form.sizes) {
      formData.append("sizes", size);
    }

    const sizePricesPayload = form.sizePrices
      .map((entry) => ({
        size: String(entry.size || "").trim(),
        price: Number(entry.price)
      }))
      .filter((entry) => entry.size && Number.isFinite(entry.price));

    formData.append("sizePrices", JSON.stringify(sizePricesPayload));

    for (const file of productImageFiles) {
      formData.append("images", file);
    }

    return formData;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const categoryValue = resolveCategory();

    if (!categoryValue) {
      return;
    }

    if (
      form.sizes.length > 0 &&
      form.sizePrices.some((entry) => entry.price === "" || Number(entry.price) < 0 || Number.isNaN(Number(entry.price)))
    ) {
      return;
    }

    const formData = buildFormData();

    try {
      if (editingProductId) {
        await dispatch(updateProduct({ productId: editingProductId, formData })).unwrap();
      } else {
        await dispatch(createProduct(formData)).unwrap();
      }

      resetForm();
    } catch (_error) {
      // Error state is surfaced through admin slice.
    }
  }

  function startEdit(row) {
    setEditingProductId(row.id);
    setProductImageFiles([]);
    setEditingPreview({
      images: Array.isArray(row.images) ? row.images : []
    });

    const rowCategory = String(row.category || "").trim();

    setForm({
      name_en: row.name_en || row.name || "",
      name_ar: row.name_ar || "",
      description_en: row.description_en || row.description || "",
      description_ar: row.description_ar || "",
      ingredients_en: row.ingredients_en || "",
      ingredients_ar: row.ingredients_ar || "",
      howToUse_en: row.howToUse_en || "",
      howToUse_ar: row.howToUse_ar || "",
      category: rowCategory,
      price: row.price ?? "",
      stock: row.stock ?? "",
      sizes: Array.isArray(row.sizes) ? normalizeList(row.sizes) : [],
      sizePrices: syncSizePricesWithSizes(
        Array.isArray(row.sizePrices) ? row.sizePrices : [],
        Array.isArray(row.sizes) ? normalizeList(row.sizes) : []
      ),
      isActive: typeof row.isActive === "boolean" ? row.isActive : true,
      isBestSeller: typeof row.isBestSeller === "boolean" ? row.isBestSeller : false
    });

    setCustomCategory("");
    setSizeDraft("");
  }

  function removeProduct(id) {
    dispatch(deleteProduct(id));

    if (editingProductId === id) {
      resetForm();
    }
  }

  function changeStockDraft(id, value) {
    setStockDraft((previous) => ({
      ...previous,
      [id]: value
    }));
  }

  async function saveStock(id, currentStock) {
    const nextStockRaw = stockDraft[id];
    const nextStock =
      nextStockRaw === undefined || nextStockRaw === "" ? currentStock : Number(nextStockRaw);

    if (Number.isNaN(nextStock) || nextStock === currentStock) {
      return;
    }

    try {
      await dispatch(updateProductStock({ productId: id, stock: nextStock })).unwrap();
      setStockDraft((previous) => {
        const nextDraft = { ...previous };
        delete nextDraft[id];
        return nextDraft;
      });
    } catch (_error) {
      // Error state is surfaced through admin slice.
    }
  }

  return (
    <section className="space-y-4">
      <ProductFormCard
        editingProductId={editingProductId}
        mutationStatus={mutationStatus}
        form={form}
        productImageFiles={productImageFiles}
        editingPreview={editingPreview}
        customCategory={customCategory}
        sizeDraft={sizeDraft}
        categoryOptions={categoryOptions}
        onFieldChange={onFieldChange}
        onCategoryChange={onCategoryChange}
        onCustomCategoryChange={(event) => setCustomCategory(event.target.value)}
        onSizeDraftChange={(event) => setSizeDraft(event.target.value)}
        onSizeDraftKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            addSize();
          }
        }}
        onAddSize={addSize}
        onRemoveSize={removeSize}
        onSizePriceChange={changeSizePrice}
        onImageFilesChange={(event) => setProductImageFiles(Array.from(event.target.files || []))}
        onSubmit={handleSubmit}
        onReset={resetForm}
      />

      <ProductsTableCard
        filteredRows={filteredRows}
        tableCategories={tableCategories}
        categoryFilter={categoryFilter}
        stockDraft={stockDraft}
        onCategoryFilterChange={(event) => setCategoryFilter(event.target.value)}
        onChangeStockDraft={changeStockDraft}
        onSaveStock={saveStock}
        onStartEdit={startEdit}
        onRemoveProduct={removeProduct}
      />
    </section>
  );
}

export default ProductsPanel;
