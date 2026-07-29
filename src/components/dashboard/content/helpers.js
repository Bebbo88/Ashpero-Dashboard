export function buildContentFormData({
  topBannerTextEn,
  topBannerTextAr,
  heroImageFiles,
  bannerFiles,
  spotlightImageFiles,
  popupImageFile,
  popupExpiresAt,
  countdownEnabled,
  countdownTargetDate,
  countdownTitleEn,
  countdownTitleAr
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

  if (popupImageFile) {
    formData.append("popupImage", popupImageFile);
  }

  formData.append("popupExpiresAt", toIsoDateTimeFromInput(popupExpiresAt));
  formData.append("countdownEnabled", String(Boolean(countdownEnabled)));
  formData.append("countdownTargetDate", toIsoDateTimeFromInput(countdownTargetDate));
  formData.append("countdownTitle_en", (countdownTitleEn || "").trim());
  formData.append("countdownTitle_ar", (countdownTitleAr || "").trim());

  return formData;
}

export function toDateTimeInputValue(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 16);
}

export function toIsoDateTimeFromInput(value) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toISOString();
}
