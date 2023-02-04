import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { QueryClient, dehydrate } from '@tanstack/react-query'

import { boardsQueryKeys, useGetSingleBoard } from '@hooks/board'
import { Avatar } from '@components/Avatar'
import { LoaderWrapper } from '@components/LoaderWrapper'
import { Layout } from '@components/layout'
import { VisibilitySwitch } from '@components/modules/Board/VisibilitySwitch'

export default function BoardPage() {
  const router = useRouter()

  const [username, slug] = (router.query.board as string[]) || []

  // const loggedInUser = useUserProfile();
  const boardQuery = useGetSingleBoard(username, slug)

  const board = boardQuery.board
  const boardOwner = board?.members.find(member => member.isOwner)

  return (
    <LoaderWrapper
      loading={boardQuery.isLoading}
      errorMessage={boardQuery.error}
      onRetryClick={boardQuery.refetch}
    >
      {board && (
        <section className="container relative mt-9 h-[95%] overflow-hidden">
          {/* <CardDetails boardOwner={board.data.owner.id} members={board.data.members} /> */}

          <div className="flex justify-between">
            <div className="flex items-center">
              {board && (
                <VisibilitySwitch
                  boardId={board.id}
                  boardOwner={username}
                  visibility={board.visibility}
                />
              )}

              <div className="mx-4 flex items-center space-x-4">
                <div className="relative h-9 w-9 overflow-hidden rounded-xl">
                  <Avatar
                    image={boardOwner?.member.image ?? ''}
                    name={boardOwner?.member.name ?? ''}
                  />
                </div>

                {/* {boardMembers.data &&
                  boardMembers.data.map(user => (
                    <div
                      key={user.id}
                      className="relative h-9 w-9 overflow-hidden rounded-xl bg-corn-blue"
                    >
                      <Avatar image={user.image_id} name={user.name} />
                    </div>
                  ))} */}
              </div>

              {/* {board.data && (
                <IsOwner isOwner={board.data.owner.id === loggedInUser.data?.id}>
                  <BoardInvite board={board.data} members={boardMembers.data ?? []} />
                </IsOwner>
              )} */}
            </div>

            {/* <SideMenu board={board} members={boardMembers.data ?? []} /> */}
          </div>

          {/* <DragDropContext onDragEnd={handleDragEnd}>
            <section className="mt-6 flex h-[93%] items-start space-x-12 overflow-x-auto rounded-xl bg-off-white2 p-4">
              <Droppable
                droppableId="lists"
                type="LIST"
                direction="horizontal"
                isDropDisabled={!interactWithBoard}
              >
                {provided => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex h-full items-start space-x-12 p-4"
                  >
                    {lists.data && (
                      <InnerList
                        list={lists.data}
                        boardOwner={board.data.owner.id}
                        members={board.data.members}
                      />
                    )}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              {lists.data && (
                <div className="py-4 pr-3">
                  <AddNewItem
                    text="Add new list"
                    submitAction={addNewList}
                    isDisabled={!interactWithBoard}
                    onSuccessCallback={data => {
                      queryClient.setQueryData(
                        boardsQueryKeys.boardLists(board.data.id),
                        (oldData: any) => {
                          return [...oldData, data];
                        }
                      );
                    }}
                  />
                </div>
              )}
            </section>
          </DragDropContext> */}
        </section>
      )}
    </LoaderWrapper>
  )
}

BoardPage.getLayout = (page: React.ReactNode) => <Layout>{page}</Layout>

export const getServerSideProps: GetServerSideProps = async context => {
  const queryClient = new QueryClient()

  const [username, slug] = context.query.board as string[]

  await queryClient.prefetchQuery({
    queryKey: boardsQueryKeys.board(username, slug),
    staleTime: 1000 * 60 * 5,
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
