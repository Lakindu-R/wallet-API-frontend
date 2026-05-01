import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import type { Wallet } from "@/lib/api";

interface Ctx {
  wallets: Wallet[];
  activeWallet: Wallet | null;
  addWallet: (w: Wallet) => void;
  setActive: (id: string) => void;
  updateBalance: (id: string, balance: number) => void;
  setLastActivity: (date: string) => void;
  totalTransactions: number;
  bumpTransactions: () => void;
  lastActivity: string | null;
}

const WalletCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "walletos:state";

interface Stored {
  wallets: Wallet[];
  activeId: string | null;
  totalTransactions: number;
  lastActivity: string | null;
}

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [lastActivity, setLastActivity] = useState<string | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Stored = JSON.parse(raw);
        setWallets(parsed.wallets || []);
        setActiveId(parsed.activeId);
        setTotalTransactions(parsed.totalTransactions || 0);
        setLastActivity(parsed.lastActivity);
      }
    } catch {}
  }, []);

  useEffect(() => {
    const data: Stored = { wallets, activeId, totalTransactions, lastActivity };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [wallets, activeId, totalTransactions, lastActivity]);

  const addWallet = (w: Wallet) => {
    setWallets((prev) => [...prev, w]);
    setActiveId(w.id);
  };

  const updateBalance = (id: string, balance: number) =>
    setWallets((prev) => prev.map((w) => (w.id === id ? { ...w, balance } : w)));

  const activeWallet = wallets.find((w) => w.id === activeId) || null;

  return (
    <WalletCtx.Provider
      value={{
        wallets,
        activeWallet,
        addWallet,
        setActive: setActiveId,
        updateBalance,
        setLastActivity,
        totalTransactions,
        bumpTransactions: () => setTotalTransactions((n) => n + 1),
        lastActivity,
      }}
    >
      {children}
    </WalletCtx.Provider>
  );
};

export const useWallets = () => {
  const ctx = useContext(WalletCtx);
  if (!ctx) throw new Error("useWallets must be used within WalletProvider");
  return ctx;
};
