import { Wallet as WalletIcon, TrendingUp, Activity, CircleDollarSign } from "lucide-react";
import { Header } from "../Header";
import { StatCard } from "../StatCard";
import { useWallets } from "../WalletContext";

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const formatDate = (d: string | null) => {
  if (!d) return "—";
  return new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
};

export const DashboardView = () => {
  const { wallets, activeWallet, totalTransactions, lastActivity } = useWallets();

  return (
    <div className="animate-fade-in">
      <Header title="Dashboard" subtitle="Overview of your wallets and recent activity" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Wallets" value={wallets.length} icon={WalletIcon} accent="primary" />
        <StatCard
          label="Selected Balance"
          value={activeWallet ? formatCurrency(activeWallet.balance) : "—"}
          icon={CircleDollarSign}
          accent="success"
          hint={activeWallet?.name}
        />
        <StatCard label="Transactions" value={totalTransactions} icon={TrendingUp} accent="neutral" />
        <StatCard label="Last Activity" value={formatDate(lastActivity)} icon={Activity} accent="neutral" />
      </div>

      <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 animate-scale-in">
        <h2 className="text-lg font-semibold mb-4">Your Wallets</h2>
        {wallets.length === 0 ? (
          <div className="text-center py-12">
            <div className="h-14 w-14 mx-auto rounded-2xl bg-secondary flex items-center justify-center mb-3">
              <WalletIcon className="text-muted-foreground" size={24} />
            </div>
            <p className="text-muted-foreground">No wallets yet. Create your first one to get started.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {wallets.map((w) => (
              <div
                key={w.id}
                className={`p-4 rounded-xl border transition-smooth hover:shadow-soft hover:-translate-y-0.5 ${
                  activeWallet?.id === w.id
                    ? "border-primary bg-accent"
                    : "border-border bg-background"
                }`}
              >
                <p className="font-medium text-foreground truncate">{w.name}</p>
                <p className="text-2xl font-semibold mt-1">{formatCurrency(w.balance)}</p>
                <p className="text-xs text-muted-foreground mt-2 font-mono truncate">{w.id}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
