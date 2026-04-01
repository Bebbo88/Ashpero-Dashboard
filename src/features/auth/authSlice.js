import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiRequest } from "../../utils/apiClient";

const TOKEN_KEY = "ashpero_admin_token";
const REFRESH_TOKEN_KEY = "ashpero_admin_refresh_token";
const ADMIN_KEY = "ashpero_admin_profile";

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
  async (providedRefreshToken, { getState, rejectWithValue }) => {
    try {
      const fallbackRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY) || "";
      const refreshToken = String(
        providedRefreshToken || getState().auth.refreshToken || fallbackRefreshToken
      ).trim();

      if (!refreshToken) {
        throw new Error("Refresh token is required");
      }

      const payload = await apiRequest("/admin/refresh", {
        method: "POST",
        body: { refreshToken },
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
  refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) || "",
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
      state.refreshToken = "";
      state.admin = null;
      state.status = "idle";
      state.error = "";
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      localStorage.removeItem(ADMIN_KEY);
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
        state.refreshToken = action.payload.refreshToken;
        state.admin = action.payload.admin;
        state.error = "";

        localStorage.setItem(TOKEN_KEY, action.payload.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken || "");
        localStorage.setItem(ADMIN_KEY, JSON.stringify(action.payload.admin));
      })
      .addCase(loginAdmin.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to login";
      })
      .addCase(refreshAdminToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.admin = action.payload.admin || state.admin;

        localStorage.setItem(TOKEN_KEY, action.payload.token);
        localStorage.setItem(REFRESH_TOKEN_KEY, action.payload.refreshToken || "");

        if (action.payload.admin) {
          localStorage.setItem(ADMIN_KEY, JSON.stringify(action.payload.admin));
        }
      });
  }
});

export const { logoutAdmin, clearAuthError } = authSlice.actions;

export default authSlice.reducer;
