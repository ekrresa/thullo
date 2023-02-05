import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { QueryClient, dehydrate } from '@tanstack/react-query'

import { boardsQueryKeys } from '@hooks/board'
import { useProfileStore } from '@stores/profile'
import { Avatar } from '@components/Avatar'
import { LoaderWrapper } from '@components/LoaderWrapper'
import { BoardInvite } from '@components/board/BoardInvite'
import { SideMenu } from '@components/board/SideMenu'
import { VisibilitySwitch } from '@components/board/VisibilitySwitch'
import { useGetBoardDetails } from '@components/board/hooks'
import { IsOwner } from '@components/common/IsOwner'
import { Layout } from '@components/layout'
import { getBoardDetails } from '@lib/api/board'

export default function BoardPage() {
  const router = useRouter()

  const [username, slug] = (router.query.board as string[]) || []

  // const loggedInUser = useUserProfile();
  const currentUser = useProfileStore(state => state.info)
  const boardQuery = useGetBoardDetails(username, slug)

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
              {board && <VisibilitySwitch board={board} />}

              <div className="mx-4 flex items-center gap-4">
                <Avatar
                  image={boardOwner?.member.image ?? ''}
                  name={boardOwner?.member.name ?? ''}
                />

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

              {board && (
                <IsOwner isOwner={boardOwner?.memberId === currentUser?.id}>
                  <BoardInvite board={board} />
                </IsOwner>
              )}
            </div>

            <SideMenu board={board} />
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
    queryFn: async () => getBoardDetails(username, slug),
    staleTime: 1000 * 60 * 5,
  })

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  }
}
