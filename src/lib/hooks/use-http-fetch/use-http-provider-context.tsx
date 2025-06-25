import { useContext } from 'react';
import { AxiosInstance } from 'axios';
import { AxiosIntanceContext } from './http-provider';

export const useHttpProviderContext = (): AxiosInstance => {
  return useContext(AxiosIntanceContext);
};
