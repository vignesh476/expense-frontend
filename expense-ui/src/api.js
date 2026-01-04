const API = import.meta.env.VITE_API_URL;

export async function api(path, options = {}) {
  const token = localStorage.getItem("access_token");

  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  });

  if (res.status === 401) {
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Request failed");
  }

  return res.json();
}
