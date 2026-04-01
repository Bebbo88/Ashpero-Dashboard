import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

function TopBar({
  onRefresh,
  onLogout,
  lastMessage,
  snapshotStatus,
  mutationStatus,
  lastUpdatedAt,
}) {
  const isRefreshing = snapshotStatus === "loading";
  const isMutating = mutationStatus === "loading";

  return (
    <header className="panel mb-4 flex flex-col gap-3 px-4 py-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Welcome, Ashpero</h2>
        <p className="text-sm text-slate-600">
          Last sync:{" "}
          {lastUpdatedAt
            ? new Date(lastUpdatedAt).toLocaleString()
            : "Not yet synced"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {lastMessage ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
            <CheckCircleRoundedIcon sx={{ fontSize: 15 }} />
            {lastMessage}
          </span>
        ) : null}
        <button
          type="button"
          onClick={onRefresh}
          disabled={isRefreshing || isMutating}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshRoundedIcon sx={{ fontSize: 18 }} />
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </button>
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          <LogoutRoundedIcon sx={{ fontSize: 18 }} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default TopBar;
