import { useState } from "react";
import { PlusCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { Header } from "../Header";
import { Spinner } from "../Spinner";
import { api } from "@/lib/api";
import { useWallets } from "../WalletContext";
import { toast } from "sonner";
import { apiRequest } from "../../../api/api";
interface Props {
  onCreated: () => void;
}

export const CreateWalletView = ({ onCreated }: Props) => {
  const { addWallet } = useWallets();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const wallet = await apiRequest("/wallets", "POST", { name });
      addWallet(wallet);
      setSuccess("Wallet created successfully!");
      toast.success("Wallet created!");
      setName("");
      onCreated();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <Header
        title="Create Wallet"
        subtitle="Spin up a new wallet in seconds"
      />

      <div className="max-w-xl">
        <div className="bg-card rounded-2xl p-8 shadow-soft border border-border/50 animate-scale-in">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="walletName"
                className="block text-sm font-medium text-foreground mb-2"
              >
                Wallet Name
              </label>
              <input
                id="walletName"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Personal Savings"
                disabled={loading}
                maxLength={60}
                className="w-full px-4 py-3 rounded-xl border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-smooth disabled:opacity-50"
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 text-destructive animate-fade-in">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="flex items-start gap-3 p-4 rounded-xl bg-success/10 text-success animate-fade-in">
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <p className="text-sm">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-gradient-primary text-primary-foreground font-medium px-5 py-3 rounded-xl shadow-glow hover:shadow-elevated transition-smooth disabled:opacity-60 disabled:cursor-not-allowed hover:-translate-y-0.5"
            >
              {loading ? <Spinner /> : <PlusCircle size={18} />}
              {loading ? "Creating..." : "Create Wallet"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
