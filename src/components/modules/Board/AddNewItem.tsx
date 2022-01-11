import * as React from 'react';
import { BiPlus } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useMutation, useQueryClient } from 'react-query';
import { useFormik } from 'formik';
import { Button } from '@components/common/Button';

interface AddNewItemProps {
  text: string;
  submitAction: (title: string) => any;
  onSuccessCallback: (data: any) => void;
}

export function AddNewItem({ text, onSuccessCallback, submitAction }: AddNewItemProps) {
  const queryClient = useQueryClient();
  const [showInput, toggleInput] = React.useState(false);
  const newItemMutation = useMutation((data: any) => submitAction(data.title as string));

  const formik = useFormik({
    initialValues: { title: '' },
    onSubmit: (values, { resetForm }) => {
      if (!values.title) {
        toast.error('title is required');
        return;
      }

      newItemMutation.mutate(
        { title: values.title },
        {
          onSuccess: data => {
            onSuccessCallback(data);
            resetForm();
          },
        }
      );
    },
  });

  return (
    <div className="flex-grow max-w-[20rem] min-w-[17rem]">
      {showInput ? (
        <form className="p-2 rounded-lg bg-off-white" onSubmit={formik.handleSubmit}>
          <input
            className="block w-full px-3 py-2 text-sm text-gray-600 rounded focus:outline-none"
            placeholder="Enter a title..."
            name="title"
            onChange={formik.handleChange}
            value={formik.values.title}
          />
          <div className="flex items-center mt-2">
            <Button
              className="px-3 py-1 text-xs text-white rounded bg-corn-blue"
              type="submit"
              disabled={newItemMutation.isLoading}
              loading={newItemMutation.isLoading}
            >
              {text}
            </Button>
            <IoClose
              className="ml-2 text-2xl cursor-pointer"
              color="#4F4F4F"
              onClick={() => toggleInput(false)}
            />
          </div>
        </form>
      ) : (
        <Button
          className="flex justify-between w-full px-3 py-2 rounded-lg bg-off-white3 text-corn-blue"
          onClick={() => toggleInput(true)}
        >
          <span className="text-[0.8rem]">{text}</span>
          <BiPlus className="text-xl" color="#2F80ED" />
        </Button>
      )}
    </div>
  );
}
