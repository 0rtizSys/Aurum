import type { HTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type BadgeTone = "default" | "muted" | "active" | "success" | "danger";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
}

const toneStyles: Record<BadgeTone, string> = {
  default: "border-slate-800 bg-slate-900 text-slate-200",
  muted: "border-slate-800 bg-slate-950 text-slate-400",
  active: "border-slate-100/40 bg-slate-100 text-slate-950",
  success: "border-slate-700 bg-slate-800 text-white",
  danger: "border-slate-700 bg-slate-900 text-slate-200",
};

export function Badge({ className, tone = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em]",
        toneStyles[tone],
        className,
      )}
      {...props}
    />
  );
}
