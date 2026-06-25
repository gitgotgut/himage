import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        destructive: "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        streaming: "border-transparent bg-violet-100 text-violet-800",
        music: "border-transparent bg-pink-100 text-pink-800",
        gaming: "border-transparent bg-amber-100 text-amber-800",
        news: "border-transparent bg-sky-100 text-sky-800",
        fitness: "border-transparent bg-green-100 text-green-800",
        food: "border-transparent bg-orange-100 text-orange-800",
        software: "border-transparent bg-blue-100 text-blue-800",
        cloud: "border-transparent bg-cyan-100 text-cyan-800",
        education: "border-transparent bg-indigo-100 text-indigo-800",
        security: "border-transparent bg-red-100 text-red-800",
        productivity: "border-transparent bg-lime-100 text-lime-800",
        shopping: "border-transparent bg-fuchsia-100 text-fuchsia-800",
        other: "border-transparent bg-slate-100 text-slate-700",
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
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
