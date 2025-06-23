import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-blue-600 text-white hover:bg-blue-700", // Primary CTA
        secondary:
          "border-transparent bg-gray-200 text-gray-900 hover:bg-gray-300", // Neutral secondary
        destructive:
          "border-transparent bg-red-600 text-white hover:bg-red-700", // DANGER
        outline: "border border-gray-300 text-gray-900 hover:bg-gray-100", // Simple outline
        success: "bg-green-600 text-white hover:bg-green-700", // Positive feedback
        warning: "bg-yellow-500 text-white hover:bg-yellow-600", // Warnings/alerts
        error: "bg-red-500 text-white hover:bg-red-600", // Errors
        info: "bg-sky-500 text-white hover:bg-sky-600", // Informational banners
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
