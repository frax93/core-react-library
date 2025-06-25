export type QuerySerializableObject = {
  [key: string]: string | boolean | number;
};

export const objectToQueryString = (key: string, object: QuerySerializableObject): string => {
  const copyObject = { ...object };
  const objectKeys = Object.keys(copyObject);
  const hasKeys = objectKeys.length > 0;
  const queryString = hasKeys
    ? objectKeys
        .map((propertyKey, index) => {
          if (index === 0 && copyObject[propertyKey]) {
            return `${key}=${propertyKey}:${copyObject[propertyKey]}`;
          }
          return copyObject[propertyKey] ? `&${key}=${propertyKey}:${copyObject[propertyKey]}` : '';
        })
        .join('')
    : '';
  return queryString;
};

export default objectToQueryString;
