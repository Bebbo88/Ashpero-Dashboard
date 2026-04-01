const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:5000").replace(/\/$/, "");
const TOKEN_KEY = "ashpero_admin_token";
const REFRESH_TOKEN_KEY = "ashpero_admin_refresh_token";
const ADMIN_KEY = "ashpero_admin_profile";

function extractPayloadMessage(payload) {
  if (!payload || typeof payload !== "object") {
    return "Request failed";
  }

  if (payload.errorLocalized && typeof payload.errorLocalized.en === "string") {
    return payload.errorLocalized.en;
  }

  if (typeof payload.error === "string") {
    return payload.error;
  }

  if (payload.messageLocalized && typeof payload.messageLocalized.en === "string") {
    return payload.messageLocalized.en;
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  return "Request failed";
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch (_error) {
    return { message: text };
  }
}

function getStoredToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) || "";
  } catch (_error) {
    return "";
  }
}

function getStoredRefreshToken() {
  try {
    return localStorage.getItem(REFRESH_TOKEN_KEY) || "";
  } catch (_error) {
    return "";
  }
}

function storeAuthPayload(payload = {}) {
  if (!payload || typeof payload !== "object") {
    return;
  }

  if (payload.token) {
    localStorage.setItem(TOKEN_KEY, payload.token);
  }

  if (payload.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, payload.refreshToken);
  }

  if (payload.admin) {
    localStorage.setItem(ADMIN_KEY, JSON.stringify(payload.admin));
  }
}

function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);

  window.dispatchEvent(new CustomEvent("ashpero:auth-expired"));
}

async function refreshAccessToken(language = "en") {
  const refreshToken = getStoredRefreshToken();

  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }

  const response = await fetch(`${API_BASE_URL}/admin/refresh`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-lang": language
    },
    body: JSON.stringify({ refreshToken })
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(extractPayloadMessage(payload));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  storeAuthPayload(payload.data || {});

  return payload.data || {};
}

export async function apiRequest(path, options = {}) {
  const {
    method = "GET",
    token,
    body,
    isFormData = false,
    language = "en"
  } = options;

  const headers = {
    Accept: "application/json",
    "x-lang": language
  };

  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  const storedToken = getStoredToken();
  const resolvedToken = storedToken || token;

  if (resolvedToken) {
    headers.Authorization = `Bearer ${resolvedToken}`;
  }

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body
        ? isFormData
          ? body
          : JSON.stringify(body)
        : undefined
    });
  } catch (_networkError) {
    throw new Error(`Unable to reach API at ${API_BASE_URL}. Ensure backend is running and CORS is enabled.`);
  }

  let payload = await parseResponse(response);

  if (!response.ok && response.status === 401 && path !== "/admin/login" && path !== "/admin/refresh") {
    try {
      const refreshed = await refreshAccessToken(language);
      const retryHeaders = { ...headers };

      if (refreshed.token) {
        retryHeaders.Authorization = `Bearer ${refreshed.token}`;
      }

      response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: retryHeaders,
        body: body
          ? isFormData
            ? body
            : JSON.stringify(body)
          : undefined
      });

      payload = await parseResponse(response);
    } catch (refreshError) {
      clearStoredAuth();
      throw refreshError;
    }
  }

  if (!response.ok) {
    const error = new Error(extractPayloadMessage(payload));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function getApiBaseUrl() {
  return API_BASE_URL;
}
