import * as React from 'react';

type CardInfo = { id: number; listTitle: string };

interface ICardContext {
  openCardModal: boolean;
  cardInfo: CardInfo;
  handleCardInfo: (cardInfo: CardInfo) => void;
  handleCardModal: () => void;
}

const CardContext = React.createContext<ICardContext>({
  cardInfo: { id: 0, listTitle: '' },
  handleCardInfo: () => {},
  openCardModal: false,
  handleCardModal: () => {},
});

export function CardProvider({ children }: React.PropsWithChildren<unknown>) {
  const [cardInfo, setCardInfo] = React.useState({ id: 0, listTitle: '' });
  const [isCardModalOpen, setIsCardModalOpen] = React.useState(false);

  const handleCardInfo = React.useCallback((info: CardInfo) => setCardInfo(info), []);
  const handleCardModalState = React.useCallback(() => {
    setIsCardModalOpen(state => !state);
  }, []);

  React.useEffect(() => {
    if (cardInfo.id && cardInfo.listTitle) {
      setIsCardModalOpen(true);
    }
    return () => {
      setIsCardModalOpen(false);
    };
  }, [cardInfo.id, cardInfo.listTitle]);

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
