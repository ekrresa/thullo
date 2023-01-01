import * as React from 'react';
import { cn } from '@lib/utils';
import { AiOutlineLoading } from 'react-icons/ai';

interface Props extends React.ComponentProps<'div'> {}
export function Spinner({ className, ...props }: Props) {
  return (
    <div
      className={`${cn('flex h-full w-full items-center justify-center', className)}`}
      {...props}
    >
      <AiOutlineLoading className="animate-spin text-inherit" />
    </div>
  );
}
