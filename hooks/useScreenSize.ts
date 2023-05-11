import { useEffect, useState } from 'react';
import resolveConfig from 'tailwindcss/resolveConfig';

import tailwindConfig from 'tailwind.config';

const fullConfig = resolveConfig(tailwindConfig);

export enum ScreenSize {
  sm = 'sm',
  md = 'md',
  lg = 'lg',
  xl = 'xl',
  '2xl' = '2xl',
  '3xl' = '3xl',
}

export const useScreenSize = () => {
  const isSSR = typeof window === 'undefined';
  const [screenSize, setScreenSize] = useState({
    width: !isSSR ? window.innerWidth : 0,
    height: !isSSR ? window.innerHeight : 0,
  });

  const handleResize = () => {
    setScreenSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};

export const useMediaQuery = (size: ScreenSize, operator: 'gt' | 'lt') => {
  const { width } = useScreenSize();

  if (operator === 'gt') {
    return width > +fullConfig.theme.screens[size].replace('px', '');
  }

  return width < +fullConfig.theme.screens[size].replace('px', '');
};
