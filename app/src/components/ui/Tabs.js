'use client';

/**
 * Reusable Tabs component following the modern "pill" or segmented control style.
 * Matches the design used in the My Docs (ProgressClient) and Settings pages.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Tab components.
 * @param {string} [props.className=''] - Additional container classes.
 */
export function Tabs({ children, className = '' }) {
  return (
    <div className={`flex bg-ctp-mantle p-1 rounded-lg border border-ctp-surface1 shadow-sm overflow-x-auto scrollbar-hide ${className}`}>
      {children}
    </div>
  );
}

/**
 * Individual Tab component.
 * 
 * @param {Object} props
 * @param {boolean} props.active - Whether the tab is selected.
 * @param {Function} props.onClick - Click handler.
 * @param {React.ReactNode} props.children - Tab label.
 * @param {string} [props.className=''] - Additional tab classes.
 */
export function Tab({ active, onClick, children, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap ${
        active
          ? 'bg-ctp-sky-800 text-white shadow-sm'
          : 'text-ctp-subtext1 hover:text-ctp-text hover:bg-ctp-surface0'
      } ${className}`}
    >
      {children}
    </button>
  );
}

/**
 * TabPanel component to show/hide content based on active tab.
 * 
 * @param {Object} props
 * @param {boolean} props.active - Whether this panel should be visible.
 * @param {React.ReactNode} props.children - Panel content.
 * @param {string} [props.className=''] - Additional panel classes.
 */
export function TabPanel({ active, children, className = '' }) {
  if (!active) return null;

  return (
    <div className={`animate-in fade-in duration-200 ${className}`}>
      {children}
    </div>
  );
}
