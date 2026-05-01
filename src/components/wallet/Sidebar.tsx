import { LayoutDashboard, PlusCircle, Wallet, ArrowLeftRight, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export type View = "dashboard" | "create" | "details" | "transactions";

const items: { id: View; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "create", label: "Create Wallet", icon: PlusCircle },
  { id: "details", label: "Wallet Details", icon: Wallet },
  { id: "transactions", label: "Transactions", icon: ArrowLeftRight },
];

interface Props {
  active: View;
  onChange: (v: View) => void;
}

export const Sidebar = ({ active, onChange }: Props) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const select = (v: View) => {
    onChange(v);
    setMobileOpen(false);
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 md:hidden h-10 w-10 rounded-xl bg-sidebar text-sidebar-foreground flex items-center justify-center shadow-elevated"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 md:hidden animate-fade-in"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed md:sticky top-0 left-0 h-screen w-64 bg-gradient-sidebar text-sidebar-foreground z-40 flex flex-col transition-transform duration-300 md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="px-6 py-7 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
              <Wallet className="text-primary-foreground" size={20} />
            </div>
            <div>
              <h1 className="text-base font-semibold text-white">WalletOS</h1>
              <p className="text-xs text-sidebar-foreground/60">Manage with ease</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-6 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => select(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-smooth",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft"
                    : "hover:bg-sidebar-accent/50 hover:text-white"
                )}
              >
                <Icon size={18} className={isActive ? "text-primary" : ""} />
                <span>{item.label}</span>
                {isActive && <span className="ml-auto h-2 w-2 rounded-full bg-primary animate-scale-in" />}
              </button>
            );
          })}
        </nav>

        <div className="px-6 py-5 border-t border-sidebar-border">
          <div className="rounded-xl bg-sidebar-accent/50 p-4">
            <p className="text-xs text-sidebar-foreground/70">API Endpoint</p>
            <p className="text-xs font-mono text-white mt-1 truncate">localhost:8080</p>
          </div>
        </div>
      </aside>
    </>
  );
};
