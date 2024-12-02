import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/system';

// Define a type for the dimensions state
interface Dimensions {
  width: number;
  height: number;
}

// A4 portrait aspect ratio
const A4_ASPECT_RATIO = 0.8;

// Styled wrapper that maintains the A4 aspect ratio and scales to fit the parent
const A4Wrapper = styled('div')<{ width: number; height: number }>(
  ({ width, height }) => {
    // Calculate the maximum width and height that keeps the A4 aspect ratio
    const calcHeight = width / A4_ASPECT_RATIO;
    const calcWidth = height * A4_ASPECT_RATIO;

    // Choose the smaller of the two dimensions to make sure the content fits
    const finalWidth = Math.min(width, calcWidth);
    const finalHeight = Math.min(height, calcHeight);
    console.log(finalWidth, finalHeight);

    return {
      width: `${finalWidth}px`,
      height: `${finalHeight}px`,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      boxSizing: 'border-box',
      padding: '10px',
    };
  }
);

const PdfPotraitContainer = ({ children }: { children: React.ReactNode }) => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [dimensions, setDimensions] = useState<Dimensions>({
    width: 0,
    height: 0,
  });
  useEffect(() => {
    // Function to handle resize and set the new dimensions
    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        let { width, height } = entry.contentRect;

        // If width or height is 0, calculate based on the available dimension and aspect ratio
        if (width === 0 && height > 0) {
          width = height * A4_ASPECT_RATIO;
        } else if (height === 0 && width > 0) {
          height = width / A4_ASPECT_RATIO;
        }

        setDimensions({ width, height });
      }
    };

    // Create a ResizeObserver to observe the parent element
    const resizeObserver = new ResizeObserver((entries) =>
      handleResize(entries)
    );

    // Attach observer to the wrapper
    if (wrapperRef.current) {
      resizeObserver.observe(wrapperRef.current);
    }

    // Cleanup observer on unmount
    return () => {
      if (wrapperRef.current) {
        resizeObserver.unobserve(wrapperRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {/* Pass automatically detected width and height to A4Wrapper */}
      {dimensions.width > 0 && dimensions.height > 0 && (
        <A4Wrapper width={dimensions.width} height={dimensions.height}>
          {children}
        </A4Wrapper>
      )}
    </div>
  );
};

export default PdfPotraitContainer;
