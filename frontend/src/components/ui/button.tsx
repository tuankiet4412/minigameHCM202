'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-heritage-red to-heritage-red-dark text-white shadow-glow-red hover:scale-[1.02] hover:shadow-glow active:scale-[0.98]',
        outline:
          'border border-heritage-gold/50 bg-transparent text-heritage-red hover:bg-heritage-gold/10 dark:text-heritage-gold',
        ghost: 'hover:bg-heritage-gold/10 text-foreground',
        glass:
          'glass-card border-heritage-gold/20 text-foreground hover:border-heritage-gold/40',
      },
      size: {
        default: 'h-11 px-8 py-2',
        sm: 'h-9 px-4 text-xs',
        lg: 'h-13 px-10 text-base',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
