import { useCallback } from 'react';
import { HeadCell } from '../../view-models/head-cell';
import { Order, OrderTypes } from '../../view-models/order';


export type OrderFound = {
  exist: boolean;
  value: OrderTypes | undefined;
};

export const useOrder = <T, K extends keyof T>(
  orders: Order
): ((head: HeadCell<T, K>) => OrderFound) => {
  const getOrder = useCallback(
    (headCell: HeadCell<T, K>) => {
      const ordersSort = orders || {};

      const keyOrderFound: string | undefined = (Object.keys(ordersSort) as Array<string>).find(
        (keyOrder) => keyOrder === headCell.id
      );
      const key = keyOrderFound as string;
      return {
        exist: !!key && !!ordersSort[key],
        value: ordersSort[key],
      };
    },
    [orders]
  );

  return getOrder;
};
