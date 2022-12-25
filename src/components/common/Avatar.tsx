import * as React from 'react';
import Image from "next/legacy/image";
import { getInitials, profileCloudinaryUrl } from '@lib/utils';

type AvatarProps =
  | { name: string }
  | { imageId: string | null; imageVersion: string | null };

export function Avatar(props: AvatarProps) {
  if ('imageId' in props && props.imageId && props.imageVersion) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={profileCloudinaryUrl(props.imageId, props.imageVersion)}
          layout="fill"
          alt=""
          unoptimized
        />
      </div>
    );
  }

  return (
    <div className="grid w-full h-full px-1 py-1 text-white uppercase place-items-center bg-corn-blue">
      {/* @ts-expect-error */}
      {getInitials(props.name)}
    </div>
  );
}
