'use client';

import { useEffect, useRef } from 'react';

/**
 * Component for rendering a navigation list of headings within a guide.
 * Highlights the active section and provides smooth scrolling to anchors.
 */
const TableOfContents = ({ headings, onItemClick, activeId }) => {
  const listRef = useRef(null);

  useEffect(() => {
    if (activeId && listRef.current) {
      const activeElement = Array.from(listRef.current.querySelectorAll('a'))
        .find(a => a.getAttribute('href') === `#${activeId}`);
        
      if (activeElement) {
        activeElement.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }
    }
  }, [activeId]);

  return (
    <ul ref={listRef} className="space-y-1">
      {headings.map((h, index) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            onClick={(e) => {
              e.preventDefault();
              const element = document.getElementById(h.id);
              const headerOffset = 90; // Balanced offset for the sticky header
              
              if (element) {
                const bodyRect = document.body.getBoundingClientRect().top;
                const elementRect = element.getBoundingClientRect().top;
                const elementPosition = elementRect - bodyRect;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                });
              }
              
              if (onItemClick) onItemClick(h.id);
            }}
            className={`block py-2 px-3 rounded-lg text-ui-label transition-all tracking-tight ${
              activeId === h.id
                ? "bg-ctp-sky-800/10 text-ctp-sky-800 font-semibold border border-ctp-sky-800/20"
                : "text-ctp-subtext1 font-medium hover:bg-ctp-base hover:text-ctp-sky-800"
            }`}
          >
            <span className={`mr-3 font-bold transition-colors ${
              activeId === h.id ? "text-ctp-sky-800" : "text-ctp-subtext0"
            }`}>
              {String(index + 1).padStart(2, '0')}
            </span>
            {h.text}
          </a>
        </li>
      ))}
    </ul>
  );
};

export default TableOfContents;
