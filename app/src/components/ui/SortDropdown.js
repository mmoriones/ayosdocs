'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable high-density Sort Dropdown component.
 * Matches the design used across the discovery and tracking pages.
 * 
 * @param {Object} props
 * @param {string} props.value - Current sort value.
 * @param {Function} props.onChange - Callback when value changes.
 * @param {Array<{label: string, value: string, disabled?: boolean}>} props.options - List of sort options.
 * @param {string} [props.label="Sort:"] - Prefix label.
 * @param {string} [props.className=""] - Additional CSS classes.
 */
const SortDropdown = ({ value, onChange, options, label = "Sort:", className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value) || options[0];

  return (
    <div className={`relative shrink-0 ${className}`} ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-3 bg-ctp-mantle/50 border rounded-lg px-4 py-2 text-[10px] font-bold text-ctp-text transition-all shadow-sm active:scale-95 ${
          isOpen ? 'border-ctp-sky-800 ring-4 ring-ctp-sky-800/5' : 'border-ctp-surface1 hover:border-ctp-sky-800/30'
        }`}
      >
        <span className="text-ctp-subtext1 font-bold uppercase tracking-widest">{label}</span>
        <span className="uppercase tracking-widest">{selectedOption?.label || value}</span>
        <ChevronDown size={12} className={`text-ctp-subtext1 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-ctp-mantle border border-ctp-surface1 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right">
          <div className="p-1.5 space-y-0.5">
            {options.map((option) => (
              <button
                key={option.value}
                disabled={option.disabled}
                onClick={() => { 
                  if (!option.disabled) {
                    onChange(option.value); 
                    setIsOpen(false); 
                  }
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
                  value === option.value 
                    ? 'bg-ctp-sky-800 text-white shadow-md shadow-ctp-sky-800/10' 
                    : option.disabled
                      ? 'text-ctp-subtext1/40 cursor-not-allowed italic'
                      : 'text-ctp-subtext1 hover:bg-ctp-base dark:hover:bg-ctp-surface0 hover:text-ctp-text'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SortDropdown;
