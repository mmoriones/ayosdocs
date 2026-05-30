'use client';

import { Check } from 'lucide-react';

/**
 * Custom High-Fidelity Checkbox component.
 */
export default function Checkbox({ id, checked = false, onCheckedChange, className = '' }) {
  return (
    <button
      type="button"
      id={id}
      role="checkbox"
      aria-checked={checked}
      onClick={() => onCheckedChange?.(!checked)}
      className={`
        w-5 h-5 flex items-center justify-center rounded-[6px] transition-all duration-200 border-2
        ${checked 
          ? 'bg-[#FFD700] border-[#FFD700] shadow-[0_2px_8px_rgba(255,215,0,0.3)] scale-105' 
          : 'bg-white border-gray-200 hover:border-gray-300'
        }
        active:scale-90
        ${className}
      `}
    >
      <Check 
        size={14} 
        strokeWidth={4} 
        className={`text-white transition-opacity duration-200 ${checked ? 'opacity-100' : 'opacity-0'}`} 
      />
    </button>
  );
}
