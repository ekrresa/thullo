import { useEffect } from 'react';

interface LockBodyScrollProps {
  mounted: boolean;
}

export function useLockBodyScroll({ mounted }: LockBodyScrollProps) {
  useEffect(() => {
    if (!window) return;

    const originalStyle = window.getComputedStyle(document.body).overflow;

    if (mounted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalStyle;
    }

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, [mounted]);
}
