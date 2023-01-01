import * as React from 'react';
import { cn } from '@lib/utils';
import { AiOutlineLoading } from 'react-icons/ai';

interface ButtonProps extends React.ComponentProps<'button'> {
  loading?: boolean;
}

export function Button({
  children,
  className,
  loading,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'flex items-center justify-center disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      type={type}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <AiOutlineLoading className="animate-spin text-xl text-inherit" />
      ) : (
        children
      )}
    </button>
  );
}
