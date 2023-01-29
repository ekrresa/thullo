import * as React from 'react'

import { useFetchBoards } from '@hooks/board'
import { useAuth } from '@hooks/user'
import { Layout } from '@components/Layout'
import { LoaderWrapper } from '@components/LoaderWrapper'
import { BoardCard } from '@components/board/BoardCard'
import { NewBoard } from '@components/board/NewBoard'

export default function Home() {
  const boardsResult = useFetchBoards()
  const isAuthenticated = useAuth()

  return (
    <section className="mx-auto mt-16 max-w-6xl px-4">
      <header className="flex items-center justify-between">
        <h2 className="text-lg text-astronaut-900">All Boards</h2>

        {isAuthenticated && <NewBoard />}
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
        {boardsResult.boards && boardsResult.boards.length > 0 ? (
          <div className="mt-8 grid grid-cols-list gap-x-8 gap-y-6 rounded-lg bg-gray-50 p-5">
            {boardsResult.boards.map(board => (
              <BoardCard key={board.id} board={board} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-lg bg-gray-50 p-5 text-center">
            There are no boards right now. Why not create one!
          </div>
        )}
      </LoaderWrapper>
    </section>
  )
}

Home.getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>
