import Image from 'next/image';
import Link from 'next/link';
import { IoMdLock } from 'react-icons/io';

import { Avatar } from '@components/Avatar';
import { ROUTES } from '@lib/constants';
import { Board } from '@models/index';

interface Props {
  board: Board;
}
export function BoardCard({ board }: Props) {
  return (
    <Link
      key={board.id}
      href={ROUTES.board(board.id)}
      className="relative flex flex-col rounded-lg bg-white p-4 shadow transition-transform hover:scale-105"
    >
      {board.visibility === 'PRIVATE' && (
        <span className="absolute right-1 top-1 z-10 rounded-full bg-slate-300 p-1 opacity-60 hover:opacity-90">
          <IoMdLock className="text-xl" />
        </span>
      )}

      <div className="relative h-32 overflow-hidden rounded-md">
        {board.cover ? (
          <div style={{ backgroundColor: board.cover }} className="h-full w-full"></div>
        ) : (
          <Image src={board.image!} priority fill alt="" />
        )}
      </div>
      <p className="mt-2 truncate px-2 text-base font-medium">{board.title}</p>

      <div className="mt-3 flex items-center px-2">
        <Avatar image={board.owner.image} name={board.owner.name} />
      </div>
    </Link>
  );
}
