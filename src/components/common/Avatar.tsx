import * as React from 'react';
import Image from 'next/image';
import { getInitials } from '@lib/utils';

interface AvatarProps {
  image?: string;
  name: string;
}
export function Avatar(props: AvatarProps) {
  if (props.image) {
    return (
      <div className="relative h-full w-full">
        <Image src={props.image} fill alt="" unoptimized />
      </div>
    );
  }

  return (
    <div className="grid h-full w-full place-items-center bg-corn-blue px-1 py-1 uppercase text-white">
      {getInitials(props.name)}
    </div>
  );
}
