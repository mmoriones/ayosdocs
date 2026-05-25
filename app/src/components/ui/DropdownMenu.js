'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Reusable DropdownMenu component for action menus and option pickers.
 * Improved with robust propagation handling to prevent accidental parent clicks.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.trigger - The trigger element.
 * @param {React.ReactNode} props.children - Menu items.
 * @param {'left' | 'right'} [props.align='left']
 * @param {boolean} [props.closeOnSelect=true]
 * @param {string} [props.className='']
 */
export default function DropdownMenu({
  trigger,
  children,
  align = 'left',
  closeOnSelect = true,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handlePointerDown = (e) => {
    // Stop at pointer level to prevent CSS :active on parent elements
    e.stopPropagation();
  };

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen(!isOpen);
  };

  const handleMenuClick = (e) => {
    // Stop bubbling to parent components (like GuideRowCard)
    e.stopPropagation();
    
    // Automatically close if requested
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  const alignClasses = {
    left: 'left-0',
    right: 'right-0',
  };

  return (
    <div className={`relative inline-flex ${className}`} ref={dropdownRef}>
      <div onPointerDown={handlePointerDown} onClick={handleToggle} className="cursor-pointer">
        {trigger}
      </div>

      {isOpen && (
        <div
          className={`absolute ${alignClasses[align]} top-full mt-2 w-52 bg-ctp-base border border-ctp-surface1 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right`}
          onClick={handleMenuClick}
        >
          <div className="p-1 space-y-0.5">
            {children}
          </div>
        </div>
      )}
    </div>
  );
}

/**
 * Item for the DropdownMenu.
 */
export function DropdownMenuItem({
  children,
  onClick,
  icon: Icon,
  variant = 'default',
  className = '',
}) {
  const variants = {
    default: 'text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-text',
    danger: 'text-ctp-red hover:bg-ctp-red/10',
    active: 'bg-ctp-sky-800 text-white hover:bg-ctp-sky-700',
  };

  return (
    <button
      onClick={(e) => {
        // We let it bubble to handleMenuClick in the parent for closing
        // but the parent handles stopPropagation to the outside world.
        onClick?.(e);
      }}
      className={`w-full text-left flex items-center gap-3 px-3 py-2.5 rounded-lg text-ui-micro font-bold uppercase tracking-widest transition-all ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={14} />}
      {children}
    </button>
  );
}
