import * as React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { IoClose, IoEllipsisHorizontalSharp, IoMenu } from 'react-icons/io5'

import { Button } from '@components/common/Button'

interface Props extends React.PropsWithChildren<unknown> {}
export default function SideMenuDrawer(props: Props) {
  const { children } = props

  const [isModalOpen, toggleOpen] = React.useState(false)
  const initialFocusRef = React.useRef(null)

  const handleModalState = () => toggleOpen(open => !open)

  return (
    <>
      <Button
        className="relative rounded-lg px-4 py-2 text-sm text-slate-500 ring-1 ring-black/5"
        onClick={handleModalState}
      >
        <IoEllipsisHorizontalSharp className="mr-2 hidden sm:inline" />
        <span className="hidden sm:inline">Show Menu</span>
        <IoMenu className="text-lg sm:hidden" />
      </Button>

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
                enterFrom="opacity-0 translate-x-full"
                enterTo="translate-x-0 opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-x-0"
                leaveTo="translate-x-full opacity-0"
              >
                <Dialog.Panel
                  className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-popover ring-1 ring-black/5"
                  ref={initialFocusRef}
                >
                  <Button
                    className="absolute top-3 right-4 flex h-8 w-8 items-center justify-center rounded-full p-0 text-astronaut-700 shadow"
                    aria-label="Close"
                    onClick={handleModalState}
                  >
                    <IoClose className="text-lg" />
                  </Button>

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
