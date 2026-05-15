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
              const offset = 100; // Increased offset for Next.js header
              
              if (element) {
                const elementPosition = element.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - offset;

                window.scrollTo({
                  top: offsetPosition,
                  behavior: "smooth",
                });
              }
              
              if (onItemClick) onItemClick(h.id);
            }}
            className={`block py-2.5 px-4 rounded-xl text-xs transition-all uppercase tracking-widest ${
              activeId === h.id
                ? "bg-ctp-sky-800/10 text-ctp-sky-800 font-black border border-ctp-sky-800/20 shadow-sm"
                : "text-ctp-subtext0 font-bold hover:bg-ctp-mantle hover:text-ctp-sky-800"
            }`}
          >
            <span className={`mr-3 font-black transition-colors ${
              activeId === h.id ? "text-ctp-sky-800" : "text-ctp-surface2"
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
