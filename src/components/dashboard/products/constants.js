export const DEFAULT_CATEGORIES = [
  "Anti-Aging",
  "Hydration",
  "Glow",
  "Cleansing",
];
export const DEFAULT_PRODUCT_TYPES = [
  "serums",
  "moisturizers",
  "cleansers",
  "masks",
  "oils",
  "spf",
];
export const DEFAULT_SKIN_TYPES = [
  "oily",
  "dry",
  "combination",
  "normal",
  "sensitive",
];

export const INITIAL_FORM = {
  name_en: "",
  name_ar: "",
  description_en: "",
  description_ar: "",
  ingredients_en: "",
  ingredients_ar: "",
  howToUse_en: "",
  howToUse_ar: "",
  category: "",
  productType: [],
  skinType: [],
  variants: [
    {
      size: "",
      price: "",
      stock: "",
    },
  ],
  isActive: true,
  isBestSeller: false,
  isBundle: false,
  bundleIncludes: [],
  oldPrice: "",
  price: "",
  stock: "",
};
