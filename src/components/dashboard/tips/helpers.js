export const INITIAL_FORM = {
  videoTitle_en: "",
  videoTitle_ar: "",
  videoUrl: "",
  primaryTitle_en: "",
  primaryTitle_ar: "",
  primaryDescription_en: "",
  primaryDescription_ar: "",
  secondaryTitle_en: "",
  secondaryTitle_ar: "",
  secondaryDescription_en: "",
  secondaryDescription_ar: ""
};

export function mapTipsRows(tips) {
  return [...tips]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map((tip) => ({
      id: tip._id,
      ...tip
    }));
}

export function buildTipFormData(form, mediaFiles) {
  const formData = new FormData();

  const textFields = [
    "videoTitle_en",
    "videoTitle_ar",
    "videoUrl",
    "primaryTitle_en",
    "primaryTitle_ar",
    "primaryDescription_en",
    "primaryDescription_ar",
    "secondaryTitle_en",
    "secondaryTitle_ar",
    "secondaryDescription_en",
    "secondaryDescription_ar"
  ];

  textFields.forEach((fieldName) => {
    formData.append(fieldName, String(form[fieldName] || "").trim());
  });

  if (mediaFiles.videoFile) {
    formData.append("videoFile", mediaFiles.videoFile);
  }

  if (mediaFiles.primaryImage) {
    formData.append("primaryImage", mediaFiles.primaryImage);
  }

  if (mediaFiles.secondaryImage) {
    formData.append("secondaryImage", mediaFiles.secondaryImage);
  }

  return formData;
}
