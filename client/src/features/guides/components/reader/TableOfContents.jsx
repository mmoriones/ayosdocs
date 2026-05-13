import { useEffect, useRef } from 'react';

/**
 * Component for rendering a navigation list of headings within a guide.
 * Highlights the active section and provides smooth scrolling to anchors.
 * 
 * @param {Object} props - Component props.
 * @param {Array<{id: string, text: string}>} props.headings - The list of headings extracted from markdown.
 * @param {Function} props.onItemClick - Callback for when a TOC item is clicked (used to close mobile modals).
 * @param {string} props.activeId - The ID of the heading currently visible in the viewport.
 * @returns {JSX.Element} The rendered TableOfContents component.
 */
const TableOfContents = ({ headings, onItemClick, activeId }) => {
  const listRef = useRef(null);

  // Synchronization of the TOC scroll position with the active section.
  // This ensures the highlighted item is always visible within the sidebar if the list is long.
  useEffect(() => {
    if (activeId && listRef.current) {
      // Searching for the link element that matches the currently active section ID.
      const activeElement = Array.from(listRef.current.querySelectorAll('a'))
        .find(a => a.getAttribute('href') === `#${activeId}`);
        
      if (activeElement) {
        // Smooth scrolling of the link element into the TOC's viewable area.
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
              const offset = 80;
              
              if (element) {
                window.scrollTo({
                  top: element.getBoundingClientRect().top + window.scrollY - offset,
                  behavior: "smooth",
                });
              }
              
              if (onItemClick) onItemClick(h.id);
            }}
            className={`block py-2.5 px-4 rounded-xl text-xs transition-all uppercase tracking-widest ${
              activeId === h.id
                ? "bg-ctp-green/10 text-ctp-green font-black border border-ctp-green/20 shadow-sm"
                : "text-ctp-subtext0 font-bold hover:bg-ctp-mantle hover:text-ctp-green"
            }`}
          >
            <span className={`mr-3 font-black transition-colors ${
              activeId === h.id ? "text-ctp-green" : "text-ctp-surface2"
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
