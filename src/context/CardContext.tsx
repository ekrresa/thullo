import * as React from 'react';

type CardInfo = { id: number; board_id: number; list_id: number; listTitle: string };

interface ICardContext {
  openCardModal: boolean;
  cardInfo: CardInfo;
  handleCardInfo: (cardInfo: CardInfo) => void;
  handleCardModal: () => void;
}

const CardContext = React.createContext<ICardContext>({
  cardInfo: { id: 0, board_id: 0, list_id: 0, listTitle: '' },
  handleCardInfo: () => {},
  openCardModal: false,
  handleCardModal: () => {},
});

export function CardProvider({ children }: React.PropsWithChildren<unknown>) {
  const [isCardModalOpen, setIsCardModalOpen] = React.useState(false);
  const [cardInfo, setCardInfo] = React.useState({
    id: 0,
    board_id: 0,
    list_id: 0,
    listTitle: '',
  });

  const handleCardInfo = React.useCallback((info: CardInfo) => setCardInfo(info), []);
  const handleCardModalState = React.useCallback(() => {
    setIsCardModalOpen(state => !state);
  }, []);

  return (
    <CardContext.Provider
      value={{
        cardInfo,
        handleCardInfo,
        handleCardModal: handleCardModalState,
        openCardModal: isCardModalOpen,
      }}
    >
      {children}
    </CardContext.Provider>
  );
}

export function useCardContext() {
  const cardContext = React.useContext(CardContext);

  if (cardContext === undefined) {
    throw new Error('Component is not within CardProvider');
  }

  return cardContext;
}
