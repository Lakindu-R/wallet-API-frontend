import { cn } from "@/lib/utils";

interface Props {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent?: "primary" | "neutral" | "success" | "destructive";
  hint?: string;
}

const accents = {
  primary: "bg-gradient-primary text-primary-foreground shadow-glow",
  neutral: "bg-secondary text-secondary-foreground",
  success: "bg-success/10 text-success",
  destructive: "bg-destructive/10 text-destructive",
};

export const StatCard = ({ label, value, icon: Icon, accent = "neutral", hint }: Props) => (
  <div className="bg-card rounded-2xl p-6 shadow-soft hover:shadow-elevated transition-smooth border border-border/50 animate-scale-in">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-3xl font-semibold mt-2 text-foreground tracking-tight">{value}</p>
        {hint && <p className="text-xs text-muted-foreground mt-1">{hint}</p>}
      </div>
      <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center", accents[accent])}>
        <Icon size={20} />
      </div>
    </div>
  </div>
);
