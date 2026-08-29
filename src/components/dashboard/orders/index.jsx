import { useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterListRoundedIcon from "@mui/icons-material/FilterListRounded";
import { useAppDispatch } from "../../../app/hooks";
import {
  updateOrderPaymentStatus,
  updateOrderStatus,
  updateOrderDetails,
} from "../../../features/admin/adminSlice";
import { getOrdersColumns } from "./columns";
import { mapOrderRows, ORDER_STATUSES, PAYMENT_STATUSES } from "./helpers";
import OrderDetailsDrawer from "./OrderDetailsDrawer";

const TABS = [
  { key: "all", label: "All Orders" },
  { key: "new", label: "New" },
  { key: "processing", label: "Processing" },
  { key: "shipped", label: "Shipped" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

function OrdersPanel({
  orders,
  mutationStatus,
  selectedOrder,
  orderDetailsStatus,
  onRequestOrderDetails,
  onCloseOrderDetails,
}) {
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [draftStatus, setDraftStatus] = useState({});
  const [draftPaymentStatus, setDraftPaymentStatus] = useState({});
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  const rawRows = useMemo(() => mapOrderRows(orders), [orders]);

  // Compute active order for drawer from orders array (instant fresh state) merged with populated details
  const drawerOrder = useMemo(() => {
    if (!selectedOrderId) return null;

    const fromList = orders.find(
      (o) => String(o._id || o.id) === String(selectedOrderId)
    );

    if (
      selectedOrder &&
      String(selectedOrder._id || selectedOrder.id) === String(selectedOrderId)
    ) {
      return {
        ...selectedOrder,
        orderStatus: fromList?.orderStatus || selectedOrder.orderStatus,
        paymentStatus: fromList?.paymentStatus || selectedOrder.paymentStatus,
        trackingNumber: fromList?.trackingNumber ?? selectedOrder.trackingNumber,
        shippingCompany: fromList?.shippingCompany ?? selectedOrder.shippingCompany,
        adminNote: fromList?.adminNote ?? selectedOrder.adminNote,
      };
    }

    return fromList || selectedOrder;
  }, [selectedOrderId, orders, selectedOrder]);

  // Compute status counts for tabs
  const tabCounts = useMemo(() => {
    const counts = { all: rawRows.length, new: 0, processing: 0, shipped: 0, delivered: 0, cancelled: 0 };
    for (const row of rawRows) {
      if (counts[row.orderStatus] !== undefined) {
        counts[row.orderStatus] += 1;
      }
    }
    return counts;
  }, [rawRows]);

  // Filter rows by tab & search query
  const filteredRows = useMemo(() => {
    return rawRows.filter((row) => {
      // 1. Tab filter
      if (activeTab !== "all" && row.orderStatus !== activeTab) {
        return false;
      }

      // 2. Search filter
      if (searchTerm.trim()) {
        const query = searchTerm.trim().toLowerCase();
        const matchesRef = String(row.merchantOrderId || "").toLowerCase().includes(query);
        const matchesName = String(row.customerName || "").toLowerCase().includes(query);
        const matchesPhone = String(row.phone || "").toLowerCase().includes(query);
        const matchesSecPhone = String(row.secondaryPhone || "").toLowerCase().includes(query);
        const matchesGov = String(row.governorate || "").toLowerCase().includes(query);
        const matchesCity = String(row.city || "").toLowerCase().includes(query);
        const matchesTracking = String(row.trackingNumber || "").toLowerCase().includes(query);

        return matchesRef || matchesName || matchesPhone || matchesSecPhone || matchesGov || matchesCity || matchesTracking;
      }

      return true;
    });
  }, [rawRows, activeTab, searchTerm]);

  function handleOpenOrder(orderId) {
    setSelectedOrderId(orderId);
    onRequestOrderDetails(orderId);
    setIsDrawerOpen(true);
  }

  function handleCloseDrawer() {
    setIsDrawerOpen(false);
    setSelectedOrderId(null);
    onCloseOrderDetails();
  }

  async function handleSaveDetails(orderId, payload) {
    try {
      await dispatch(
        updateOrderDetails({
          orderId,
          payload,
        })
      ).unwrap();
    } catch (_error) {
      // handled in slice
    }
  }

  const columns = useMemo(
    () =>
      getOrdersColumns({
        statuses: ORDER_STATUSES,
        paymentStatuses: PAYMENT_STATUSES,
        mutationStatus,
        resolveStatus,
        resolvePaymentStatus,
        onStatusChange: handleStatusChange,
        onStatusSave: handleStatusSave,
        onPaymentStatusChange: handlePaymentStatusChange,
        onPaymentStatusSave: handlePaymentStatusSave,
        onRequestOrderDetails: handleOpenOrder,
      }),
    [mutationStatus, draftStatus, draftPaymentStatus]
  );

  function resolveStatus(row) {
    return draftStatus[row.id] || row.orderStatus;
  }

  function resolvePaymentStatus(row) {
    return draftPaymentStatus[row.id] || row.paymentStatus;
  }

  function handleStatusChange(id, value) {
    setDraftStatus((previous) => ({
      ...previous,
      [id]: value,
    }));
  }

  function handlePaymentStatusChange(id, value) {
    setDraftPaymentStatus((previous) => ({
      ...previous,
      [id]: value,
    }));
  }

  async function handleStatusSave(id, currentStatus) {
    const nextStatus = draftStatus[id] || currentStatus;

    if (nextStatus === currentStatus) {
      return;
    }

    try {
      await dispatch(
        updateOrderStatus({
          orderId: id,
          orderStatus: nextStatus,
        })
      ).unwrap();

      setDraftStatus((previous) => {
        const nextDraft = { ...previous };
        delete nextDraft[id];
        return nextDraft;
      });
    } catch (_error) {
      // handled in slice
    }
  }

  async function handlePaymentStatusSave(id, currentStatus) {
    const nextStatus = draftPaymentStatus[id] || currentStatus;

    if (nextStatus === currentStatus) {
      return;
    }

    try {
      await dispatch(
        updateOrderPaymentStatus({
          orderId: id,
          paymentStatus: nextStatus,
        })
      ).unwrap();

      setDraftPaymentStatus((previous) => {
        const nextDraft = { ...previous };
        delete nextDraft[id];
        return nextDraft;
      });
    } catch (_error) {
      // handled in slice
    }
  }

  return (
    <section className="space-y-4">
      {/* Quick Status Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-3">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          const count = tabCounts[tab.key] || 0;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition ${
                isActive
                  ? "bg-slate-900 text-white shadow-md shadow-slate-900/15"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`rounded-full px-1.5 py-0.5 text-[10px] font-mono ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Table Card */}
      <article className="panel p-4">
        {/* Card Header & Search */}
        <div className="mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Orders Operations & Fulfillment
            </h3>
            <p className="text-xs text-slate-600">
              Showing {filteredRows.length} of {rawRows.length} total orders.
            </p>
          </div>

          <div className="relative min-w-[280px]">
            <SearchRoundedIcon
              fontSize="small"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />
            <input
              type="text"
              placeholder="Search by customer, phone, or ASHP-XXXX..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder:text-slate-600 focus:border-brand-mint focus:bg-white focus:outline-none transition shadow-sm"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600 hover:text-slate-700"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* DataGrid */}
        <div className="h-[620px] w-full">
          <DataGrid
            rows={filteredRows}
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 25,
                  page: 0,
                },
              },
            }}
            disableRowSelectionOnClick
            sx={{
              border: 0,
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                borderBottomColor: "#e2e8f0",
                fontSize: "12px",
                fontWeight: "bold",
                color: "#1e293b",
              },
              "& .MuiDataGrid-cell": {
                borderBottomColor: "#f1f5f9",
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: "#f8fafc",
              },
            }}
          />
        </div>
      </article>

      {/* Slide-over Drawer */}
      <OrderDetailsDrawer
        order={drawerOrder}
        isOpen={isDrawerOpen && Boolean(drawerOrder)}
        onClose={handleCloseDrawer}
        onSaveDetails={handleSaveDetails}
        mutationStatus={mutationStatus}
      />
    </section>
  );
}

export default OrdersPanel;
