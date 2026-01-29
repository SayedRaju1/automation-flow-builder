import { cva, type VariantProps } from "class-variance-authority";
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
} from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-muted hover:text-foreground",
        secondary: "bg-muted text-foreground shadow-sm hover:bg-muted/80",
        ghost: "hover:bg-muted hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const computedClassName = cn(buttonVariants({ variant, size, className }));
    if (asChild && isValidElement(props.children)) {
      return cloneElement(
        props.children as ReactElement<{
          className?: string;
          ref?: React.Ref<unknown>;
        }>,
        {
          className: cn(
            computedClassName,
            (props.children as ReactElement).props?.className,
          ),
          ref,
        },
      );
    }
    return <button className={computedClassName} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
