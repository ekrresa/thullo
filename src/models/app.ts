import { NextPage } from 'next';
import { ReactElement, ReactNode } from 'react';

export type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactElement) => ReactNode;
  protected: boolean;
};

export interface BaseResponse<T> {
  data: T;
}
