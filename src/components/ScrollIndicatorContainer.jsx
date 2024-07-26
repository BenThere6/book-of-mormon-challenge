import React, { useEffect, useRef, useState } from 'react';
import '../assets/css/scroll-indicator.css';

const ScrollIndicatorContainer = ({ children }) => {
  const containerRef = useRef(null);
  const [scrollState, setScrollState] = useState({ top: false, bottom: false });

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    setScrollState({
      top: scrollTop > 0,
      bottom: scrollTop + clientHeight < scrollHeight,
    });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container.scrollHeight > container.clientHeight) {
      setScrollState({
        top: container.scrollTop > 0,
        bottom: container.scrollTop + container.clientHeight < container.scrollHeight,
      });
    } else {
      setScrollState({ top: false, bottom: false });
    }
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      id="example3"
      className={`${scrollState.top ? 'off-top' : ''} ${scrollState.bottom ? 'off-bottom' : ''}`}
    >
      <div className="scrollbox" ref={containerRef}>
        {children}
      </div>
      <div className="shadow shadow-top"></div>
      <div className="shadow shadow-bottom"></div>
    </div>
  );
};

export default ScrollIndicatorContainer;