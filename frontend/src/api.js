const BASE = "/api";
const TOKEN_KEY = "nodecraft_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return null;

  let data = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.detail ? (typeof data.detail === "string" ? data.detail : "Request failed") : `Request failed (${res.status})`;
    throw new ApiError(message, res.status);
  }
  return data;
}

export const api = {
  auth: {
    register: (payload) => request("/auth/register", { method: "POST", body: payload, auth: false }),
    login: (payload) => request("/auth/login", { method: "POST", body: payload, auth: false }),
    me: () => request("/auth/me"),
  },
  workflows: {
    list: () => request("/workflows"),
    get: (id) => request(`/workflows/${id}`),
    create: (payload) => request("/workflows", { method: "POST", body: payload }),
    fromTemplate: (templateId) => request(`/workflows/from-template/${templateId}`, { method: "POST" }),
    update: (id, payload) => request(`/workflows/${id}`, { method: "PUT", body: payload }),
    remove: (id) => request(`/workflows/${id}`, { method: "DELETE" }),
    run: (id) => request(`/workflows/${id}/run`, { method: "POST" }),
  },
  templates: {
    list: (params = {}) => {
      const qs = new URLSearchParams(params).toString();
      return request(`/templates${qs ? `?${qs}` : ""}`, { auth: false });
    },
  },
  monitoring: {
    stats: () => request("/monitoring/stats"),
    workflows: () => request("/monitoring/workflows"),
    activity: () => request("/monitoring/activity"),
  },
  team: {
    members: () => request("/team/members"),
    invite: (payload) => request("/team/members/invite", { method: "POST", body: payload }),
    activity: () => request("/team/activity"),
  },
  settings: {
    get: () => request("/settings"),
    update: (payload) => request("/settings", { method: "PUT", body: payload }),
  },
  apiKeys: {
    list: () => request("/api-keys"),
    create: (name) => request("/api-keys", { method: "POST", body: { name } }),
    revoke: (id) => request(`/api-keys/${id}`, { method: "DELETE" }),
  },
  integrations: {
    list: () => request("/integrations"),
    toggle: (id) => request(`/integrations/${id}/toggle`, { method: "POST" }),
  },
  pricing: {
    list: () => request("/pricing", { auth: false }),
  },
  assistant: {
    chat: (message) => request("/assistant/chat", { method: "POST", body: { message } }),
  },
};

export { ApiError };
