import * as React from 'react';

interface Props extends React.PropsWithChildren<unknown> {
  isOwner: boolean;
  fallback?: React.ReactNode;
}

export function IsOwner({ isOwner, children, fallback }: Props) {
  if (isOwner) {
    return <>{children}</>;
  }

  if (fallback && !isOwner) {
    return <>{fallback}</>;
  }

  return null;
}
