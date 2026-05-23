import * as React from "react";
import { cn } from "@/lib/utils";

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline" | "accent";
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold",
        variant === "default" && "bg-blue-50 text-blue-800",
        variant === "secondary" && "bg-emerald-50 text-emerald-800",
        variant === "accent" && "bg-amber-50 text-amber-800",
        variant === "outline" && "border bg-white text-slate-700",
        className
      )}
      {...props}
    />
  );
}
