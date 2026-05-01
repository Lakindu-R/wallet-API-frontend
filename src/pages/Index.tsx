import { useState } from "react";
import { Sidebar, type View } from "@/components/wallet/Sidebar";
import { WalletProvider } from "@/components/wallet/WalletContext";
import { DashboardView } from "@/components/wallet/views/DashboardView";
import { CreateWalletView } from "@/components/wallet/views/CreateWalletView";
import { WalletDetailsView } from "@/components/wallet/views/WalletDetailsView";
import { TransactionsView } from "@/components/wallet/views/TransactionsView";

const Index = () => {
  const [view, setView] = useState<View>("dashboard");

  return (
    <WalletProvider>
      <div className="min-h-screen flex w-full bg-background">
        <Sidebar active={view} onChange={setView} />
        <main className="flex-1 min-w-0 px-4 sm:px-8 py-8 pt-20 md:pt-8 max-w-6xl mx-auto w-full">
          <div key={view}>
            {view === "dashboard" && <DashboardView />}
            {view === "create" && <CreateWalletView onCreated={() => setView("details")} />}
            {view === "details" && <WalletDetailsView />}
            {view === "transactions" && <TransactionsView />}
          </div>
        </main>
      </div>
    </WalletProvider>
  );
};

export default Index;
