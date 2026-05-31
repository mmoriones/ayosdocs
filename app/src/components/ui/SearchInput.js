'use client';

import { Search } from 'lucide-react';

/**
 * Standardized search input component.
 * 
 * @param {Object} props
 * @param {string} props.value
 * @param {Function} props.onChange
 * @param {string} [props.placeholder]
 * @param {'standard' | 'compact'} [props.variant]
 * @param {boolean} [props.showShortcut]
 */
export default function SearchInput({ 
  value, 
  onChange, 
  onClick,
  placeholder = "Search...", 
  variant = 'standard',
  className = "",
  showShortcut = false
}) {
  const isCompact = variant === 'compact';

  return (
    <div 
      className={`relative group w-full cursor-text ${className}`}
      onClick={onClick}
    >
      <div className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors text-gray-400 group-focus-within:text-[#0038A8] ${
        isCompact ? 'left-3' : 'left-5'
      }`}>
        <Search 
          className={isCompact ? 'w-4 h-4' : 'w-5 h-5'} 
          strokeWidth={2.5}
        />
      </div>
      <input 
        type="text" 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={100}
        className={`w-full bg-white border-white rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.03)] focus:outline-none focus:border-[#0038A8]/20 focus:ring-4 focus:ring-[#0038A8]/5 transition-all placeholder:text-gray-400 font-medium text-[#1C1C1E] ${
          isCompact ? 'py-2.5 pl-10 pr-4 text-xs' : 'py-4 pl-14 pr-8 text-[15px]'
        }`}
      />
      {showShortcut && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none">
          <kbd className="px-1.5 py-0.5 rounded border border-gray-100 bg-gray-50 text-[10px] font-sans text-gray-400 uppercase">⌘</kbd>
          <kbd className="px-1.5 py-0.5 rounded border border-gray-100 bg-gray-50 text-[10px] font-sans text-gray-400 uppercase">K</kbd>
        </div>
      )}
    </div>
  );
}
