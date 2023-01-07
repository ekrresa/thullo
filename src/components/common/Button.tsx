import * as React from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@lib/utils';

interface ButtonProps<T extends React.ElementType>
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonClasses> {
  as?: T;
  loading?: boolean;
}
export function Button<T extends React.ElementType = 'button'>(
  props: ButtonProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof ButtonProps<T>>
) {
  const {
    as,
    children,
    className,
    loading,
    fullWidth,
    variant,
    type = 'button',
    ...buttonProps
  } = props;

  const Component = as || 'button';

  return (
    <Component
      className={cn(buttonClasses({ variant, fullWidth }), className)}
      disabled={loading}
      type={type}
      {...buttonProps}
    >
      {loading ? (
        <AiOutlineLoading className="animate-spin text-xl text-inherit" />
      ) : (
        children
      )}
    </Component>
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
