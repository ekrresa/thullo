import * as React from 'react';
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
      className={`flex items-center ${className} disabled:cursor-not-allowed disabled:opacity-60`}
      type={type}
      {...props}
    >
      {children}
      {loading && <AiOutlineLoading className="ml-4 animate-spin text-xl text-inherit" />}
    </button>
  );
}
