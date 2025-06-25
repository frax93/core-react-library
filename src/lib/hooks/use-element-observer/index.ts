import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ResizeObserver as Polyfill } from '@juggle/resize-observer';
import debounce from '../../utils/debounce';

const ResizeObserver = window.ResizeObserver || Polyfill;

export function useElementScrollWidthObserver(
  domElement: HTMLElement | null,
  debounceTime = 10
): boolean {
  const observerRef = useRef<ResizeObserver | null>(null);
  const [hasScroll, setHasScroll] = useState(false);

  const checkScroll = useCallback(
    (element: HTMLElement) => {
      const elementScrollWidth = element.scrollWidth;
      const elementClientWidth = element.clientWidth;

      setHasScroll(elementScrollWidth > elementClientWidth);
    },
    [setHasScroll]
  );

  const handleElementResize = useCallback(
    (entries: ResizeObserverEntry[]) => {
      const elementScrollWidth = entries[0].target.scrollWidth;
      const elementClientWidth = entries[0].target.clientWidth;

      if (elementScrollWidth > elementClientWidth) {
        setHasScroll(true);
      } else {
        setHasScroll(false);
      }
    },
    [setHasScroll]
  );

  useLayoutEffect(() => {
    if (domElement) {
      // Verifica iniziale
      checkScroll(domElement);

      // Imposta il ResizeObserver
      if (!observerRef.current) {
        observerRef.current = new ResizeObserver(debounce(handleElementResize, debounceTime));
      }

      observerRef.current.observe(domElement);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [domElement, debounceTime, handleElementResize]);

  return hasScroll;
}
