/**
 * the function to trigger the resolve function with delay
 * @param {number} delayTime the delay time
 * @returns {Promise} a promise
 */
export default (delayTime: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, delayTime));
