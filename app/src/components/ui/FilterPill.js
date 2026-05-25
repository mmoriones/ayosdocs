'use client';

import { X } from 'lucide-react';

/**
 * Reusable Filter Pill component for active filter indicators.
 * 
 * @param {Object} props
 * @param {string} props.label - The text to display.
 * @param {Function} props.onClear - Callback when the clear button is clicked.
 * @param {string} [props.className=""] - Additional CSS classes.
 */
const FilterPill = ({ label, onClear, className = "" }) => {
  return (
    <div className={`flex items-center gap-2 px-2 py-1 bg-ctp-sky-800/10 border border-ctp-sky-800/20 rounded-lg group animate-in fade-in zoom-in-95 duration-200 ${className}`}>
      <span className="text-ui-micro font-bold text-ctp-sky-800 uppercase tracking-widest">{label}</span>
      <button 
        onClick={onClear}
        className="click-ripple text-ctp-subtext1 hover:text-ctp-peach transition-colors outline-none"
      >
        <X size={10} strokeWidth={3} />
      </button>
    </div>
  );
};

export default FilterPill;
