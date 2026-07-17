import { useState } from 'react';
import { useListener } from '../use-bus';
import { NAVBAR_HEIGHT_EVENT } from '../../constants/constants';

function getNavHeight(elementId: string): number {
  return document.getElementById(elementId)?.offsetHeight || 0;
}

/**
 * Tracks the height of a navbar element, updating whenever the given bus event
 * fires. The element id and event name are provided by the consumer so the hook
 * is not tied to any specific DOM structure.
 * @param {string} elementId id of the navbar DOM element to measure
 * @param {string} eventName bus event carrying the new height (defaults to NAVBAR_HEIGHT_EVENT)
 * @returns {number} the current navbar height in pixels
 */
export function useNavbarHeight(elementId: string, eventName: string = NAVBAR_HEIGHT_EVENT): number {
  const [navHeight, setNavHeight] = useState<number>(() => getNavHeight(elementId));

  useListener<number>(eventName, (newNavHeight) => {
    setNavHeight(newNavHeight || 0);
  });

  return navHeight;
}
