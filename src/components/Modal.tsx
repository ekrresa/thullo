import * as React from 'react'
import { Transition } from '@headlessui/react'
import * as Dialog from '@radix-ui/react-dialog'
import { IoClose } from 'react-icons/io5'

import { cn } from '@lib/utils'
import { Button } from './common/Button'

interface ModalProps extends React.PropsWithChildren<unknown> {
  trigger?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  closeIcon?: boolean
  className?: string
}
export function Modal(props: ModalProps) {
  const { children, className, closeIcon = false, open, onOpenChange, trigger } = props

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {React.isValidElement(trigger) && (
        <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      )}

      <Dialog.Portal forceMount>
        <Transition.Root show={open}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 cursor-pointer bg-gray-800/60" />
          </Transition.Child>

          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Content
              className={cn(
                'absolute top-1/2 left-1/2 w-full -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-6 shadow focus:outline-none focus-visible:ring focus-visible:ring-brand-500 focus-visible:ring-opacity-75',
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
          </Transition.Child>
        </Transition.Root>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
