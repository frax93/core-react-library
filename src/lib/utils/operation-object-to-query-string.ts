import { Operation, OperationType } from '../view-models/operation';

type QueryOperationSerializableObject = {
  value: string | number | boolean;
  operation?: OperationType;
};

export type OperationObject = {
  [key: string]: QueryOperationSerializableObject;
};

export const operationObjectToQueryString = (key: string, object: OperationObject): string => {
  const copyObject = { ...object };
  const objectKeys = Object.keys(copyObject);
  const hasKeys = objectKeys.length > 0;
  const queryString = hasKeys
    ? objectKeys
        .map((propertyKey, index) => {
          if (index === 0 && copyObject[propertyKey].value) {
            return `${key}=${propertyKey}:${copyObject[propertyKey].value}:${
              copyObject[propertyKey].operation || Operation.LIKE
            }`;
          }
          return copyObject[propertyKey].value
            ? `&${key}=${propertyKey}:${copyObject[propertyKey].value}:${
                copyObject[propertyKey].operation || Operation.LIKE
              }`
            : '';
        })
        .join('')
    : '';

  return queryString;
};

export default operationObjectToQueryString;
