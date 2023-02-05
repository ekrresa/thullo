import * as React from 'react';
import * as AvatarPrimitives from '@radix-ui/react-avatar';
import { cn, getInitials } from '@lib/utils';

interface AvatarProps extends React.ComponentProps<'div'> {
  image: string | null;
  name: string | null;
}
export function Avatar(props: AvatarProps) {
  const { image, name, className } = props;

  return (
    <AvatarPrimitives.Root
      className={cn(
        'flex h-8 w-8 items-center justify-center overflow-hidden rounded-full',
        className
      )}
    >
      <AvatarPrimitives.Image
        src={image ?? ''}
        className="h-full w-full rounded-full object-cover"
        alt={name ?? ''}
      />

      {Boolean(name) && (
        <AvatarPrimitives.Fallback className="flex h-full w-full items-center justify-center rounded-full border border-slate-300 bg-white text-sm font-medium text-slate-700 transition-colors hover:border-inherit hover:bg-slate-700 hover:text-white">
          {getInitials(name!)}
        </AvatarPrimitives.Fallback>
      )}
    </AvatarPrimitives.Root>
  );
}
