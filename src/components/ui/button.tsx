import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 hover:shadow-[0px_0px_12px_rgba(255,255,255,0.5)]", // Glow Effect
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 hover:shadow-[0px_0px_12px_rgba(255,0,0,0.5)]", // Red Glow
        outline:
          "border border-input bg-background shadow-xs hover:bg-accent hover:text-accent-foreground hover:shadow-[0px_0px_12px_rgba(255,255,255,0.5)]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80 hover:shadow-[0px_0px_12px_rgba(255,255,255,0.5)]",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:shadow-[0px_0px_12px_rgba(255,255,255,0.5)]",
        link: "text-primary underline-offset-4 hover:underline",

        soft: "bg-muted text-muted-foreground shadow-sm hover:bg-muted/80 hover:shadow-[0px_0px_12px_rgba(255,255,255,0.5)]",
        elevated:
          "bg-primary text-primary-foreground shadow-md hover:shadow-lg hover:bg-primary/80 hover:shadow-[0px_0px_12px_rgba(255,255,255,0.5)]",
        glass:
          "bg-primary/10 text-white backdrop-blur-md border border-primary/20 hover:bg-primary/20 hover:border-primary/40 hover:shadow-[0px_0px_12px_rgba(255,255,255,0.5)]",
        gradient:
          "bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 hover:shadow-[0px_0px_12px_rgba(255,255,255,0.5)]",
        bordered:
          "border-2 border-primary text-primary hover:bg-primary/10 hover:shadow-[0px_0px_12px_rgba(255,255,255,0.5)]",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
