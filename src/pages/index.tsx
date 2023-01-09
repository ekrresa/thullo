import * as React from 'react';

import { Layout } from '../components/Layout';
import { NewBoard } from '../components/modules/Board/NewBoard';
import { useFetchBoards } from '@hooks/board';
import { LoaderWrapper } from '@components/LoaderWrapper';
import { useGetCurrentUser } from '@hooks/user';
import { BoardCard } from '@components/modules/Board/BoardCard';

export default function Home() {
  const boardsResult = useFetchBoards();
  const userProfile = useGetCurrentUser({ requireAuth: false });

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg text-astronaut-900">All Boards</h2>

        {Boolean(userProfile) && <NewBoard />}
      </header>

      <LoaderWrapper
        loading={boardsResult.isLoading}
        onRetryClick={boardsResult.refetch}
        errorMessage={boardsResult.error}
        loaderContent={
          <div className="mt-8 grid grid-cols-list gap-x-8 gap-y-6 bg-gray-50 p-4">
            {new Array(6).fill(true).map((_, index) => (
              <div
                key={index}
                className="h-52 animate-pulse overflow-hidden rounded-lg bg-slate-200 shadow-none"
              ></div>
            ))}
          </div>
        }
      >
        <div className="mt-8 grid grid-cols-list gap-x-8 gap-y-6 rounded-lg bg-gray-50 p-5">
          {boardsResult.boards && boardsResult.boards.length > 0 ? (
            boardsResult.boards.map(board => <BoardCard key={board.id} board={board} />)
          ) : (
            <div>There are no boards right now. Why not create one!</div>
          )}
        </div>
      </LoaderWrapper>
    </section>
  );
}

Home.getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>;
