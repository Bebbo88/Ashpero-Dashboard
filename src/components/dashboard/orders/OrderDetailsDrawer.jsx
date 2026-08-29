import { useState, useEffect } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import PrintRoundedIcon from "@mui/icons-material/PrintRounded";
import ContentCopyRoundedIcon from "@mui/icons-material/ContentCopyRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import { formatCurrency, formatDateTime } from "../../../utils/formatters";
import { ORDER_STATUSES, PAYMENT_STATUSES, ORDER_STATUS_CONFIG, PAYMENT_STATUS_CONFIG } from "./helpers";

function OrderDetailsDrawer({
  order,
  isOpen,
  onClose,
  onSaveDetails,
  mutationStatus
}) {
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Form states
  const [orderStatus, setOrderStatus] = useState("new");
  const [paymentStatus, setPaymentStatus] = useState("pending");
  const [shippingCompany, setShippingCompany] = useState("");
  const [trackingNumber, setTrackingNumber] = useState("");
  const [adminNote, setAdminNote] = useState("");

  useEffect(() => {
    if (order) {
      setOrderStatus(order.orderStatus || "new");
      setPaymentStatus(order.paymentStatus || "pending");
      setShippingCompany(order.shippingCompany || "");
      setTrackingNumber(order.trackingNumber || "");
      setAdminNote(order.adminNote || "");
    }
  }, [
    order?._id,
    order?.id,
    order?.orderStatus,
    order?.paymentStatus,
    order?.trackingNumber,
    order?.shippingCompany,
    order?.adminNote
  ]);

  if (!isOpen || !order) {
    return null;
  }

  const shipping = order.shippingAddress || {};
  const fullAddress = order.address || shipping.fullAddress || [
    shipping.street,
    shipping.area,
    shipping.city,
    shipping.governorate
  ].filter(Boolean).join(", ");

  function handleCopy(text, type) {
    navigator.clipboard.writeText(text);
    if (type === "phone") {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    } else {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    }
  }

  function handleSave() {
    onSaveDetails(order._id || order.id, {
      orderStatus,
      paymentStatus,
      shippingCompany,
      trackingNumber,
      adminNote
    });
  }

  function handlePrintInvoice() {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const itemsHtml = (order.items || [])
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">
            <strong>${item.productName || item.productId?.name_en || item.productId?.name || "Product"}</strong>
            ${item.selectedSize ? `<br><small style="color: #64748b;">Size: ${item.selectedSize}</small>` : ""}
          </td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatCurrency(item.unitPrice || item.priceAtPurchase)}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold;">
            ${formatCurrency((item.priceAtPurchase || item.unitPrice || 0) * (item.quantity || 1))}
          </td>
        </tr>`
      )
      .join("");

    const invoiceContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.merchantOrderId || order._id}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #0f172a; margin: 0; padding: 24px; font-size: 13px; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 20px; }
          .logo { font-size: 24px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; color: #0f172a; }
          .meta { text-align: right; }
          .section { margin-bottom: 20px; }
          .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: bold; color: #64748b; margin-bottom: 6px; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th { background: #f8fafc; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; border-bottom: 1px solid #cbd5e1; }
          .totals { margin-top: 20px; width: 280px; margin-left: auto; }
          .totals-row { display: flex; justify-content: space-between; padding: 6px 0; }
          .totals-row.grand { font-size: 16px; font-weight: bold; border-top: 2px solid #0f172a; margin-top: 6px; padding-top: 10px; }
          @media print {
            body { padding: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">ASHPERO</div>
            <p style="margin: 4px 0 0; color: #64748b;">Premium Skincare Solutions</p>
          </div>
          <div class="meta">
            <h2 style="margin: 0; font-size: 18px;">INVOICE / PACKING SLIP</h2>
            <p style="margin: 4px 0; font-family: monospace; font-weight: bold;">${order.merchantOrderId || order._id}</p>
            <p style="margin: 0; color: #64748b;">${new Date(order.createdAt).toLocaleDateString("en-EG", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
          </div>
        </div>

        <div class="info-grid section">
          <div>
            <div class="section-title">Customer & Delivery Details</div>
            <p style="margin: 0; font-weight: bold; font-size: 14px;">${order.customerName}</p>
            <p style="margin: 4px 0; font-family: monospace; font-size: 13px;">📞 ${order.phone} ${order.secondaryPhone ? ` / ${order.secondaryPhone}` : ""}</p>
            <p style="margin: 4px 0; line-height: 1.4;">📍 ${fullAddress}</p>
            ${shipping.governorate ? `<p style="margin: 2px 0; color: #475569;">Governorate: ${shipping.governorate}</p>` : ""}
          </div>
          <div style="text-align: right;">
            <div class="section-title">Payment & Shipping Info</div>
            <p style="margin: 0;">Payment Method: <strong>${(order.paymentMethod || "COD").toUpperCase()}</strong></p>
            <p style="margin: 4px 0;">Payment Status: <strong>${(order.paymentStatus || "pending").toUpperCase()}</strong></p>
            ${order.trackingNumber ? `<p style="margin: 4px 0;">Tracking No: <strong>${order.trackingNumber}</strong></p>` : ""}
            ${order.shippingCompany ? `<p style="margin: 4px 0;">Courier: <strong>${order.shippingCompany}</strong></p>` : ""}
            ${order.orderNote ? `<p style="margin: 8px 0; font-style: italic; color: #b45309; background: #fef3c7; padding: 6px; border-radius: 4px; text-align: left;">Note: ${order.orderNote}</p>` : ""}
          </div>
        </div>

        <div class="section">
          <div class="section-title">Order Items</div>
          <table>
            <thead>
              <tr>
                <th>Product Description</th>
                <th style="text-align: center;">Qty</th>
                <th style="text-align: right;">Unit Price</th>
                <th style="text-align: right;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
        </div>

        <div class="totals">
          <div class="totals-row">
            <span>Subtotal:</span>
            <span>${formatCurrency(order.totalPrice || 0)}</span>
          </div>
          <div class="totals-row">
            <span>Shipping:</span>
            <span>${order.shippingFee ? formatCurrency(order.shippingFee) : "Free"}</span>
          </div>
          <div class="totals-row grand">
            <span>Final Amount:</span>
            <span>${formatCurrency(order.finalPrice || order.totalPrice)}</span>
          </div>
        </div>

        <div style="margin-top: 40px; text-align: center; color: #94a3b8; font-size: 11px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          Thank you for choosing Ashpero. For customer support, contact support@ashpero.com
        </div>

        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
  }

  const orderBadge = ORDER_STATUS_CONFIG[orderStatus] || ORDER_STATUS_CONFIG.new;
  const paymentBadge = PAYMENT_STATUS_CONFIG[paymentStatus] || PAYMENT_STATUS_CONFIG.pending;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-sm transition-opacity">
      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div className="w-screen max-w-2xl bg-white shadow-2xl flex flex-col">
          
          {/* Top Bar */}
          <div className="border-b border-slate-200 px-6 py-4 flex items-center justify-between bg-slate-50">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900 font-mono">
                  {order.merchantOrderId || order._id}
                </h2>
                <span className={`rounded-full border px-2.5 py-0.5 text-xs font-bold ${orderBadge.badgeClass}`}>
                  {orderBadge.label}
                </span>
                <span className={`rounded-full border px-2 py-0.5 text-xs font-bold ${paymentBadge.badgeClass}`}>
                  {paymentBadge.label}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Placed on {formatDateTime(order.createdAt)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrintInvoice}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                <PrintRoundedIcon fontSize="small" />
                Print Invoice
              </button>

              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-1.5 text-slate-600 hover:bg-slate-200 hover:text-slate-700 transition"
              >
                <CloseRoundedIcon fontSize="small" />
              </button>
            </div>
          </div>

          {/* Drawer Body Scrollable */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Customer Details */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Customer & Delivery Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate-600">Full Name</p>
                  <p className="text-sm font-semibold text-slate-900">{order.customerName}</p>

                  <div className="mt-2 flex items-center gap-2">
                    <p className="text-sm font-mono text-slate-800">{order.phone}</p>
                    <button
                      type="button"
                      onClick={() => handleCopy(order.phone, "phone")}
                      className="text-slate-600 hover:text-slate-700 transition"
                      title="Copy phone"
                    >
                      {copiedPhone ? <CheckRoundedIcon fontSize="inherit" className="text-emerald-600" /> : <ContentCopyRoundedIcon fontSize="inherit" />}
                    </button>
                  </div>

                  {order.secondaryPhone && (
                    <p className="text-xs font-mono text-slate-600 mt-0.5">
                      Secondary: {order.secondaryPhone}
                    </p>
                  )}

                  {order.email && (
                    <p className="text-xs text-slate-600 mt-1">{order.email}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-slate-600">Delivery Address</p>
                    <button
                      type="button"
                      onClick={() => handleCopy(fullAddress, "address")}
                      className="text-xs text-brand-mint font-semibold hover:underline inline-flex items-center gap-1"
                    >
                      {copiedAddress ? "Copied!" : "Copy Address"}
                    </button>
                  </div>
                  <p className="text-sm text-slate-800 mt-1 leading-relaxed">{fullAddress}</p>
                  {shipping.governorate && (
                    <span className="inline-block mt-2 rounded bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                      Governorate: {shipping.governorate}
                    </span>
                  )}
                </div>
              </div>

              {order.orderNote && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
                  <span className="font-bold">Customer Note: </span>
                  {order.orderNote}
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                Items ({order.items?.length || 0})
              </h3>

              <div className="divide-y divide-slate-100">
                {(order.items || []).map((item, index) => (
                  <div key={index} className="py-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {item.productId?.images?.[0] ? (
                          <img
                            src={item.productId.images[0]}
                            alt={item.productName || "Product"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="text-xs font-bold text-slate-600">ASHP</span>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.productName || item.productId?.name_en || item.productId?.name || "Product"}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          {item.selectedSize && (
                            <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-600">
                              Size: {item.selectedSize}
                            </span>
                          )}
                          <span className="text-xs text-slate-600">
                            {formatCurrency(item.unitPrice || item.priceAtPurchase)} × {item.quantity}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900">
                        {formatCurrency((item.priceAtPurchase || item.unitPrice || 0) * (item.quantity || 1))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Breakdown */}
              <div className="mt-4 border-t border-slate-200 pt-3 space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(order.totalPrice || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee:</span>
                  <span className="font-semibold text-slate-900">
                    {order.shippingFee ? formatCurrency(order.shippingFee) : "Free"}
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                  <span>Final Total:</span>
                  <span className="text-base text-teal-700">{formatCurrency(order.finalPrice || order.totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Management & Status Control */}
            <div className="rounded-xl border border-teal-200 bg-teal-50/40 p-4 shadow-sm space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-teal-900 flex items-center gap-1.5">
                <LocalShippingRoundedIcon fontSize="small" />
                Order Management & Fulfillment
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Order Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none"
                  >
                    {ORDER_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  {orderStatus === "cancelled" && (
                    <p className="mt-1 text-[11px] text-rose-600 font-semibold">
                      ⚠️ Cancelling this order will automatically restore stock to inventory.
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none"
                  >
                    {PAYMENT_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.toUpperCase()}
                      </option>
                    ))}
                  </select>
                  <p className="mt-1 text-[10px] text-slate-600">
                    Method: <strong className="uppercase">{order.paymentMethod || "COD"}</strong>
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Shipping Company / Courier
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bosta, Mylerz, Internal Courier"
                    value={shippingCompany}
                    onChange={(e) => setShippingCompany(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tracking Number / Waybill
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. BSTA-98234112"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-mono text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Internal Staff Notes (Private)
                </label>
                <textarea
                  rows={2}
                  placeholder="Add notes for operations, delivery follow-up, or customer agreements..."
                  value={adminNote}
                  onChange={(e) => setAdminNote(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white p-2.5 text-xs text-slate-900 shadow-sm focus:border-teal-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={mutationStatus === "loading"}
                  className="rounded-lg bg-teal-700 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-teal-800 disabled:opacity-60 transition"
                >
                  {mutationStatus === "loading" ? "Saving..." : "Save Order Changes"}
                </button>
              </div>
            </div>

            {/* Audit History / Timeline */}
            {order.statusHistory && order.statusHistory.length > 0 && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">
                  Status History & Audit Log
                </h4>
                <div className="space-y-2">
                  {order.statusHistory.slice().reverse().map((entry, idx) => (
                    <div key={idx} className="text-xs border-l-2 border-slate-300 pl-3 py-0.5">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-semibold text-slate-800">{entry.note || entry.orderStatus}</span>
                        <span>{formatDateTime(entry.changedAt)}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">
                        By: {entry.changedBy || "admin"}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetailsDrawer;
