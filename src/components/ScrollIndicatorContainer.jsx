import React, { useEffect, useState, useRef } from 'react';
import '../assets/css/scroll-indicator.css';

const ScrollIndicatorContainer = ({ children }) => {
  const containerRef = useRef(null);
  const [scrollState, setScrollState] = useState('');

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollTop === 0) {
      setScrollState('bottom');
    } else if (scrollTop + clientHeight >= scrollHeight) {
      setScrollState('top');
    } else {
      setScrollState('both');
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container.scrollHeight > container.clientHeight) {
      setScrollState('both');
    } else {
      setScrollState('');
    }
    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className={`scroll-container ${scrollState}`}>
      {children}
    </div>
  );
};

export default ScrollIndicatorContainer;