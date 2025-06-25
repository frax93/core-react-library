import { HttpStatusCode } from './http-status-code';

export function isHttpBackendError(obj: unknown): obj is HttpBackendError {
  return obj instanceof HttpBackendError;
}

export const UnknownBackendErrorCode = -1;

export class HttpBackendError extends Error {
  /**
   * A alphanumeric code identifying the error category.
   */
  public readonly code: number;

  /**
   * A list of messages describing the thrown http error.
   */
  public readonly messages: string[];

  /**
   * Tells if the error was handled globally.
   */
  public readonly globallyHandled: boolean;

  /**
   * The http status code.
   */
  public readonly statusCode: number;

  constructor(
    code: number,
    messages: string[],
    statusCode: HttpStatusCode,
    globallyHandled?: boolean
  ) {
    super('An error was thrown while performing a http request against PrimaMi backend');
    this.code = code;
    this.messages = messages;
    this.globallyHandled = globallyHandled || false;
    this.statusCode = statusCode;

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, HttpBackendError.prototype);
  }
}
