import * as React from 'react';
import { AiOutlineLoading } from 'react-icons/ai';

interface ButtonProps extends React.PropsWithChildren<unknown> {
  className?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
}

export function Button({
  children,
  className,
  disabled,
  loading,
  onClick,
  type = 'button',
}: ButtonProps) {
  return (
    <button
      className={`flex items-center ${className} disabled:opacity-60 disabled:cursor-not-allowed`}
      disabled={disabled}
      onClick={onClick}
      type={type}
    >
      {children}
      {loading && <AiOutlineLoading className="ml-4 text-xl text-inherit animate-spin" />}
    </button>
  );
}
