export const ORDER_STATUSES = ["new", "processing", "shipped", "delivered"];

export function mapOrderRows(orders) {
  return [...orders]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .map((order) => ({
      id: order._id,
      customerName: order.customerName,
      phone: order.phone,
      address: order.address,
      totalPrice: order.totalPrice,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      itemsCount: Array.isArray(order.items) ? order.items.length : 0,
      createdAt: order.createdAt
    }));
}
