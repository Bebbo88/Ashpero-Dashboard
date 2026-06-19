import { NavLink } from "react-router-dom";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";

const ICONS = {
  overview: DashboardRoundedIcon,
  orders: ReceiptLongRoundedIcon,
  products: Inventory2RoundedIcon,
  offers: LocalOfferRoundedIcon,
  coupons: ConfirmationNumberRoundedIcon,
  tips: LightbulbRoundedIcon,
  content: ArticleRoundedIcon,
};

export const DASHBOARD_SECTIONS = [
  { key: "overview", label: "Overview", path: "/dashboard/overview" },
  { key: "orders", label: "Orders", path: "/dashboard/orders" },
  { key: "products", label: "Products", path: "/dashboard/products" },
  { key: "offers", label: "Offers", path: "/dashboard/offers" },
  { key: "coupons", label: "Coupons", path: "/dashboard/coupons" },
  { key: "tips", label: "Tips", path: "/dashboard/tips" },
  { key: "content", label: "Site Content", path: "/dashboard/content" },
];

function Sidebar() {
  return (
    <aside className="panel w-full p-4 md:w-72 md:min-h-[calc(100vh-3rem)] md:sticky md:top-6">
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50 px-3 py-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
          <SellRoundedIcon fontSize="small" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
            Ashperoo
          </p>
          <h1 className="text-base font-bold text-slate-900">
            Admin Control Center
          </h1>
        </div>
      </div>

      <nav className="space-y-2">
        {DASHBOARD_SECTIONS.map((section) => {
          const Icon = ICONS[section.key];

          return (
            <NavLink
              key={section.key}
              to={section.path}
              className={({ isActive }) =>
                `block w-full rounded-xl px-3 py-2 text-left transition ${
                  isActive
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/20"
                    : "bg-white text-slate-700 hover:bg-slate-100"
                }`
              }
            >
              <span className="flex items-center gap-2.5 text-sm font-semibold">
                <Icon fontSize="small" />
                {section.label}
              </span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs text-orange-900">
        <p className="font-semibold">Analytics Guidance</p>
        <p className="mt-1 leading-relaxed">
          Focus on delivery rate, low-stock risk, and promotion ROI to keep
          operations and growth in balance.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;
