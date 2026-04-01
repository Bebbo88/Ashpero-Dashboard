import { DataGrid } from "@mui/x-data-grid";
import OverviewCharts from "../../charts/OverviewCharts";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";

function OverviewPanel({ dashboard, orders, inventory }) {
  const totalRevenue = Number(dashboard.totalRevenue || 0);
  const totalOrders = Number(dashboard.totalOrders || 0);
  const totalProducts = Number(dashboard.totalProducts || 0);
  const totalActiveOffers = Number(dashboard.totalActiveOffers || 0);
  const lowStockProducts = Number(dashboard.lowStockProducts || 0);

  const deliveredOrders = orders.filter((order) => order.orderStatus === "delivered").length;
  const cancelledOrders = orders.filter((order) => order.orderStatus === "cancelled").length;
  const paidOrders = orders.filter((order) => order.paymentStatus === "paid").length;
  const failedPayments = orders.filter((order) => order.paymentStatus === "failed").length;

  const inventoryUnits = inventory.reduce(
    (sum, item) => sum + (Number.isFinite(Number(item.currentStock)) ? Number(item.currentStock) : 0),
    0
  );

  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const deliveredRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;

  const firstRowCards = [
    {
      key: "revenue",
      label: "Total Revenue",
      value: formatCurrency(totalRevenue),
      note: "Gross revenue tracked from all orders"
    },
    {
      key: "products",
      label: "Total Products",
      value: String(totalProducts),
      note: "Catalog breadth currently available"
    },
    {
      key: "offers",
      label: "Active Offers",
      value: String(totalActiveOffers),
      note: "Running campaigns in active date window"
    },
    {
      key: "inventory",
      label: "Inventory Units",
      value: String(inventoryUnits),
      note: `${lowStockProducts} products are below stock threshold`
    }
  ];

  const executiveCards = [
    {
      key: "orders",
      label: "Total Orders",
      value: String(totalOrders),
      trend: "Overall order volume in the system",
      tone: "teal"
    },
    {
      key: "aov",
      label: "Average Order Value",
      value: formatCurrency(averageOrderValue),
      trend: `${totalOrders} orders contributed to this average`,
      tone: "teal"
    },
    {
      key: "delivery",
      label: "Delivered Orders",
      value: String(deliveredOrders),
      trend: `${deliveredRate.toFixed(1)}% delivery completion rate`,
      tone: "orange"
    },
    {
      key: "payments",
      label: "Paid Orders",
      value: String(paidOrders),
      trend: failedPayments > 0 ? `${failedPayments} failed payments need follow-up` : "No failed payments",
      tone: failedPayments > 0 ? "red" : "teal"
    },
    {
      key: "risk",
      label: "Low Stock Alerts",
      value: String(lowStockProducts),
      trend: "Products at or below reorder threshold",
      tone: "red"
    },
    {
      key: "cancelled",
      label: "Cancelled Orders",
      value: String(cancelledOrders),
      trend: "Cancelled orders across all periods",
      tone: "red"
    }
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
      createdAt: order.createdAt
    }));

  return (
    <section className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {firstRowCards.map((card) => (
          <article key={card.key} className="metric-card p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{card.label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.note}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        {executiveCards.map((card) => (
          <article key={card.key} className="panel p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">{card.label}</p>
            <p className="mt-2 text-xl font-bold text-slate-900">{card.value}</p>
            <p
              className={`mt-1 text-xs font-semibold ${
                card.tone === "red"
                  ? "text-red-600"
                  : card.tone === "orange"
                    ? "text-orange-600"
                    : "text-teal-700"
              }`}
            >
              {card.trend}
            </p>
          </article>
        ))}
      </div>

      <OverviewCharts orders={orders} inventory={inventory} />

      <article className="panel p-4">
        <div className="mb-3">
          <h3 className="text-sm font-bold text-slate-900">Recent Orders</h3>
          <p className="text-xs text-slate-500">Quick visibility into latest order flow</p>
        </div>
        <div className="h-[360px] w-full">
          <DataGrid
            rows={recentOrders}
            columns={[
              {
                field: "customerName",
                headerName: "Customer",
                flex: 1.1,
                minWidth: 130
              },
              {
                field: "totalPrice",
                headerName: "Total",
                flex: 0.8,
                minWidth: 110,
                valueFormatter: (value) => formatCurrency(value)
              },
              {
                field: "paymentStatus",
                headerName: "Payment",
                flex: 0.8,
                minWidth: 100
              },
              {
                field: "orderStatus",
                headerName: "Order",
                flex: 0.9,
                minWidth: 100
              },
              {
                field: "createdAt",
                headerName: "Created",
                flex: 1.2,
                minWidth: 160,
                valueFormatter: (value) => formatDateTime(value)
              }
            ]}
            disableRowSelectionOnClick
            hideFooter
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                borderBottomColor: "#e2e8f0"
              },
              "& .MuiDataGrid-cell": {
                borderBottomColor: "#eef2ff"
              }
            }}
          />
        </div>
      </article>
    </section>
  );
}

export default OverviewPanel;
