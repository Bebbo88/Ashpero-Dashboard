export const INITIAL_FORM = {
  title_en: "",
  title_ar: "",
  discountType: "percentage",
  discountValue: "",
  startDate: "",
  endDate: "",
  productIds: [],
  isActive: true
};

export function toDateInputValue(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString().slice(0, 10);
}

export function getProductLabel(product) {
  const englishName = product?.name_en || product?.name || "";
  const arabicName = product?.name_ar || "";

  if (englishName && arabicName) {
    return `${englishName} | ${arabicName}`;
  }

  return englishName || arabicName || "Unnamed Product";
}

export function getSortedProducts(products) {
  return [...products].sort((left, right) =>
    getProductLabel(left).localeCompare(getProductLabel(right), "en", { sensitivity: "base" })
  );
}

export function mapOfferRows(offers) {
  return [...offers]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map((offer) => ({
      id: offer._id,
      ...offer,
      title_en: offer.title_en || offer.title || "",
      title_ar: offer.title_ar || "",
      productsCount: Array.isArray(offer.productIds) ? offer.productIds.length : 0
    }));
}

export function buildOfferPayload(form) {
  return {
    title_en: form.title_en.trim(),
    title_ar: form.title_ar.trim(),
    discountType: form.discountType,
    discountValue: Number(form.discountValue),
    startDate: form.startDate,
    endDate: form.endDate,
    productIds: form.productIds,
    isActive: form.isActive
  };
}

export function normalizeOfferProductIds(productIds) {
  return (productIds || [])
    .map((entry) => (typeof entry === "string" ? entry : entry?._id || entry?.id || ""))
    .filter(Boolean);
}
