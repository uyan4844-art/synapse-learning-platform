import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring select-none",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-border bg-secondary text-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground border-border bg-card/60",
        emerald:
          "border-success/30 bg-success/15 text-success",
        success:
          "border-success/30 bg-success/15 text-success",
        brand:
          "border-transparent bg-primary text-primary-foreground font-semibold",
        amber:
          "border-warning/30 bg-warning/15 text-warning",
        warning:
          "border-warning/30 bg-warning/15 text-warning",
        sky:
          "border-primary/30 bg-primary/15 text-primary",
        elo:
          "border-warning/30 bg-warning/15 text-warning font-mono font-medium px-2 py-0.5",
        chessDark:
          "border-border bg-secondary text-foreground font-mono",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
