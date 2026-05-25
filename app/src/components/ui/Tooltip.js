'use client';

import { useState, useRef } from 'react';

/**
 * Reusable Tooltip component.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.content - Tooltip text/content.
 * @param {React.ReactNode} props.children - Trigger element.
 * @param {'top' | 'bottom' | 'left' | 'right'} [props.position='top']
 * @param {'sm' | 'md' | 'lg'} [props.delay=500]
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.className='']
 */
export default function Tooltip({
  content,
  children,
  position = 'top',
  delay = 200,
  disabled = false,
  className = '',
  contentClassName = '',
  }) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef(null);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-l-ctp-crust border-r-transparent border-t-transparent border-b-transparent border-4',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent border-b-ctp-crust border-4',
    left: 'left-full top-1/2 -translate-y-1/2 border-t-ctp-crust border-r-transparent border-b-transparent border-l-transparent border-4',
    right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-r-transparent border-b-transparent border-l-ctp-crust border-4',
  };

  const show = () => {
    if (disabled) return;
    timeoutRef.current = setTimeout(() => setIsVisible(true), delay);
  };

  const hide = () => {
    clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  if (!content) return <>{children}</>;

  return (
    <div
      className={`relative inline-flex ${className}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {isVisible && (
        <div className={`absolute z-[200] pointer-events-none animate-in fade-in zoom-in-95 duration-150 ${positions[position]} ${contentClassName}`}>
          <div className="bg-ctp-crust text-ctp-text text-ui-tiny font-bold uppercase tracking-widest px-2.5 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
            {content}
          </div>
          <div className={`absolute ${arrows[position]}`} />
        </div>
      )}
    </div>
  );
}
