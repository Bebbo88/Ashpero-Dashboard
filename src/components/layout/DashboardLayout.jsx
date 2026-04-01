import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

function DashboardLayout({
  admin,
  lastUpdatedAt,
  snapshotStatus,
  mutationStatus,
  lastMessage,
  error,
  onRefresh,
  onLogout,
  onDismissError
}) {
  return (
    <main className="mx-auto w-full max-w-[1650px] px-3 py-4 md:px-6 md:py-6">
      <div className="grid gap-4 md:grid-cols-[18rem_1fr] md:items-start">
        <Sidebar />

        <section className="min-w-0">
          <TopBar
            admin={admin}
            onRefresh={onRefresh}
            onLogout={onLogout}
            lastMessage={lastMessage}
            snapshotStatus={snapshotStatus}
            mutationStatus={mutationStatus}
            lastUpdatedAt={lastUpdatedAt}
          />

          {error ? (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <div className="flex items-start justify-between gap-3">
                <span>{error}</span>
                <button
                  type="button"
                  className="text-xs font-semibold text-red-700 underline"
                  onClick={onDismissError}
                >
                  dismiss
                </button>
              </div>
            </div>
          ) : null}

          <Outlet />
        </section>
      </div>
    </main>
  );
}

export default DashboardLayout;
