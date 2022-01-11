import * as React from 'react';

interface ICardContext {
  cardId: string;
  handleCardId: (cardId: string) => void;
}

const CardContext = React.createContext<ICardContext>({
  cardId: '',
  handleCardId: () => {},
});

export function CardProvider({ children }: React.PropsWithChildren<unknown>) {
  const [cardId, setCardId] = React.useState('');

  const handleCardId = React.useCallback((cardId: string) => setCardId(cardId), []);

  return (
    <CardContext.Provider value={{ cardId, handleCardId }}>
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
