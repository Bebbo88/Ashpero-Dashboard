import { DataGrid } from "@mui/x-data-grid";
import OverviewCharts from "../../charts/OverviewCharts";
import { recentOrdersColumns } from "./columns";
import { buildOverviewViewModel } from "./helpers";

function OverviewPanel({ dashboard, orders, inventory }) {
  const { firstRowCards, executiveCards, recentOrders } = buildOverviewViewModel({
    dashboard,
    orders,
    inventory
  });

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
            columns={recentOrdersColumns}
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
