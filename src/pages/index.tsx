import * as React from 'react';
import Image from 'next/legacy/image';
import Link from 'next/link';
import { IoMdLock } from 'react-icons/io';

import { Layout } from '../components/Layout';
import { NewBoard } from '../components/modules/Board/NewBoard';
import { useFetchBoards } from '@hooks/board';
import { getCloudinaryUrl } from '@lib/utils';
import { ROUTES } from '@lib/constants';
import { Avatar } from '@components/common/Avatar';

export default function Home() {
  const boards = useFetchBoards();

  return (
    <section className="mx-auto mt-16 max-w-5xl px-4">
      <div className="flex items-center justify-between">
        <h2 className="text-pencil">All Boards</h2>

        <NewBoard />
      </div>

      {boards.isLoading ? (
        <div className="mt-10 text-center">Loading...</div>
      ) : boards.isError ? (
        <div className="mt-10 text-center">An error occurred while fetching boards</div>
      ) : boards.data && boards.data.length > 0 ? (
        <div className="mt-10 grid grid-cols-list gap-x-8 gap-y-6 pb-32">
          {boards.data.map((board: any) => (
            <Link
              key={board.id}
              href={ROUTES.board(board.id)}
              passHref
              className="relative flex flex-col rounded-lg shadow"
            >
              {board.visibility === 'private' && (
                <span className="absolute right-1 top-1 z-10 rounded-full bg-slate-300 p-1 opacity-60 hover:opacity-90">
                  <IoMdLock className="text-xl" />
                </span>
              )}
              <div className="relative h-32 overflow-hidden rounded-t-lg">
                {board.cover ? (
                  <div
                    style={{ backgroundColor: board.cover }}
                    className="h-full w-full"
                  ></div>
                ) : (
                  <Image
                    src={getCloudinaryUrl(board.image_id, board.image_version)}
                    layout="fill"
                    alt=""
                  />
                )}
              </div>
              <p className="mt-2 truncate px-3 text-sm">{board.title}</p>
              <div className="flex items-center px-3 pb-3">
                <div className="relative mt-3 mr-3 h-7 w-7 overflow-hidden rounded-xl">
                  {/* <Avatar
                    imageId={board.owner.image_id}
                    imageVersion={board.owner.image_version}
                    name={board.owner.name}
                  /> */}
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center">There are no boards right now.</div>
      )}
    </section>
  );
}

Home.getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;
