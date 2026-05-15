export function buildContentFormData({
  topBannerTextEn,
  topBannerTextAr,
  heroImageFiles,
  bannerFiles,
  spotlightImageFiles
}) {
  const formData = new FormData();

  formData.append("topBannerText_en", topBannerTextEn.trim());
  formData.append("topBannerText_ar", topBannerTextAr.trim());

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
