import { parseLineSeparatedText } from "../../../utils/formatters";

export function buildContentFormData({ heroImageFiles, bannerFiles, spotlightImageFiles }) {
  const formData = new FormData();

  for (const file of heroImageFiles) {
    formData.append("heroImages", file);
  }

  for (const file of bannerFiles) {
    formData.append("banners", file);
  }

  for (const file of spotlightImageFiles) {
    formData.append("spotlightImages", file);
  }

  return formData;
}
