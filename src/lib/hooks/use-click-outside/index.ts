import { MutableRefObject, useEffect, useRef } from 'react';

type ClickOutsideEvent = MouseEvent | TouchEvent;

type ClickOutsideHandler<T> = (event: ClickOutsideEvent) => T;

/**
 * A utility hook helping to deal with the click ouside of an element.
 * @param {*} handler the handler
 * @returns {object} the return
 */
export const useClickOutside = <T>(
  handler: ClickOutsideHandler<T>,
): [MutableRefObject<HTMLElement | undefined | null> | null] => {
  const elementReference = useRef<HTMLElement>(null);

  /**
   * Handles the click outside of the provided ref.
   * @param {*} event the event
   */
  const handleClickOutside = (event: ClickOutsideEvent) => {
    const currentElementRef = elementReference.current;
    if (!currentElementRef || !event.target) {
      return;
    }
    if (currentElementRef.contains(event.target as Node)) {
      return;
    }
    handler(event);
  };

  /**
   * Registers event listeners.
   */
  const registerListeners = () => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
  };

  /**
   * Deregisters event listeners.
   */
  const deregisterListeners = () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('touchstart', handleClickOutside);
  };

  /**
   * Setups the click-outside listener when the component is mounted.
   */
  useEffect(() => {
    deregisterListeners();
    registerListeners();

    return () => {
      deregisterListeners();
    };
  }, [handler]);

  return [elementReference];
};
