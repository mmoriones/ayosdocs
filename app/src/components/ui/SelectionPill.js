'use client';

const SelectionPill = ({ selected, onClick, children, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-[0.1em] whitespace-nowrap border transition-all active:scale-95 ${
        selected
          ? 'bg-[#0038A8] text-white border-[#0038A8] shadow-[0_4px_12px_rgba(0,56,168,0.2)]'
          : 'bg-white text-gray-400 border-gray-100 hover:border-[#0038A8]/30 hover:text-[#0038A8] shadow-sm'
      } ${className}`}
    >
      {children}
    </button>
  );
};

export default SelectionPill;
