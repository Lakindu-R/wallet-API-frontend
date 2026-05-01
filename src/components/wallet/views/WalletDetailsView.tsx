import { useState } from "react";
import { Copy, Check, RefreshCw, Wallet as WalletIcon } from "lucide-react";
import { Header } from "../Header";
import { Spinner } from "../Spinner";
import { useWallets } from "../WalletContext";
import { api } from "@/lib/api";
import { toast } from "sonner";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

export const WalletDetailsView = () => {
  const { wallets, activeWallet, setActive, updateBalance } = useWallets();
  const [copied, setCopied] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const copyId = async () => {
    if (!activeWallet) return;
    try {
      await navigator.clipboard.writeText(activeWallet.id);
      setCopied(true);
      toast.success("Wallet ID copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Failed to copy");
    }
  };

  const refresh = async () => {
    if (!activeWallet) return;
    setRefreshing(true);
    try {
      const fresh = await api.getWallet(activeWallet.id);
      updateBalance(fresh.id, fresh.balance);
      toast.success("Wallet refreshed");
    } catch (err) {
      toast.error("Failed to refresh", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Header
        title="Wallet Details"
        subtitle="Inspect balances and copy IDs"
        action={
          wallets.length > 0 && (
            <select
              value={activeWallet?.id || ""}
              onChange={(e) => setActive(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-input bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth"
            >
              {wallets.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
            </select>
          )
        }
      />

      {!activeWallet ? (
        <div className="bg-card rounded-2xl p-12 text-center shadow-soft border border-border/50">
          <div className="h-14 w-14 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-3">
            <WalletIcon className="text-muted-foreground" size={24} />
          </div>
          <p className="text-muted-foreground">No wallet selected. Create one to begin.</p>
        </div>
      ) : (
        <div className="bg-card rounded-2xl shadow-soft border border-border/50 overflow-hidden animate-scale-in">
          <div className="bg-gradient-primary p-8 text-primary-foreground">
            <p className="text-sm opacity-80">Current Balance</p>
            <p className="text-5xl font-semibold mt-2 tracking-tight">
              {formatCurrency(activeWallet.balance)}
            </p>
            <p className="text-sm opacity-80 mt-3">{activeWallet.name}</p>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">
                Wallet ID
              </p>
              <div className="flex items-center gap-2 p-3 rounded-xl bg-secondary">
                <code className="flex-1 text-sm font-mono text-foreground truncate">
                  {activeWallet.id}
                </code>
                <button
                  onClick={copyId}
                  className="shrink-0 p-2 rounded-lg hover:bg-background transition-smooth text-muted-foreground hover:text-foreground"
                  aria-label="Copy wallet ID"
                >
                  {copied ? <Check size={16} className="text-success" /> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">
                  Name
                </p>
                <p className="text-foreground font-medium">{activeWallet.name}</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground font-medium mb-2">
                  Balance
                </p>
                <p className="text-foreground font-medium">{formatCurrency(activeWallet.balance)}</p>
              </div>
            </div>

            <button
              onClick={refresh}
              disabled={refreshing}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-secondary text-foreground transition-smooth disabled:opacity-60"
            >
              {refreshing ? <Spinner /> : <RefreshCw size={16} />}
              Refresh balance
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
