import { Fragment, useState } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { IoMdGlobe, IoMdLock } from 'react-icons/io';

const list = [
  {
    value: 'public',
    text: (
      <div className="p-4 rounded-lg cursor-pointer hover:bg-off-white">
        <div className="flex items-center">
          <IoMdGlobe className="mr-2" />
          <span className="font-medium text-gray4">Public</span>
        </div>
        <p className="text-xs font-light text-gray3 whitespace-nowrap">
          Anyone on the internet can see this.
        </p>
      </div>
    ),
  },
  {
    value: 'private',
    text: (
      <div className="p-4 rounded-lg cursor-pointer hover:bg-off-white">
        <div className="flex items-center">
          <IoMdLock className="mr-2" />
          <span className="font-medium text-gray4">Private</span>
        </div>
        <p className="text-xs font-light text-gray3 whitespace-nowrap">
          Only board members can see this.
        </p>
      </div>
    ),
  },
];

export function VisibilitySwitch() {
  const [selected, setSelected] = useState(list[0].value);

  return (
    <Listbox value={selected} onChange={val => setSelected(val)}>
      <div className="relative mt-1 font-poppins">
        <Listbox.Button className="relative w-full px-4 py-2 rounded-lg cursor-pointer bg-off-white sm:text-sm text-gray3">
          <span className="flex items-center capitalize">
            {selected === 'private' ? (
              <IoMdLock className="mr-2" />
            ) : (
              <IoMdGlobe className="mr-2" />
            )}
            {selected}
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute p-4 mt-2 overflow-auto bg-white rounded-lg shadow-lg focus:outline-none sm:text-sm">
            <div className="mb-4">
              <h3 className="font-medium mb-1 text-[1.025rem] text-gray4">Visibility</h3>
              <p className="text-xs font-light text-gray3 whitespace-nowrap">
                Choose who can see this board.
              </p>
            </div>
            {list.map((item, itemIdx) => (
              <Listbox.Option
                key={itemIdx}
                className={({ active }) =>
                  `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                          cursor-default select-none relative py-2`
                }
                value={item.value}
              >
                {({ selected, active }) => (
                  <>
                    <span className={`${selected ? 'font-medium' : 'font-normal'} block`}>
                      {item.text}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}
