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
  showShortcut = false
}) {
  const isCompact = variant === 'compact';

  return (
    <div 
      className="relative group w-full cursor-text"
      onClick={onClick}
    >
      <Search 
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-ctp-subtext1 group-focus-within:text-ctp-sky-800 transition-colors ${
          isCompact ? 'w-4 h-4' : 'w-5 h-5'
        }`} 
      />
      <input 
        type="text" 
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-ctp-base border border-ctp-surface1 rounded-lg focus:outline-none focus:border-ctp-sky-800 focus:ring-1 focus:ring-ctp-sky-800 transition-all placeholder:text-ctp-subtext0 font-medium ${
          isCompact ? 'py-1.5 pl-9 pr-3 text-xs' : 'py-2.5 pl-11 pr-4 text-sm'
        }`}
      />
      {showShortcut && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 pointer-events-none">
          <kbd className="px-1.5 py-0.5 rounded border border-ctp-surface1 bg-ctp-crust text-[10px] font-sans text-ctp-subtext0 uppercase">⌘</kbd>
          <kbd className="px-1.5 py-0.5 rounded border border-ctp-surface1 bg-ctp-crust text-[10px] font-sans text-ctp-subtext0 uppercase">K</kbd>
        </div>
      )}
    </div>
  );
}
