import { Bar, Doughnut, Line } from "react-chartjs-2";

const ORDER_STATUS_ORDER = [
  "new",
  "processing",
  "confirmed",
  "paid",
  "shipped",
  "delivered",
  "cancelled",
  "pending"
];

function toStatusLabel(status) {
  if (!status) {
    return "Unknown";
  }

  return status.charAt(0).toUpperCase() + status.slice(1);
}

function buildRevenueTrendFromOrders(orders = [], monthsBack = 6) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  const buckets = [];
  const lookup = new Map();

  for (let offset = monthsBack - 1; offset >= 0; offset -= 1) {
    const date = new Date(now.getFullYear(), now.getMonth() - offset, 1);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    const bucket = {
      key,
      label: formatter.format(date),
      revenue: 0,
      orders: 0
    };

    buckets.push(bucket);
    lookup.set(key, bucket);
  }

  for (const order of orders) {
    const createdAt = new Date(order.createdAt);

    if (Number.isNaN(createdAt.getTime())) {
      continue;
    }

    const key = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
    const bucket = lookup.get(key);

    if (!bucket) {
      continue;
    }

    const totalPrice = Number(order.totalPrice || 0);

    if (Number.isFinite(totalPrice) && totalPrice >= 0) {
      bucket.revenue += totalPrice;
      bucket.orders += 1;
    }
  }

  return buckets.map((entry) => ({
    ...entry,
    revenue: Math.round(entry.revenue * 100) / 100
  }));
}

function getOrderStatusDistribution(orders = []) {
  const counts = new Map();

  for (const order of orders) {
    const status = String(order.orderStatus || "unknown").trim().toLowerCase();

    if (!status) {
      continue;
    }

    counts.set(status, (counts.get(status) || 0) + 1);
  }

  const entries = [...counts.entries()].filter(([, count]) => count > 0);

  return entries.sort((left, right) => {
    const leftIndex = ORDER_STATUS_ORDER.indexOf(left[0]);
    const rightIndex = ORDER_STATUS_ORDER.indexOf(right[0]);
    const safeLeftIndex = leftIndex === -1 ? ORDER_STATUS_ORDER.length : leftIndex;
    const safeRightIndex = rightIndex === -1 ? ORDER_STATUS_ORDER.length : rightIndex;

    if (safeLeftIndex !== safeRightIndex) {
      return safeLeftIndex - safeRightIndex;
    }

    return left[0].localeCompare(right[0], "en");
  });
}

function getInventoryPreview(inventory = []) {
  return [...inventory]
    .filter((entry) => Number.isFinite(Number(entry.currentStock)))
    .sort((left, right) => Number(left.currentStock) - Number(right.currentStock))
    .slice(0, 8);
}

function cardTitle(title, subtitle) {
  return (
    <div className="mb-3">
      <h3 className="text-sm font-bold text-slate-900">{title}</h3>
      <p className="text-xs text-slate-500">{subtitle}</p>
    </div>
  );
}

function emptyChartState(message) {
  return (
    <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3">
      <p className="text-xs font-semibold text-slate-500">{message}</p>
    </div>
  );
}

function OverviewCharts({ orders, inventory }) {
  const revenueTrend = buildRevenueTrendFromOrders(orders, 6);
  const orderStatusEntries = getOrderStatusDistribution(orders);
  const inventoryPreview = getInventoryPreview(inventory);
  const fixedChartClass = "relative h-[220px] max-h-[240px] md:h-[240px] md:max-h-[260px]";

  const statusColors = [
    "#f97316",
    "#0ea5e9",
    "#14b8a6",
    "#8b5cf6",
    "#22c55e",
    "#f43f5e",
    "#64748b",
    "#06b6d4"
  ];

  const sharedLegend = {
    labels: {
      usePointStyle: true,
      boxWidth: 10,
      color: "#1f2937",
      font: {
        size: 11,
        weight: "600"
      }
    }
  };

  return (
    <section className="grid items-start gap-4 xl:grid-cols-2">
      <article className="panel self-start p-4">
        {cardTitle("Revenue Momentum", "Last 6 months based on real order totals")}
        <div className={fixedChartClass}>
          <Line
            data={{
              labels: revenueTrend.map((entry) => entry.label),
              datasets: [
                {
                  label: "Revenue",
                  data: revenueTrend.map((entry) => entry.revenue),
                  borderColor: "#0f766e",
                  backgroundColor: "rgba(15,118,110,0.16)",
                  borderWidth: 2,
                  tension: 0.32,
                  fill: true,
                  pointRadius: 2.2
                }
              ]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { display: false } },
              scales: {
                y: {
                  grid: { color: "rgba(148,163,184,0.22)" }
                },
                x: {
                  grid: { display: false }
                }
              }
            }}
          />
        </div>
      </article>

      <article className="panel self-start p-4">
        {cardTitle("Order Status Mix", "Real distribution of current order statuses")}
        <div className="mx-auto h-[220px] max-h-[260px] max-w-[340px] md:h-[240px]">
          {orderStatusEntries.length > 0 ? (
            <Doughnut
              data={{
                labels: orderStatusEntries.map(([status]) => toStatusLabel(status)),
                datasets: [
                  {
                    data: orderStatusEntries.map(([, count]) => count),
                    backgroundColor: orderStatusEntries.map(
                      (_entry, index) => statusColors[index % statusColors.length]
                    ),
                    borderWidth: 0
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                  legend: {
                    position: "bottom",
                    ...sharedLegend
                  }
                }
              }}
            />
          ) : (
            emptyChartState("No order status data yet.")
          )}
        </div>
      </article>

      <article className="panel self-start p-4">
        {cardTitle("Low Stock Heat", "Products with the most urgent stock levels")}
        <div className={fixedChartClass}>
          {inventoryPreview.length > 0 ? (
            <Bar
              data={{
                labels: inventoryPreview.map((entry) => entry.name),
                datasets: [
                  {
                    label: "Stock Left",
                    data: inventoryPreview.map((entry) => entry.currentStock),
                    backgroundColor: inventoryPreview.map((entry) =>
                      Number(entry.currentStock) <= 5 ? "#dc2626" : "#14b8a6"
                    ),
                    borderRadius: 8
                  }
                ]
              }}
              options={{
                indexAxis: "y",
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                  x: {
                    grid: { color: "rgba(148,163,184,0.22)" }
                  },
                  y: {
                    grid: { display: false }
                  }
                }
              }}
            />
          ) : (
            emptyChartState("No inventory data yet.")
          )}
        </div>
      </article>
    </section>
  );
}

export default OverviewCharts;
