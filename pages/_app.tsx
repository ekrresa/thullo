import type { AppProps } from 'next/app';

import type { Page } from '../types/app';
import '../styles/globals.css';

type Props = AppProps & {
  Component: Page;
};

function MyApp({ Component, pageProps }: Props) {
  const renderLayout = Component.getLayout ?? (page => page);

  return renderLayout(<Component {...pageProps} />);
}

export default MyApp;
