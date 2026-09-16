import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ADMIN_KEY, TOKEN_KEY, apiRequest } from "../../utils/apiClient";

function readAdminProfile() {
  try {
    const raw = localStorage.getItem(ADMIN_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch (_error) {
    return null;
  }
}

function extractErrorMessage(error) {
  if (!error) {
    return "Something went wrong";
  }

  if (typeof error === "string") {
    return error;
  }

  if (error.message) {
    return error.message;
  }

  return "Something went wrong";
}

export const loginAdmin = createAsyncThunk(
  "auth/loginAdmin",
  async (credentials, { rejectWithValue }) => {
    try {
      const payload = await apiRequest("/admin/login", {
        method: "POST",
        body: credentials,
        language: "en"
      });

      return payload.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

export const refreshAdminToken = createAsyncThunk(
  "auth/refreshAdminToken",
  async (_arg, { rejectWithValue }) => {
    try {
      const payload = await apiRequest("/admin/refresh", {
        method: "POST",
        language: "en"
      });

      return payload.data;
    } catch (error) {
      return rejectWithValue(extractErrorMessage(error));
    }
  }
);

const initialState = {
  token: localStorage.getItem(TOKEN_KEY) || "",
  admin: readAdminProfile(),
  status: "idle",
  error: ""
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logoutAdmin(state) {
      state.token = "";
      state.admin = null;
      state.status = "idle";
      state.error = "";
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ADMIN_KEY);
      localStorage.removeItem("ashpero_admin_refresh_token");

      // Notify backend to clear HttpOnly cookie and revoke session
      apiRequest("/admin/logout", { method: "POST" }).catch(() => {});
    },
    clearAuthError(state) {
      state.error = "";
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAdmin.pending, (state) => {
        state.status = "loading";
        state.error = "";
      })
      .addCase(loginAdmin.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.admin = action.payload.admin;
        state.error = "";

        localStorage.setItem(TOKEN_KEY, action.payload.token);
        localStorage.setItem(ADMIN_KEY, JSON.stringify(action.payload.admin));
        localStorage.removeItem("ashpero_admin_refresh_token");
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to login";
      })
      .addCase(refreshAdminToken.pending, (state) => {
        state.status = "loading";
      })
      .addCase(refreshAdminToken.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.admin = action.payload.admin || state.admin;

        localStorage.setItem(TOKEN_KEY, action.payload.token);
        if (action.payload.admin) {
          localStorage.setItem(ADMIN_KEY, JSON.stringify(action.payload.admin));
        }
      })
      .addCase(refreshAdminToken.rejected, (state) => {
        // No error is surfaced here on purpose — this refresh runs silently
        // on app load, and failing just means there's no existing session
        // (the common case for a fresh visit), which correctly falls back to
        // showing the login screen rather than an error banner.
        //
        // Status must NOT go back to "idle" here: App.jsx retries this silent
        // refresh whenever status is "idle" and there's no token, so setting
        // "idle" on every rejection re-triggers the same refresh forever —
        // an infinite request loop. "unauthenticated" is a distinct terminal
        // state that satisfies neither that retry condition nor the
        // "loading" check the login button uses.
        state.status = "unauthenticated";
      });
  }
});

export const { logoutAdmin, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
