import { NavLink } from "react-router-dom";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import LocalOfferRoundedIcon from "@mui/icons-material/LocalOfferRounded";
import ConfirmationNumberRoundedIcon from "@mui/icons-material/ConfirmationNumberRounded";
import LightbulbRoundedIcon from "@mui/icons-material/LightbulbRounded";
import ArticleRoundedIcon from "@mui/icons-material/ArticleRounded";
import SellRoundedIcon from "@mui/icons-material/SellRounded";
import VideoLibraryRoundedIcon from "@mui/icons-material/VideoLibraryRounded";
import RateReviewRoundedIcon from "@mui/icons-material/RateReviewRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";

const ICONS = {
  overview: DashboardRoundedIcon,
  orders: ReceiptLongRoundedIcon,
  products: Inventory2RoundedIcon,
  shipping: LocalShippingRoundedIcon,
  textReviews: RateReviewRoundedIcon,
  videoReviews: VideoLibraryRoundedIcon,
  offers: LocalOfferRoundedIcon,
  coupons: ConfirmationNumberRoundedIcon,
  tips: LightbulbRoundedIcon,
  content: ArticleRoundedIcon,
};

export const DASHBOARD_SECTIONS = [
  { key: "overview", label: "Overview", path: "/dashboard/overview", roles: ["super_admin"] },
  { key: "orders", label: "Orders", path: "/dashboard/orders", roles: ["super_admin", "order_manager"] },
  { key: "products", label: "Products", path: "/dashboard/products", roles: ["super_admin"] },
  { key: "shipping", label: "Shipping Settings", path: "/dashboard/shipping", roles: ["super_admin"] },
  { key: "textReviews", label: "Text Reviews", path: "/dashboard/text-reviews", roles: ["super_admin"] },
  { key: "videoReviews", label: "Customer Video Reviews", path: "/dashboard/video-reviews", roles: ["super_admin"] },
  { key: "offers", label: "Offers", path: "/dashboard/offers", roles: ["super_admin"] },
  { key: "coupons", label: "Coupons", path: "/dashboard/coupons", roles: ["super_admin"] },
  { key: "tips", label: "Tips", path: "/dashboard/tips", roles: ["super_admin"] },
  { key: "content", label: "Site Content", path: "/dashboard/content", roles: ["super_admin"] },
];

function SidebarContent({ admin, onNavigate }) {
  // Fail closed: an unrecognized/missing role should see the *least*
  // privileged view, never silently default to full super_admin access.
  const role = admin?.role || "order_manager";
  const isOrderManager = role === "order_manager";

  const visibleSections = DASHBOARD_SECTIONS.filter((section) =>
    section.roles.includes(role)
  );

  return (
    <>
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-teal-100 bg-teal-50 px-3 py-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal-700 text-white">
          <SellRoundedIcon fontSize="small" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
            Ashperoo
          </p>
          <h1 className="text-base font-bold text-slate-900">
            {isOrderManager ? "Orders Manager" : "Admin Control"}
          </h1>
        </div>
      </div>

      <nav className="space-y-2">
        {visibleSections.map((section) => {
          const Icon = ICONS[section.key];

          return (
            <NavLink
              key={section.key}
              to={section.path}
              onClick={onNavigate}
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

      {!isOrderManager && (
        <div className="mt-6 rounded-xl border border-orange-200 bg-orange-50 p-3 text-xs text-orange-900">
          <p className="font-semibold">Analytics Guidance</p>
          <p className="mt-1 leading-relaxed">
            Focus on delivery rate, low-stock risk, and promotion ROI to keep
            operations and growth in balance.
          </p>
        </div>
      )}
    </>
  );
}

function Sidebar({ admin, isMobileOpen, onMobileClose }) {
  return (
    <>
      {/* Desktop: always-visible sticky sidebar */}
      <aside className="panel hidden p-4 md:block md:w-72 md:min-h-[calc(100vh-3rem)] md:sticky md:top-6">
        <SidebarContent admin={admin} />
      </aside>

      {/* Mobile: slide-in drawer, only rendered while open */}
      {isMobileOpen ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onMobileClose}
          />
          <div className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] overflow-y-auto bg-white p-4 shadow-2xl">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={onMobileClose}
                aria-label="Close navigation menu"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
              >
                <CloseRoundedIcon fontSize="small" />
              </button>
            </div>
            <SidebarContent admin={admin} onNavigate={onMobileClose} />
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Sidebar;
