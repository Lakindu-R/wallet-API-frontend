interface Props {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export const Header = ({ title, subtitle, action }: Props) => (
  <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8 animate-fade-in">
    <div>
      <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
      {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
    </div>
    {action}
  </header>
);
