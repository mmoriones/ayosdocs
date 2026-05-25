'use client';

const SelectionPill = ({ selected, onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`hover-lift click-ripple px-3 py-1.5 rounded-md text-ui-tiny font-bold uppercase tracking-[0.1em] whitespace-nowrap border transition-all ${
        selected
          ? 'bg-ctp-sky-800 text-white border-ctp-sky-800 shadow-sm'
          : 'bg-ctp-mantle/50 text-ctp-subtext1 border-ctp-surface1 hover:border-ctp-sky-800/30 hover:text-ctp-sky-800'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default SelectionPill;
