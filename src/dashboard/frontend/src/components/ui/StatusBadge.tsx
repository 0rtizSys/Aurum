interface StatusBadgeProps {
  text: string;
  type?: "success" | "warning" | "info" | "accent" | "neutral" | "danger";
  pulse?: boolean;
}

export const StatusBadge = ({
  text,
  type = "info",
  pulse = false,
}: StatusBadgeProps) => {
  const colors = {
    success: "border-emerald-400/25 bg-emerald-400/10 text-emerald-100",
    warning: "border-amber-300/25 bg-amber-300/10 text-amber-100",
    info: "border-cyan-300/25 bg-cyan-300/10 text-cyan-100",
    accent: "border-fuchsia-300/25 bg-fuchsia-300/10 text-fuchsia-100",
    neutral: "border-white/10 bg-white/5 text-slate-200",
    danger: "border-rose-400/25 bg-rose-400/10 text-rose-100",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${colors[type]} ${
        pulse ? "animate-pulse" : ""
      }`}
    >
      {text}
    </span>
  );
};
