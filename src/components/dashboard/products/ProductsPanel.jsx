import { useMemo, useState } from "react";
import { useAppDispatch } from "../../../app/hooks";
import {
  createProduct,
  deleteProduct,
  updateProduct,
} from "../../../features/admin/adminSlice";
import {
  DEFAULT_CATEGORIES,
  DEFAULT_PRODUCT_TYPES,
  DEFAULT_SKIN_TYPES,
  INITIAL_FORM,
} from "./constants";
import { normalizeList } from "./helpers";
import ProductFormCard from "./ProductFormCard";
import ProductsTableCard from "./ProductsTableCard";

function ProductsPanel({ products, mutationStatus }) {
  const dispatch = useAppDispatch();
  const [form, setForm] = useState(INITIAL_FORM);
  const [productImageFiles, setProductImageFiles] = useState([]);
  const [beforeImageFile, setBeforeImageFile] = useState(null);
  const [afterImageFile, setAfterImageFile] = useState(null);
  const [popupGalleryFiles, setPopupGalleryFiles] = useState([]);
  const [editingProductId, setEditingProductId] = useState("");
  const [editingPreview, setEditingPreview] = useState({
    images: [],
  });
  const [customCategory, setCustomCategory] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [productTypeFilter, setProductTypeFilter] = useState("all");
  const [skinTypeFilter, setSkinTypeFilter] = useState("all");

  const rows = useMemo(
    () =>
      [...products]
        .sort(
          (left, right) =>
            new Date(right.updatedAt || right.createdAt) -
            new Date(left.updatedAt || left.createdAt),
        )
        .map((product) => ({
          id: product._id,
          ...product,

          productType: Array.isArray(product.productType)
            ? normalizeList(product.productType)
            : [],
          skinType: Array.isArray(product.skinType)
            ? normalizeList(product.skinType)
            : [],
          variants: Array.isArray(product.variants) ? product.variants : [],
        })),
    [products],
  );

  const categoryOptions = useMemo(() => {
    const productCategories = products.map((product) => product.category);
    return normalizeList([...DEFAULT_CATEGORIES, ...productCategories]);
  }, [products]);
  const productTypeOptions = useMemo(() => {
    const existingValues = products.flatMap((product) =>
      Array.isArray(product.productType) ? product.productType : [],
    );
    return normalizeList([...DEFAULT_PRODUCT_TYPES, ...existingValues]);
  }, [products]);
  const skinTypeOptions = useMemo(() => {
    const existingValues = products.flatMap((product) =>
      Array.isArray(product.skinType) ? product.skinType : [],
    );
    return normalizeList([...DEFAULT_SKIN_TYPES, ...existingValues]);
  }, [products]);

  const tableCategories = useMemo(
    () => normalizeList(rows.map((row) => row.category)),
    [rows],
  );
  const tableProductTypes = useMemo(
    () =>
      normalizeList(
        rows.flatMap((row) =>
          Array.isArray(row.productType) ? row.productType : [],
        ),
      ),
    [rows],
  );
  const tableSkinTypes = useMemo(
    () =>
      normalizeList(
        rows.flatMap((row) =>
          Array.isArray(row.skinType) ? row.skinType : [],
        ),
      ),
    [rows],
  );

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      if (
        categoryFilter !== "all" &&
        String(row.category || "")
          .trim()
          .toLowerCase() !== categoryFilter.toLowerCase()
      ) {
        return false;
      }

      if (
        productTypeFilter !== "all" &&
        !row.productType.some(
          (entry) =>
            String(entry || "").toLowerCase() ===
            productTypeFilter.toLowerCase(),
        )
      ) {
        return false;
      }

      if (
        skinTypeFilter !== "all" &&
        !row.skinType.some(
          (entry) =>
            String(entry || "").toLowerCase() === skinTypeFilter.toLowerCase(),
        )
      ) {
        return false;
      }

      return true;
    });
  }, [rows, categoryFilter, productTypeFilter, skinTypeFilter]);

  function resetForm() {
    setForm(INITIAL_FORM);
    setProductImageFiles([]);
    setBeforeImageFile(null);
    setAfterImageFile(null);
    setPopupGalleryFiles([]);
    setEditingProductId("");
    setEditingPreview({ images: [] });
    setCustomCategory("");
  }

  function onFieldChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function onCategoryChange(event) {
    const { value } = event.target;

    setForm((previous) => ({
      ...previous,
      category: value,
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
  function addVariant() {
    setForm((previous) => ({
      ...previous,
      variants: [
        ...previous.variants,
        {
          size: "",
          price: "",
          stock: "",
        },
      ],
    }));
  }

  function removeVariant(index) {
    setForm((previous) => ({
      ...previous,
      variants: previous.variants.filter(
        (_, currentIndex) => currentIndex !== index,
      ),
    }));
  }

  function changeVariant(index, field, value) {
    setForm((previous) => ({
      ...previous,
      variants: previous.variants.map((variant, currentIndex) =>
        currentIndex === index
          ? {
              ...variant,
              [field]: value,
            }
          : variant,
      ),
    }));
  }



  function toggleArrayField(fieldName, option) {
    setForm((previous) => {
      const currentValues = Array.isArray(previous[fieldName])
        ? previous[fieldName]
        : [];
      const exists = currentValues.some(
        (entry) => entry.toLowerCase() === option.toLowerCase(),
      );
      const nextValues = exists
        ? currentValues.filter(
            (entry) => entry.toLowerCase() !== option.toLowerCase(),
          )
        : [...currentValues, option];

      return {
        ...previous,
        [fieldName]: normalizeList(nextValues),
      };
    });
  }

  function buildFormData() {
    const formData = new FormData();
    const isBundle = Boolean(form.isBundle);
    const categoryValue = isBundle ? "Bundles" : resolveCategory();

    formData.append("name_en", form.name_en.trim());
    formData.append("name_ar", form.name_ar.trim());
    formData.append("description_en", form.description_en.trim());
    formData.append("description_ar", form.description_ar.trim());

    if (isBundle) {
      formData.append("ingredients_en", "Bundle");
      formData.append("ingredients_ar", "باقة");
      formData.append("howToUse_en", "Bundle");
      formData.append("howToUse_ar", "باقة");
    } else {
      formData.append("ingredients_en", form.ingredients_en.trim());
      formData.append("ingredients_ar", form.ingredients_ar.trim());
      formData.append("howToUse_en", form.howToUse_en.trim());
      formData.append("howToUse_ar", form.howToUse_ar.trim());
    }

    formData.append("category", categoryValue);

    if (!isBundle) {
      for (const value of form.productType) {
        formData.append("productType", value);
      }
      for (const value of form.skinType) {
        formData.append("skinType", value);
      }
    }

    formData.append("isActive", String(form.isActive));
    formData.append("isBestSeller", String(form.isBestSeller));
    formData.append("isBundle", String(form.isBundle || false));
    formData.append("bundleIncludes", JSON.stringify(form.bundleIncludes || []));
    if (!isBundle && form.oldPrice !== undefined && form.oldPrice !== "") {
      formData.append("oldPrice", String(form.oldPrice));
    }

    const variantsPayload = isBundle
      ? [
          {
            size: "default",
            price: Number(form.price),
            stock: Number(form.stock),
          },
        ]
      : form.variants
          .map((variant) => ({
            size: String(variant.size || "").trim(),

            price: Number(variant.price),

            stock: Number(variant.stock),
          }))
          .filter(
            (variant) =>
              variant.size &&
              Number.isFinite(variant.price) &&
              Number.isFinite(variant.stock),
          );

    formData.append("variants", JSON.stringify(variantsPayload));

    for (const file of productImageFiles) {
      formData.append("images", file);
    }

    if (beforeImageFile) {
      formData.append("beforeImage", beforeImageFile);
    }

    if (afterImageFile) {
      formData.append("afterImage", afterImageFile);
    }

    for (const file of popupGalleryFiles) {
      formData.append("popupGalleryImages", file);
    }

    return formData;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const isBundle = Boolean(form.isBundle);
    const categoryValue = isBundle ? "Bundles" : resolveCategory();

    if (!categoryValue) {
      return;
    }

    const formData = buildFormData();

    try {
      if (editingProductId) {
        await dispatch(
          updateProduct({ productId: editingProductId, formData }),
        ).unwrap();
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
      images: Array.isArray(row.images) ? row.images : [],
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
      productType: Array.isArray(row.productType)
        ? normalizeList(row.productType)
        : [],
      skinType: Array.isArray(row.skinType) ? normalizeList(row.skinType) : [],
      variants: Array.isArray(row.variants) ? row.variants : [],
      isActive: typeof row.isActive === "boolean" ? row.isActive : true,
      isBestSeller:
        typeof row.isBestSeller === "boolean" ? row.isBestSeller : false,
      isBundle: typeof row.isBundle === "boolean" ? row.isBundle : false,
      bundleIncludes: Array.isArray(row.bundleIncludes) ? row.bundleIncludes : [],
      oldPrice: row.oldPrice !== undefined ? String(row.oldPrice) : "",
      price: (row.isBundle && Array.isArray(row.variants) && row.variants[0])
        ? String(row.variants[0].price)
        : "",
      stock: (row.isBundle && Array.isArray(row.variants) && row.variants[0])
        ? String(row.variants[0].stock)
        : "",
    });

    setCustomCategory("");
  }

  function removeProduct(id) {
    dispatch(deleteProduct(id));

    if (editingProductId === id) {
      resetForm();
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
        categoryOptions={categoryOptions}
        productTypeOptions={productTypeOptions}
        skinTypeOptions={skinTypeOptions}
        onFieldChange={onFieldChange}
        onCategoryChange={onCategoryChange}
        onCustomCategoryChange={(event) =>
          setCustomCategory(event.target.value)
        }
        onToggleProductType={(option) =>
          toggleArrayField("productType", option)
        }
        onToggleSkinType={(option) => toggleArrayField("skinType", option)}
        onImageFilesChange={(event) =>
          setProductImageFiles(Array.from(event.target.files || []))
        }
        onBeforeImageChange={(event) =>
          setBeforeImageFile(event.target.files?.[0] || null)
        }
        onAfterImageChange={(event) =>
          setAfterImageFile(event.target.files?.[0] || null)
        }
        onPopupGalleryChange={(event) =>
          setPopupGalleryFiles(Array.from(event.target.files || []))
        }
        onSubmit={handleSubmit}
        onReset={resetForm}
        onAddVariant={addVariant}
        onRemoveVariant={removeVariant}
        onChangeVariant={changeVariant}
      />

      <ProductsTableCard
        filteredRows={filteredRows}
        tableCategories={tableCategories}
        tableProductTypes={tableProductTypes}
        tableSkinTypes={tableSkinTypes}
        categoryFilter={categoryFilter}
        productTypeFilter={productTypeFilter}
        skinTypeFilter={skinTypeFilter}
        onCategoryFilterChange={(event) =>
          setCategoryFilter(event.target.value)
        }
        onProductTypeFilterChange={(event) =>
          setProductTypeFilter(event.target.value)
        }
        onSkinTypeFilterChange={(event) =>
          setSkinTypeFilter(event.target.value)
        }
        onStartEdit={startEdit}
        onRemoveProduct={removeProduct}
      />
    </section>
  );
}

export default ProductsPanel;
