import { ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { IoMdLock } from 'react-icons/io';

import { Layout } from '../components/common/Layout';
import { NewBoard } from '../components/modules/Board/NewBoard';
import { useFetchBoards } from '@hooks/board';
import { getCloudinaryUrl, getInitials } from '@lib/utils';

export default function Home() {
  const boards = useFetchBoards();

  return (
    <section className="max-w-5xl px-4 mx-auto mt-16">
      <div className="flex items-center justify-between">
        <h2 className="text-pencil">All Boards</h2>

        <NewBoard />
      </div>

      {boards.isLoading ? (
        <div className="mt-10 text-center">Loading...</div>
      ) : boards.isError ? (
        <div className="mt-10 text-center">An error occurred while fetching boards</div>
      ) : boards.data && boards.data.length > 0 ? (
        <div className="grid mt-10 gap-x-8 gap-y-6 grid-cols-list">
          {boards.data.map(board => (
            <Link key={board.id} href={`/board/${board.id}`} passHref>
              <a className="relative flex flex-col rounded-lg shadow">
                {board.visibility === 'private' && (
                  <span className="absolute z-10 p-1 rounded-full opacity-60 right-1 top-1 bg-slate-300 hover:opacity-90">
                    <IoMdLock className="text-xl" />
                  </span>
                )}
                <div className="relative h-32 overflow-hidden rounded-t-lg">
                  {board.cover ? (
                    <div
                      style={{ backgroundColor: board.cover }}
                      className="w-full h-full"
                    ></div>
                  ) : (
                    <Image
                      src={getCloudinaryUrl(board.image_id, board.image_version)}
                      layout="fill"
                      alt=""
                    />
                  )}
                </div>
                <p className="px-3 mt-2 text-sm truncate">{board.title}</p>
                <div className="flex items-center px-3 pb-3">
                  <div className="relative mt-3 mr-3 overflow-hidden rounded-lg w-7 h-7">
                    {board.owner.image_id ? (
                      <Image
                        src={getCloudinaryUrl(
                          board.owner.image_id,
                          board.owner.image_version
                        )}
                        layout="fill"
                        alt="board owner"
                      />
                    ) : (
                      getInitials(board.owner.name)
                    )}
                  </div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10 text-center">There are no boards right now.</div>
      )}
    </section>
  );
}

Home.getLayout = (page: ComponentType) => <Layout>{page}</Layout>;
Home.protected = true;
