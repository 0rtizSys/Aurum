import type { ButtonHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";
type ButtonSize = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "border-slate-200 bg-slate-100 text-slate-950 hover:bg-white hover:border-white",
  secondary:
    "border-slate-800 bg-slate-900 text-slate-100 hover:border-slate-700 hover:bg-slate-800/80",
  ghost:
    "border-transparent bg-transparent text-slate-300 hover:border-slate-800 hover:bg-slate-900/70 hover:text-white",
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-xs tracking-[0.22em]",
  md: "h-11 px-4 text-xs tracking-[0.22em]",
};

export function Button({
  className,
  variant = "secondary",
  size = "md",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full border font-medium uppercase transition disabled:cursor-not-allowed disabled:opacity-50",
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    />
  );
}
