import { useCallback, useEffect, useState } from "react";
import { ArrowDownCircle, ArrowUpCircle, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { Header } from "../Header";
import { Spinner } from "../Spinner";
import { useWallets } from "../WalletContext";
import { api, type Transaction } from "@/lib/api";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 10;

const formatCurrency = (n: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);

const formatDate = (d: string) =>
  new Date(d).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });

export const TransactionsView = () => {
  const { activeWallet, wallets, setActive, updateBalance, bumpTransactions, setLastActivity } =
    useWallets();

  const [type, setType] = useState<"credit" | "debit">("credit");
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const fetchTx = useCallback(
    async (off: number) => {
      if (!activeWallet) return;
      setLoading(true);
      try {
        const res = await api.getTransactions(activeWallet.id, PAGE_SIZE, off);
        const list = Array.isArray(res) ? res : res.data || [];
        setTransactions(list);
        setHasMore(list.length === PAGE_SIZE);
      } catch (err) {
        toast.error("Failed to load transactions", {
          description: err instanceof Error ? err.message : undefined,
        });
        setTransactions([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    },
    [activeWallet]
  );

  useEffect(() => {
    setOffset(0);
    if (activeWallet) fetchTx(0);
  }, [activeWallet, fetchTx]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeWallet) {
      toast.error("Select a wallet first");
      return;
    }
    const num = parseFloat(amount);
    if (!amount || isNaN(num) || num <= 0) {
      toast.error("Amount must be greater than 0");
      return;
    }
    setSubmitting(true);
    try {
      await api.createTransaction(activeWallet.id, type, num);
      toast.success(`${type === "credit" ? "Credited" : "Debited"} ${formatCurrency(num)}`);
      const delta = type === "credit" ? num : -num;
      updateBalance(activeWallet.id, activeWallet.balance + delta);
      bumpTransactions();
      setLastActivity(new Date().toISOString());
      setAmount("");
      setOffset(0);
      fetchTx(0);
    } catch (err) {
      toast.error("Transaction failed", {
        description: err instanceof Error ? err.message : undefined,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const goPage = (delta: number) => {
    const next = Math.max(0, offset + delta * PAGE_SIZE);
    setOffset(next);
    fetchTx(next);
  };

  return (
    <div className="animate-fade-in">
      <Header
        title="Transactions"
        subtitle="Credit, debit, and review your wallet history"
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

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="bg-card rounded-2xl p-6 shadow-soft border border-border/50 lg:col-span-1 animate-scale-in h-fit">
          <h2 className="text-lg font-semibold mb-4">New Transaction</h2>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Type</label>
              <div className="grid grid-cols-2 gap-2">
                {(["credit", "debit"] as const).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setType(t)}
                    className={cn(
                      "px-3 py-2.5 rounded-xl text-sm font-medium border transition-smooth capitalize flex items-center justify-center gap-2",
                      type === t
                        ? t === "credit"
                          ? "bg-success/10 text-success border-success/30"
                          : "bg-destructive/10 text-destructive border-destructive/30"
                        : "bg-background border-border hover:bg-secondary text-muted-foreground"
                    )}
                  >
                    {t === "credit" ? <ArrowDownCircle size={16} /> : <ArrowUpCircle size={16} />}
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="amount" className="block text-sm font-medium mb-2">
                Amount
              </label>
              <input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                disabled={submitting}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-smooth disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !activeWallet}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground font-medium px-5 py-3 rounded-xl shadow-glow hover:shadow-elevated transition-smooth disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {submitting ? <Spinner /> : <Send size={16} />}
              {submitting ? "Submitting..." : "Submit"}
            </button>
            {!activeWallet && (
              <p className="text-xs text-muted-foreground text-center">
                Select or create a wallet first
              </p>
            )}
          </form>
        </div>

        {/* History */}
        <div className="bg-card rounded-2xl shadow-soft border border-border/50 lg:col-span-2 animate-scale-in overflow-hidden">
          <div className="p-6 border-b border-border/50 flex items-center justify-between">
            <h2 className="text-lg font-semibold">History</h2>
            {activeWallet && (
              <p className="text-sm text-muted-foreground">
                Page {Math.floor(offset / PAGE_SIZE) + 1}
              </p>
            )}
          </div>

          {loading ? (
            <div className="py-16 flex justify-center">
              <Spinner className="h-6 w-6 text-primary" />
            </div>
          ) : !activeWallet ? (
            <div className="py-16 text-center text-muted-foreground">
              Select a wallet to view transactions
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">No transactions yet</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground border-b border-border/50">
                      <th className="px-6 py-3 font-medium">Type</th>
                      <th className="px-6 py-3 font-medium">Amount</th>
                      <th className="px-6 py-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx) => {
                      const isCredit = tx.type === "credit";
                      return (
                        <tr
                          key={tx.id}
                          className="border-b border-border/40 last:border-0 hover:bg-secondary/40 transition-smooth animate-slide-in"
                        >
                          <td className="px-6 py-4">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium capitalize",
                                isCredit
                                  ? "bg-success/10 text-success"
                                  : "bg-destructive/10 text-destructive"
                              )}
                            >
                              {isCredit ? <ArrowDownCircle size={12} /> : <ArrowUpCircle size={12} />}
                              {tx.type}
                            </span>
                          </td>
                          <td
                            className={cn(
                              "px-6 py-4 font-semibold tabular-nums",
                              isCredit ? "text-success" : "text-destructive"
                            )}
                          >
                            {isCredit ? "+" : "−"}
                            {formatCurrency(tx.amount)}
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {formatDate(tx.date)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-4 flex items-center justify-between border-t border-border/50">
                <button
                  onClick={() => goPage(-1)}
                  disabled={offset === 0 || loading}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                <button
                  onClick={() => goPage(1)}
                  disabled={!hasMore || loading}
                  className="inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm hover:bg-secondary transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
