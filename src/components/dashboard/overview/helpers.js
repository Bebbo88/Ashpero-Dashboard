import { formatCurrency } from "../../../utils/formatters";

export function buildOverviewViewModel({ dashboard, orders, inventory }) {
  const totalRevenue = Number(dashboard.totalRevenue || 0);
  const totalOrders = Number(dashboard.totalOrders || 0);
  const totalProducts = Number(dashboard.totalProducts || 0);
  const totalActiveOffers = Number(dashboard.totalActiveOffers || 0);
  const lowStockProducts = Number(dashboard.lowStockProducts || 0);

  const deliveredOrders = orders.filter(
    (order) => order.orderStatus === "delivered",
  ).length;
  const cancelledOrders = orders.filter(
    (order) => order.orderStatus === "cancelled",
  ).length;
  const paidOrders = orders.filter(
    (order) => order.paymentStatus === "paid",
  ).length;
  const failedPayments = orders.filter(
    (order) => order.paymentStatus === "failed",
  ).length;

  const inventoryUnits = inventory.reduce(
    (sum, item) =>
      sum +
      (Number.isFinite(Number(item.currentStock))
        ? Number(item.currentStock)
        : 0),
    0,
  );

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const deliveredRate =
    totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

  const firstRowCards = [
    {
      key: "revenue",
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      note: "Gross revenue tracked from all orders",
    },
    {
      key: "products",
      label: "Total Products",
      value: String(totalProducts),
      note: "Catalog breadth currently available",
    },
    {
      key: "offers",
      label: "Active Offers",
      value: String(totalActiveOffers),
      note: "Running campaigns in active date window",
    },
    {
      key: "inventory",
      label: "Inventory Units",
      value: String(inventoryUnits),
      note: `${lowStockProducts} products are below stock threshold`,
    },
  ];

  const executiveCards = [
    {
      key: "orders",
      label: "Total Orders",
      value: String(totalOrders),
      trend: "Overall order volume in the system",
      tone: "teal",
    },

    {
      key: "delivery",
      label: "Delivered Orders",
      value: String(deliveredOrders),
      trend: `${deliveredRate.toFixed(1)}% delivery completion rate`,
      tone: "orange",
    },
    {
      key: "payments",
      label: "Paid Orders",
      value: String(paidOrders),
      trend:
        failedPayments > 0
          ? `${failedPayments} failed payments `
          : "No failed payments",
      tone: failedPayments > 0 ? "red" : "teal",
    },
  ];

  const recentOrders = [...orders]
    .sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt))
    .slice(0, 8)
    .map((order) => ({
      id: order._id,
      customerName: order.customerName,
      totalPrice: order.totalPrice,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    }));

  return {
    firstRowCards,
    executiveCards,
    recentOrders,
  };
}
