import * as React from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@lib/utils';

interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonClasses> {
  loading?: boolean;
}
export function Button(props: ButtonProps) {
  const { children, className, loading, fullWidth, variant, ...buttonProps } = props;

  return (
    <button
      className={cn(buttonClasses({ variant, fullWidth }), className)}
      disabled={loading}
      {...buttonProps}
    >
      {loading ? (
        <AiOutlineLoading className="animate-spin text-xl text-inherit" />
      ) : (
        children
      )}
    </button>
  );
}

const buttonClasses = cva(
  'flex items-center justify-center rounded-lg transition-colors text-sm shadow-sm py-2.5 px-6 disabled:cursor-not-allowed disabled:opacity-60',
  {
    variants: {
      variant: {
        primary: 'bg-astronaut-500 text-white hover:bg-astronaut-600',
        secondary:
          'text-astronaut-900 bg-astronaut-100 border border-astronaut-200 hover:bg-astronaut-200',
        danger: 'bg-roman-500 text-white hover:bg-roman-600',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
  }
);
