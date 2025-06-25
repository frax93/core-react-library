/**
 * The function
 * @param {Function} callback the handler
 * @param {number} delay the delay
 * @returns {Function} the function with parameters
 */
export default <T>(
    callback: (param: T) => void,
    delay = 500
  ): ((...arguments_: unknown[]) => void) => {
    let timeoutID: NodeJS.Timeout | number;
    return (...arguments_: unknown[]) => {
      clearTimeout(timeoutID as NodeJS.Timeout);
      timeoutID = setTimeout(callback, delay, ...arguments_);
    };
  };
  