import * as React from 'react';
import { cn } from '@lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelHidden?: boolean;
}
export function Input(props: Props) {
  const { label, labelHidden, id, className, ...inputProps } = props;

  return (
    <div>
      <label className="mb-1 block text-sm text-pencil" htmlFor={id}>
        {label}
      </label>
      <input
        className={cn(
          'block w-full rounded-md border border-slate-300 py-2 px-3 text-sm font-medium hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:ring-offset-1',
          className
        )}
        id={id}
        type="text"
        {...inputProps}
      />
    </div>
  );
}
