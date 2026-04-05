import { useState } from "react";
import LockOpenRoundedIcon from "@mui/icons-material/LockOpenRounded";
import VisibilityRoundedIcon from "@mui/icons-material/VisibilityRounded";
import VisibilityOffRoundedIcon from "@mui/icons-material/VisibilityOffRounded";

function LoginView({ onSubmit, status, error, apiBaseUrl }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const isLoading = status === "loading";

  function handleChange(event) {
    const { name, value } = event.target;

    setCredentials((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(credentials);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-4 py-10">
      <section className="panel grid w-full overflow-hidden md:grid-cols-[1.1fr_1fr]">
        <div className="hidden bg-gradient-to-br from-teal-700 via-teal-600 to-cyan-500 p-8 text-white md:block pt-2                    0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-100">
            Ashpero
          </p>
          <h1 className="mt-4 text-3xl font-bold leading-tight">
            Command your store with one analytics-first dashboard
          </h1>
          <p className="mt-4 text-sm leading-6 text-cyan-50">
            Track operations, edit resources, and monitor growth momentum from a
            single workspace.
          </p>
        </div>

        <form className="p-6 sm:p-8" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-slate-900">Admin Sign In</h2>
          <p className="mt-1 text-sm text-slate-600">
            Use your admin email and password.
          </p>

          <div className="mt-5 space-y-4">
            <label className="block text-sm font-semibold text-slate-800">
              Email
              <input
                type="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-teal-400 transition focus:ring"
              />
            </label>

            <label className="block text-sm font-semibold text-slate-800">
              Password
              <div className="relative mt-1.5">
                <input
                  type={isPasswordVisible ? "text" : "password"}
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 pr-10 text-sm outline-none ring-teal-400 transition focus:ring"
                />
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible((previous) => !previous)}
                  className="absolute inset-y-0 right-0 inline-flex items-center px-3 text-slate-500 transition hover:text-slate-700"
                  aria-label={isPasswordVisible ? "Hide password" : "Show password"}
                >
                  {isPasswordVisible ? (
                    <VisibilityOffRoundedIcon sx={{ fontSize: 18 }} />
                  ) : (
                    <VisibilityRoundedIcon sx={{ fontSize: 18 }} />
                  )}
                </button>
              </div>
            </label>
          </div>

          {error ? (
            <p className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isLoading}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <LockOpenRoundedIcon sx={{ fontSize: 18 }} />
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default LoginView;
