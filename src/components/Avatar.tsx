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
        <AvatarPrimitives.Fallback className="flex h-full w-full items-center justify-center bg-white font-medium text-astronaut-900">
          {getInitials(name!)}
        </AvatarPrimitives.Fallback>
      )}
    </AvatarPrimitives.Root>
  );
}
