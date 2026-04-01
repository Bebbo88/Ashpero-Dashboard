export const INITIAL_FORM = {
  title_en: "",
  title_ar: "",
  description_en: "",
  description_ar: "",
  type: "image",
  videoUrl: ""
};

export function mapTipsRows(tips) {
  return [...tips]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map((tip) => ({
      id: tip._id,
      ...tip
    }));
}

export function buildTipFormData(form, imageFile) {
  const formData = new FormData();

  formData.append("title_en", form.title_en.trim());
  formData.append("title_ar", form.title_ar.trim());
  formData.append("description_en", form.description_en.trim());
  formData.append("description_ar", form.description_ar.trim());
  formData.append("type", form.type);

  if (form.videoUrl.trim()) {
    formData.append("videoUrl", form.videoUrl.trim());
  }

  if (imageFile) {
    formData.append("image", imageFile);
  }

  return formData;
}
