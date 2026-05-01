// call backend url
const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export const apiRequest = async (endpoint, method = "GET", body = null) => {
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : null,
  });

  if (!res.ok) {
    const error = await res.text();
    throw new Error(error || "API Error");
  }

  return res.json();
};