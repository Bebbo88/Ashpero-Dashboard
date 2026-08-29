export const ORDER_STATUSES = ["new", "processing", "shipped", "delivered", "cancelled"];
export const PAYMENT_STATUSES = ["pending", "paid", "failed", "refunded"];

export const ORDER_STATUS_CONFIG = {
  new: { label: "New", badgeClass: "bg-sky-50 text-sky-700 border-sky-200" },
  processing: { label: "Processing", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
  shipped: { label: "Shipped", badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  delivered: { label: "Delivered", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  cancelled: { label: "Cancelled", badgeClass: "bg-rose-50 text-rose-700 border-rose-200" },
};

export const PAYMENT_STATUS_CONFIG = {
  pending: { label: "Pending", badgeClass: "bg-amber-50 text-amber-700 border-amber-200" },
  paid: { label: "Paid", badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  failed: { label: "Failed", badgeClass: "bg-rose-50 text-rose-700 border-rose-200" },
  refunded: { label: "Refunded", badgeClass: "bg-slate-100 text-slate-700 border-slate-200" },
};

export function mapOrderRows(orders = []) {
  return [...orders]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map((order) => ({
      id: order._id,
      merchantOrderId: order.merchantOrderId || order._id,
      customerName: order.customerName,
      phone: order.phone,
      secondaryPhone: order.secondaryPhone,
      address: order.address,
      governorate: order.shippingAddress?.governorate || "",
      city: order.shippingAddress?.city || "",
      totalPrice: order.finalPrice || order.totalPrice,
      orderStatus: order.orderStatus,
      paymentMethod: order.paymentMethod || "COD",
      paymentStatus: order.paymentStatus,
      paymentReference: order.paymentReference,
      trackingNumber: order.trackingNumber || "",
      shippingCompany: order.shippingCompany || "",
      adminNote: order.adminNote || "",
      itemsCount: Array.isArray(order.items) ? order.items.length : 0,
      createdAt: order.createdAt,
      rawOrder: order,
    }));
}
