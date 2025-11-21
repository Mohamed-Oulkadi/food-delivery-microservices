import * as React from "react";
import { cn } from "../../lib/utils";
import { Loader2 } from "lucide-react";

// Note: I am not using class-variance-authority in the dependencies list I installed earlier.
// I should probably install it or just write manual classes.
// User asked for "Headless UI or Shadcn-like". Shadcn uses cva.
// I will implement a simpler version without cva to avoid extra deps if I didn't install it.
// Wait, I didn't install cva. I'll use manual props or install it.
// I'll stick to manual props for simplicity and speed, or just install cva quickly.
// Actually, manual is fine for a few components.

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'destructive';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', isLoading, children, ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

        const variants = {
            default: "bg-emerald-600 text-slate-50 hover:bg-emerald-600/90",
            destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90",
            outline: "border border-slate-200 bg-white hover:bg-slate-100 hover:text-slate-900",
            secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80",
            ghost: "hover:bg-slate-100 hover:text-slate-900",
        };

        const sizes = {
            default: "h-10 px-4 py-2",
            sm: "h-9 rounded-md px-3",
            lg: "h-11 rounded-md px-8",
            icon: "h-10 w-10",
        };

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                disabled={isLoading || props.disabled}
                {...props}
            >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);
Button.displayName = "Button";

export { Button };
