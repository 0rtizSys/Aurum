import type { InputHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export function Input({ className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-slate-600 focus:bg-slate-900",
        className,
      )}
      {...props}
    />
  );
}
