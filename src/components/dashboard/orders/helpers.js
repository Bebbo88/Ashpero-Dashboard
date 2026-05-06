export const ORDER_STATUSES = ["new", "processing", "shipped", "delivered"];
export const PAYMENT_STATUSES = ["pending", "paid", "failed"];

export function mapOrderRows(orders) {
  return [...orders]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map((order) => ({
      id: order._id,
      merchantOrderId: order.merchantOrderId || order._id,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      totalPrice: order.finalPrice || order.totalPrice,
      orderStatus: order.orderStatus,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      paymentReference: order.paymentReference,
      itemsCount: Array.isArray(order.items) ? order.items.length : 0,
      createdAt: order.createdAt
    }));
}
