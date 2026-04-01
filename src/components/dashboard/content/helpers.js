import { parseLineSeparatedText } from "../../../utils/formatters";

function appendTextArray(formData, key, values) {
  for (const value of values) {
    const trimmedValue = String(value || "").trim();

    if (trimmedValue) {
      formData.append(key, trimmedValue);
    }
  }
}

export function buildContentFormData({ heroImageFiles, bannerFiles, marketingSectionsText }) {
  const formData = new FormData();

  for (const file of heroImageFiles) {
    formData.append("heroImages", file);
  }

  for (const file of bannerFiles) {
    formData.append("banners", file);
  }

  const marketingSections = parseLineSeparatedText(marketingSectionsText);

  if (marketingSections.length === 0) {
    formData.append("marketingSections", "");
  } else {
    appendTextArray(formData, "marketingSections", marketingSections);
  }

  return formData;
}
