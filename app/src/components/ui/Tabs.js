'use client';

export function Tabs({ value, onChange, children, className = '' }) {
  return (
    <div className={`flex border-b border-ctp-surface1 gap-0 ${className}`}>
      {children}
    </div>
  );
}

export function Tab({ value, active, onClick, children, className = '' }) {
  const isActive = active !== undefined ? active : value === onClick?.value;

  return (
    <button
      onClick={onClick}
      className={`px-5 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 -mb-px ${
        isActive
          ? 'text-ctp-sky-800 border-ctp-sky-800'
          : 'text-ctp-subtext1 border-transparent hover:text-ctp-text hover:border-ctp-surface1'
      } ${className}`}
    >
      {children}
    </button>
  );
}

export function TabPanel({ active, index, children, className = '' }) {
  if (active !== index) return null;

  return (
    <div className={`animate-in fade-in duration-200 ${className}`}>
      {children}
    </div>
  );
}
