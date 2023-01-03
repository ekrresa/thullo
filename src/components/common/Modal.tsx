import * as React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { IoClose } from 'react-icons/io5';

import { Button } from './Button';
import { cn } from '@lib/utils';

interface ModalProps extends React.PropsWithChildren<unknown> {
  open?: boolean;
  trigger: React.ReactNode;
  closeIcon?: boolean;
  className?: string;
}
export function Modal(props: ModalProps) {
  const { children, className, closeIcon = false, open, trigger } = props;

  return (
    <Dialog.Root open={open}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 cursor-pointer bg-gray-800/60" />

        <Dialog.Content
          className={cn(
            'fixed top-[50%] left-[50%] w-full -translate-x-1/2 -translate-y-1/2 rounded bg-white p-6 shadow',
            className
          )}
        >
          {closeIcon && (
            <Dialog.Close asChild>
              <Button className="absolute top-1 right-1" aria-label="Close">
                <IoClose className="text-xl" />
              </Button>
            </Dialog.Close>
          )}

          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
