const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  createdAt?: string;
}

export interface Transaction {
  id: string;
  walletId?: string;
  type: "credit" | "debit";
  amount: number;
  date: string;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    let msg = `Request failed (${res.status})`;
    try {
      const data = await res.json();
      msg = data.message || data.error || msg;
    } catch {}
    throw new Error(msg);
  }
  return res.json();
}

export const api = {
  createWallet: (name: string) =>
    request<Wallet>("/wallets", { method: "POST", body: JSON.stringify({ name }) }),
  getWallet: (id: string) => request<Wallet>(`/wallets/${id}`),
  createTransaction: (walletId: string, type: "credit" | "debit", amount: number) =>
    request<Transaction>(`/wallets/${walletId}/transactions`, {
      method: "POST",
      body: JSON.stringify({ type, amount }),
    }),
  getTransactions: (walletId: string, limit = 10, offset = 0) =>
    request<Transaction[] | { data: Transaction[]; total?: number }>(
      `/wallets/${walletId}/transactions?limit=${limit}&offset=${offset}`
    ),
};
