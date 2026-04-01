export const INITIAL_FORM = {
  code: "",
  discountType: "percentage",
  discountValue: "",
  maxUsage: "",
  usedCount: "0",
  expiresAt: "",
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

export function mapCouponRows(coupons) {
  return [...coupons]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map((coupon) => ({
      id: coupon._id,
      ...coupon
    }));
}

export function buildCouponPayload(form) {
  return {
    code: form.code,
    discountType: form.discountType,
    discountValue: Number(form.discountValue),
    maxUsage: Number(form.maxUsage),
    usedCount: Number(form.usedCount),
    expiresAt: form.expiresAt,
    isActive: form.isActive
  };
}
