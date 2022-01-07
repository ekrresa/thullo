import { ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { Layout } from '../components/common/Layout';
import { NewBoard } from '../components/modules/Board/NewBoard';
import { useFetchBoards } from '@hooks/board';
import { getCloudinaryUrl } from '@lib/utils';

export default function Home() {
  const boards = useFetchBoards();

  return (
    <section className="max-w-5xl px-4 mx-auto mt-16">
      <div className="flex items-center justify-between">
        <h2 className="text-pencil">All Boards</h2>

        <NewBoard />
      </div>

      {boards.isLoading ? (
        <div className="text-center">Loading...</div>
      ) : boards.isError ? (
        <div className="text-center">An error occurred while fetching boards</div>
      ) : boards.data?.body && boards.data.body.length > 0 ? (
        <div className="grid mt-10 gap-x-8 gap-y-6 grid-cols-list">
          {boards.data!.body!.map(board => (
            <Link key={board.id} href={`/board/${board.id}`} passHref>
              <a className="flex flex-col rounded-lg shadow">
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
                  <div className="mt-3 mr-3 rounded-lg w-7 h-7 bg-corn-blue"></div>
                  <div className="mt-3 mr-3 rounded-lg w-7 h-7 bg-corn-blue"></div>
                  <div className="mt-3 mr-3 rounded-lg w-7 h-7 bg-corn-blue"></div>
                </div>
              </a>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center">There are no boards right now.</div>
      )}
    </section>
  );
}

Home.getLayout = (page: ComponentType) => <Layout>{page}</Layout>;
Home.protected = true;
