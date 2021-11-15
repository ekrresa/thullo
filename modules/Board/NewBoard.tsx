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
        className="bg-corn-blue flex items-center text-white text-xs rounded-lg px-3 py-2"
        onClick={() => setIsOpen(true)}
      >
        <BiPlus className="mr-2 text-sm" />
        Add
      </button>

      <Modal isOpen={isOpen} closeModal={() => setIsOpen(false)}>
        <form>
          <div className="bg-corn-blue h-28 rounded-lg"></div>
          <input
            className="bg-white border border-ash w-full focus:outline-none mt-4 px-3 py-3 rounded-lg text-xs text-light-pencil shadow-lg"
            placeholder="Add board title"
          />
          <div className="flex font-poppins justify-between mt-6">
            <button className="bg-gray-100 flex items-center rounded-lg px-12 py-3 text-xs text-gray3">
              <BsImage className="mr-2" />
              Cover
            </button>
            <button className="bg-gray-100 flex items-center rounded-lg px-12 py-3 text-xs text-gray3">
              <IoMdLock className="mr-2" />
              Private
            </button>
          </div>

          <div className="flex font-poppins justify-end mt-8">
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
