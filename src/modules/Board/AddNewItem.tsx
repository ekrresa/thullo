import * as React from 'react';
import { BiPlus } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';

interface AddNewItemProps {
  text: string;
}

export function AddNewItem({ text }: AddNewItemProps) {
  const [showInput, toggleInput] = React.useState(false);

  return (
    <div className="flex-grow max-w-[20rem] min-w-[17rem]">
      {showInput ? (
        <form className="p-2 mt-4 rounded-lg bg-off-white">
          <input
            className="block w-full px-3 py-2 text-sm text-gray-600 rounded focus:outline-none"
            placeholder="Enter a title..."
          />
          <div className="flex items-center mt-2">
            <button className="px-3 py-1 text-xs text-white rounded bg-corn-blue">
              {text}
            </button>
            <IoClose
              className="ml-2 text-2xl cursor-pointer"
              color="#4F4F4F"
              onClick={() => toggleInput(false)}
            />
          </div>
        </form>
      ) : (
        <button
          className="flex justify-between w-full px-3 py-2 mt-4 rounded-lg bg-off-white3 text-corn-blue"
          onClick={() => toggleInput(true)}
        >
          <span className="text-[0.8rem]">{text}</span>
          <BiPlus className="text-xl" color="#2F80ED" />
        </button>
      )}
    </div>
  );
}
