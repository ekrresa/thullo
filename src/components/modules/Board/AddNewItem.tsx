import * as React from 'react';
import { BiPlus } from 'react-icons/bi';
import { IoClose } from 'react-icons/io5';
import { toast } from 'react-hot-toast';
import { useMutation } from 'react-query';
import { useFormik } from 'formik';
import { Button } from '@components/common/Button';

interface AddNewItemProps {
  text: string;
  submitAction: (title: string) => any;
  onSuccessCallback: (data: any) => void;
  isDisabled?: boolean;
}

export function AddNewItem({
  isDisabled,
  text,
  onSuccessCallback,
  submitAction,
}: AddNewItemProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [showInput, toggleInput] = React.useState(false);
  const newItemMutation = useMutation((data: any) => submitAction(data.title as string));

  React.useEffect(() => {
    if (showInput) {
      inputRef.current?.focus();
    }
  }, [showInput]);

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
    <div className="min-w-[17rem] max-w-[20rem] flex-grow">
      {showInput ? (
        <form className="rounded-lg bg-off-white p-2" onSubmit={formik.handleSubmit}>
          <input
            className="block w-full rounded px-3 py-2 text-sm text-gray-600 focus:outline-none"
            placeholder="Enter a title..."
            name="title"
            ref={inputRef}
            onChange={formik.handleChange}
            value={formik.values.title}
          />
          <div className="mt-2 flex items-center">
            <Button
              className="rounded bg-corn-blue px-3 py-1 text-xs text-white"
              type="submit"
              disabled={newItemMutation.isLoading}
              loading={newItemMutation.isLoading}
            >
              {text}
            </Button>
            <IoClose
              className="ml-2 cursor-pointer text-2xl"
              color="#4F4F4F"
              onClick={() => toggleInput(false)}
            />
          </div>
        </form>
      ) : (
        <Button
          className="flex w-full justify-between rounded-lg bg-off-white3 px-3 py-2 text-corn-blue"
          onClick={() => toggleInput(true)}
          disabled={isDisabled}
        >
          <span className="text-[0.8rem]">{text}</span>
          <BiPlus className="text-xl" color="#2F80ED" />
        </Button>
      )}
    </div>
  );
}
