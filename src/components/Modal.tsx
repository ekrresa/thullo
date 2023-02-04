import * as React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { IoClose } from 'react-icons/io5'

import { cn } from '@lib/utils'
import { Button } from './common/Button'

interface ModalProps extends React.PropsWithChildren<unknown> {
  trigger?: React.ReactNode
  isOpen?: boolean
  className?: string
  onClose?: (modalState: boolean) => void
  showCloseIcon?: boolean
}
export function Modal(props: ModalProps) {
  const {
    children,
    className,
    showCloseIcon = true,
    isOpen = false,
    trigger,
    onClose,
  } = props

  const initialFocusRef = React.useRef(null)

  const [isModalOpen, toggleOpen] = React.useState(isOpen)

  React.useEffect(() => {
    toggleOpen(isOpen)
  }, [isOpen])

  const handleModalState = () => {
    setTimeout(() => {
      onClose?.(!isModalOpen)
    }, 1000)

    toggleOpen(open => !open)
  }

  return (
    <>
      {React.cloneElement(trigger as React.ReactElement<any>, {
        onClick: handleModalState,
      })}

      <Transition appear show={isModalOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative"
          initialFocus={initialFocusRef}
          onClose={handleModalState}
        >
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
                <Dialog.Panel
                  className={cn(
                    'absolute w-full rounded-lg bg-white p-6 shadow focus:outline-none focus-visible:ring focus-visible:ring-brand-500 focus-visible:ring-opacity-75',
                    className
                  )}
                  ref={initialFocusRef}
                >
                  {showCloseIcon && (
                    <Button
                      className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full p-0 text-astronaut-700 hover:bg-slate-100"
                      aria-label="Close"
                      onClick={handleModalState}
                    >
                      <IoClose className="text-lg" />
                    </Button>
                  )}

                  {children}
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}
