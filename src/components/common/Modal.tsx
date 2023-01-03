import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { IoClose } from 'react-icons/io5';

import { Button } from './Button';
import { cn } from '@lib/utils';

interface ModalProps extends React.PropsWithChildren<unknown> {
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  closeIcon?: boolean;
  className?: string;
}
export function Modal(props: ModalProps) {
  const { children, className, closeIcon = false, open, onOpenChange, trigger } = props;

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 cursor-pointer bg-gray-800/60" />

        <Dialog.Content
          className={cn(
            'fixed top-[50%] left-[50%] w-full -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow',
            className
          )}
        >
          {closeIcon && (
            <Dialog.Close asChild>
              <Button
                className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full p-0 text-astronaut-700 hover:bg-slate-100"
                aria-label="Close"
              >
                <IoClose className="text-lg" />
              </Button>
            </Dialog.Close>
          )}

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
