// Distinguishes "still loading" / "failed to load" from "genuinely empty" —
// without this, a panel whose initial admin-snapshot fetch is slow or has
// failed outright renders with empty arrays from the Redux initial state,
// which looks identical to a real, empty list.
function SnapshotStatusBanner({ status }) {
  if (status === "loading" || status === "idle") {
    return (
      <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2.5 text-xs font-medium text-slate-600">
        Loading data...
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-semibold text-red-700">
        Failed to load data. Try refreshing from the top bar.
      </div>
    );
  }

  return null;
}

export default SnapshotStatusBanner;
