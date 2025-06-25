export enum OrderTypes {
  Asc = 'asc',
  Desc = 'desc',
}

export type Order =
  | {
      [key: string]: OrderTypes.Asc | OrderTypes.Desc | undefined;
    }
  | Record<string, never>;
