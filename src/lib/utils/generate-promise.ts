export interface PromiseErrorInterface {
  isCanceled: boolean;
  message: string;
}
/**
 * the function to trigger the resolve function with delay
 * @param {Promise} promise the promise
 * @returns {Promise} a promise
 */
class PromiseError extends Error {
  isCanceled = false;
  message = '';
  /**
   * The constructor of the class
   * @param {*} errorObject the error object
   */
  constructor(errorObject: PromiseErrorInterface) {
    super(errorObject.message);
    this.isCanceled = errorObject.isCanceled;
    this.message = errorObject.message;
  }
}

interface PromiseGenerator<T> {
  promise: Promise<T>;
  cancel: () => boolean;
}

/**
 * the function to trigger the resolve function with delay
 * @param {Promise} promise the promise
 * @returns {Promise} a promise
 */
const generatePromise = <T>(promise: Promise<T>): PromiseGenerator<T> => {
  let isCanceled = false;

  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then(
      (value: T) =>
        isCanceled
          ? reject(new PromiseError({ isCanceled, message: value as unknown as string }))
          : resolve(value),
      (error) => reject(new PromiseError({ isCanceled, message: error }))
    );
  }) as Promise<T>;

  return {
    promise: wrappedPromise,
    cancel: () => {
      isCanceled = true;
      return isCanceled;
    },
  };
};

export default generatePromise;
