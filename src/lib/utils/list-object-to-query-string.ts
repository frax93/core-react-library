import { Order } from '../view-models/order';
import { objectToQueryString, QuerySerializableObject } from './object-to-query-string';
import operationObjectToQueryString, { OperationObject } from './operation-object-to-query-string';

type CommonFieldsForList = {
  filters: OperationObject;
  orders: Order;
  page?: number;
  rowsPerPage?: number;
};

export const paginationListToQueryString = (values: CommonFieldsForList): string => {
  const { orders, page, rowsPerPage, filters } = values;

  const filtersQueryString = operationObjectToQueryString('filters', filters);

  const interpolationFilters = filtersQueryString ? `&${filtersQueryString || ''}` : '';

  const ordersObject = orders || {};

  const orderQueryString = objectToQueryString('sort', ordersObject as QuerySerializableObject);

  const interpolationSort = orderQueryString ? `&${orderQueryString || ''}` : '';

  const pageOffset = (page || 0) * (rowsPerPage || 0);
  const hasPagination = page !== undefined && rowsPerPage !== undefined;

  const paginationString = hasPagination ? `pageOffset=${pageOffset}&pageSize=${rowsPerPage}` : '';

  const queryString = [paginationString, interpolationFilters, interpolationSort]
    .filter((str) => !!str)
    .join('');

  return queryString;
};
