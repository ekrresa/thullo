import * as React from 'react';
import { cn } from '@lib/utils';

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  labelHidden?: boolean;
  errorMessage?: string;
  containerClassName?: string;
}
function InputInner(props: Props, ref: React.ForwardedRef<HTMLInputElement>) {
  const {
    label,
    labelHidden,
    id,
    className,
    containerClassName,
    errorMessage,
    ...inputProps
  } = props;

  return (
    <div className={containerClassName}>
      <label className="mb-1 block text-sm text-pencil" htmlFor={id}>
        {label}
      </label>

      <input
        ref={ref}
        className={cn(
          'block w-full rounded-md border border-slate-300 py-2 px-3 text-sm font-medium hover:border-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-600 focus:ring-offset-1',
          className,
          errorMessage && 'border-red-300 hover:border-red-300 focus:ring-red-600'
        )}
        aria-invalid={errorMessage ? 'true' : 'false'}
        aria-errormessage={`err-${id}`}
        id={id}
        type="text"
        {...inputProps}
      />

      {errorMessage && (
        <p role="alert" id={`err-${id}`} className="mt-1 text-xs text-red-500">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

export const Input = React.forwardRef(InputInner);
