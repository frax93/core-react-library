import { useState } from 'react';
import { useListener } from '../use-bus';
import { NAVBAR_HEIGHT_EVENT } from '../../constants';

function getNavHeight() {
  return document.getElementById('navigation-menu')?.offsetHeight || 0;
}

export function useNavbarHeight(): number {
  const [navHeight, setNavHeight] = useState<number>(getNavHeight());

  useListener<number>(NAVBAR_HEIGHT_EVENT, (newNavHeight) => {
    setNavHeight(newNavHeight || 0);
  });

  return navHeight;
}
