interface ErrorObject {
  message: string;
}

export interface ErrorObjects {
  message?: string;
  errors?: Array<ErrorObject>;
}

export type ErrorResponse = string | ErrorObjects;

