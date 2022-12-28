import * as React from 'react';
import { cn } from '@lib/utils';
import { AiOutlineLoading } from 'react-icons/ai';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
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
        'flex items-center disabled:cursor-not-allowed disabled:opacity-60',
        className
      )}
      type={type}
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
