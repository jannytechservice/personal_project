import { useRef, useState, useEffect } from 'react';

interface OverflowInfo {
  isOverflowing: boolean;
  overflowDirection: 'left' | 'right' | 'both' | 'none';
}

export const useHorizontalOverflow = <T extends HTMLElement>(): [
  React.RefObject<T>,
  OverflowInfo
] => {
  const elementRef = useRef<T>(null);
  const [overflowInfo, setOverflowInfo] = useState<OverflowInfo>({
    isOverflowing: false,
    overflowDirection: 'none',
  });

  const checkOverflow = () => {
    const element = elementRef.current;
    if (!element) {
      setOverflowInfo({ isOverflowing: false, overflowDirection: 'none' });
      return;
    }

    const { scrollWidth, clientWidth, scrollLeft } = element;
    const isOverflowing = scrollWidth > clientWidth;
    let overflowDirection: 'left' | 'right' | 'both' | 'none' = 'none';

    if (isOverflowing) {
      if (scrollLeft === 0) {
        overflowDirection = 'right';
      } else if (scrollLeft + clientWidth >= scrollWidth) {
        overflowDirection = 'left';
      } else {
        overflowDirection = 'both';
      }
    }

    setOverflowInfo({ isOverflowing, overflowDirection });
  };

  useEffect(() => {
    const handleResize = () => {
      checkOverflow();
    };

    if (elementRef.current) {
      checkOverflow(); // Initial check
    }

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return [elementRef, overflowInfo];
};
