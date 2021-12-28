import { useState } from 'react';
import { BiPlus } from 'react-icons/bi';
import { BsImage } from 'react-icons/bs';
import { IoMdLock } from 'react-icons/io';
import { Modal } from '../../components/Modal';

export function NewBoard() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="flex items-center px-3 py-2 text-xs text-white rounded-lg bg-corn-blue"
        onClick={() => setIsOpen(true)}
      >
        <BiPlus className="mr-2 text-sm" />
        Add
      </button>

      <Modal isOpen={isOpen} className="max-w-md" closeModal={() => setIsOpen(false)}>
        <form>
          <div className="rounded-lg bg-corn-blue h-28"></div>
          <input
            className="w-full px-3 py-3 mt-4 text-xs bg-white border rounded-lg shadow-lg border-ash focus:outline-none text-light-pencil"
            placeholder="Add board title"
          />
          <div className="flex justify-between mt-6 font-poppins">
            <button className="flex items-center px-12 py-3 text-xs bg-gray-100 rounded-lg text-gray3">
              <BsImage className="mr-2" />
              Cover
            </button>
            <button className="flex items-center px-12 py-3 text-xs bg-gray-100 rounded-lg text-gray3">
              <IoMdLock className="mr-2" />
              Private
            </button>
          </div>

          <div className="flex justify-end mt-8 font-poppins">
            <button
              className="rounded-lg px-3 py-3 text-[0.625rem] text-gray3 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </button>

            <button
              className="bg-corn-blue flex items-center ml-4 rounded-lg px-3 py-3 text-[0.625rem] text-white"
              type="submit"
            >
              <BiPlus className="mr-2 text-sm" />
              Create
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}
