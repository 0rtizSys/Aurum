import type { SelectHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function Select({ className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 text-sm text-white outline-none transition focus:border-slate-600 focus:bg-slate-900",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  );
}
