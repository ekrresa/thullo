import type { AppProps } from 'next/app';
import { Toaster } from 'react-hot-toast';

import type { Page } from '../types/app';
import '../styles/globals.css';

type Props = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: Props) {
  const renderLayout = Component.getLayout ?? (page => page);

  return (
    <>
      {renderLayout(<Component {...pageProps} />)}
      <Toaster />
    </>
  );
}

export default MyApp;
