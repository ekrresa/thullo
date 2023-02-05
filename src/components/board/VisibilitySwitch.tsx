import * as React from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { IoMdGlobe, IoMdLock } from 'react-icons/io'

import { useUpdateBoard } from '@components/board/hooks'
import { Button } from '@components/common/Button'
import { cn } from '@lib/utils'
import { BoardWithMembers } from '@models/index'

interface Props {
  board: BoardWithMembers
}
export function VisibilitySwitch(props: Props) {
  const { board } = props
  const { slug, id, visibility } = board

  const ownerUsername =
    board.members.find(member => member.isOwner)?.member.username ?? ''

  const { updateBoard, updatingBoard } = useUpdateBoard(ownerUsername, slug)

  return (
    <Listbox
      value={visibility}
      onChange={val => updateBoard({ boardId: id, payload: { visibility: val } })}
      disabled={updatingBoard}
    >
      <div className="relative">
        <Listbox.Button
          as={Button}
          className="relative w-full rounded-lg px-4 py-2 text-sm text-slate-700 ring-1 ring-black/5"
          loading={updatingBoard}
        >
          <span className="flex items-center uppercase ">
            {visibility === 'PRIVATE' ? (
              <IoMdLock className="mr-2" />
            ) : (
              <IoMdGlobe className="mr-2" />
            )}
            {visibility}
          </span>
        </Listbox.Button>

        <Transition
          as={React.Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 -translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 -translate-y-1"
        >
          <Listbox.Options className="absolute z-40 mt-2 overflow-auto rounded-lg bg-white p-4 shadow-popover ring-1 ring-black/5 sm:text-sm">
            <div className="mb-4">
              <h3 className="mb-1 font-semibold text-slate-600">Visibility</h3>
              <p className="whitespace-nowrap text-xs text-slate-500">
                Choose who can see this board.
              </p>
            </div>

            <Listbox.Option className="mb-2" value="PUBLIC">
              {({ selected }) => (
                <div
                  className={cn(
                    'cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-50',
                    selected ? 'bg-gray-100' : ''
                  )}
                >
                  <div className="mb-2 flex items-center">
                    <IoMdGlobe className="mr-2" />
                    <span className="font-medium text-astronaut-700">Public</span>
                  </div>
                  <p className="whitespace-nowrap text-xs text-slate-500">
                    Anyone on the internet can see this.
                  </p>
                </div>
              )}
            </Listbox.Option>

            <Listbox.Option value="PRIVATE">
              {({ selected }) => (
                <div
                  className={cn(
                    'cursor-pointer rounded-lg px-4 py-2 hover:bg-gray-50',
                    selected ? 'bg-gray-100' : ''
                  )}
                >
                  <div className="mb-2 flex items-center">
                    <IoMdLock className="mr-2" />
                    <span className="font-medium text-astronaut-700">Private</span>
                  </div>
                  <p className="whitespace-nowrap text-xs text-slate-500">
                    Only board members can see this.
                  </p>
                </div>
              )}
            </Listbox.Option>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
