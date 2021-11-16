import { Fragment, PropsWithChildren, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';

interface ModalProps extends PropsWithChildren<unknown> {
  isOpen: boolean;
  closeModal: () => void;
}

export function Modal({ children, closeModal, isOpen }: ModalProps) {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        className="fixed flex justify-center items-baseline inset-0 z-10 overflow-y-auto"
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
          <Dialog.Overlay className="bg-gray-800 opacity-20 fixed inset-0" />
        </Transition.Child>

        {/* This element is to trick the browser into centering the modal contents. */}
        {/* <span className="inline-block h-screen align-middle" aria-hidden="true">
          &#8203;
        </span> */}

        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="inline-block w-full max-w-md p-6 mb-8 mt-24 overflow-hidden transition-all transform bg-white shadow-xl rounded-2xl">
            {children}
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
}
