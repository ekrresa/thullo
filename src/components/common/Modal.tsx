import { Fragment, PropsWithChildren } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Button } from './Button';
import { IoClose } from 'react-icons/io5';

interface ModalProps extends PropsWithChildren<unknown> {
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        className="fixed inset-0 z-10 flex items-baseline justify-center overflow-y-auto "
        onClose={closeModal}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Dialog.Overlay className="fixed inset-0 bg-gray-800 opacity-20" />
        </Transition.Child>

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div
            className={`inline-block relative w-full p-6 mt-24 mb-8 overflow-hidden transition-all transform bg-white shadow-xl rounded-2xl ${className}`}
          >
            {closeIcon && (
              <Button
                className="absolute p-1 text-white rounded-lg -top-2 -right-2 bg-corn-blue"
                onClick={closeModal}
              >
                <IoClose className="text-xl" />
              </Button>
            )}
            {children}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
