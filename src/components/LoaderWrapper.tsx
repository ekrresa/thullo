import * as React from 'react';
import { Button } from './common/Button';
import { Spinner } from './common/Spinner';
import { cn } from '@lib/utils';

interface Props extends React.ComponentProps<'div'> {
  loading: boolean;
  loaderContent?: React.ReactNode;
  errorMessage?: string;
  onRetryClick: () => void;
}
export function LoaderWrapper(props: Props) {
  const {
    loading,
    errorMessage,
    onRetryClick,
    children,
    loaderContent,
    className,
    ...otherProps
  } = props;

  if (!loading && !errorMessage) {
    return <>{children}</>;
  }

  return (
    <div {...otherProps} className={cn('min-h-max', className)}>
      {/* Loading section */}
      {loading && React.isValidElement(loaderContent) && loaderContent}

      {loading && !React.isValidElement(loaderContent) && (
        <div className="min-h-min text-center">
          <Spinner className="text-3xl text-astronaut-500" />
        </div>
      )}

      {/* Error section */}
      {Boolean(errorMessage) && (
        <div className="flex flex-col">
          <p className="text-center text-sm text-roman-500">{errorMessage}</p>
          <Button aria-label="Retry request" onClick={onRetryClick} variant="primary">
            Try Again
          </Button>
        </div>
      )}
    </div>
  );
}
