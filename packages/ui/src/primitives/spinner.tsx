import { Loader2 } from "lucide-react";
import { forwardRef, type HTMLAttributes } from "react";
import { cn } from "../lib/cn";

export interface SpinnerProps extends Omit<HTMLAttributes<SVGSVGElement>, "size"> {
  size?: number;
}

export const Spinner = forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = 16, ...props }, ref) => (
    <Loader2
      ref={ref}
      size={size}
      className={cn("animate-spin", className)}
      {...props}
    />
  ),
);
Spinner.displayName = "Spinner";
