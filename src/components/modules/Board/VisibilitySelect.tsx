import * as React from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { Button } from '@components/common/Button';
import { IoMdGlobe, IoMdLock } from 'react-icons/io';

interface VisibilitySelectProps {
  getVisibility: (input: any) => void;
  value: any;
}

export function VisibilitySelect({ getVisibility, value }: VisibilitySelectProps) {
  return (
    <Listbox value={value} onChange={val => getVisibility(val)}>
      <div className="relative">
        <Button
          className="mb-4 w-full bg-gray-50 px-12 py-2.5 text-gray3 shadow-sm hover:bg-astronaut-100"
          variant="secondary"
          fullWidth
        >
          {value === 'private' ? (
            <IoMdLock className="mr-2" />
          ) : (
            <IoMdGlobe className="mr-2" />
          )}
          {value}
        </Button>

        <Transition
          as={React.Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute mt-2 w-full overflow-hidden rounded-lg bg-white shadow-lg focus:outline-none sm:text-sm">
            <Listbox.Option
              as={Button}
              className="w-full px-3 py-2 hover:bg-gray-100"
              value="public"
            >
              Public
            </Listbox.Option>
            <Listbox.Option
              as={Button}
              className="w-full px-3 py-2 hover:bg-gray-100"
              value="private"
            >
              Private
            </Listbox.Option>
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
