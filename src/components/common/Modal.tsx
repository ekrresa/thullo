import * as React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from './Button';
import { IoClose } from 'react-icons/io5';

interface ModalProps extends React.PropsWithChildren<unknown> {
  isOpen: boolean;
  closeModal: () => void;
  closeIcon?: boolean;
  className?: string;
}

export function Modal({
  children,
  className,
  closeIcon = false,
  closeModal,
  isOpen,
}: ModalProps) {
  return (
    <Transition show={isOpen} as={React.Fragment} appear>
      <Dialog as="div" className="relative z-10" onClose={closeModal}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-800 opacity-20" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className={`relative mt-24 mb-8 inline-block w-full transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl transition-all ${className}`}
              >
                {closeIcon && (
                  <Button
                    className="absolute -top-2 -right-2 rounded-lg bg-corn-blue p-1 text-white"
                    onClick={closeModal}
                  >
                    <IoClose className="text-xl" />
                  </Button>
                )}
                {children}
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
