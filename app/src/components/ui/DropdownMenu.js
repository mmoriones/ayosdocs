'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

/**
 * Reusable DropdownMenu component for action menus and option pickers.
 * Renders the menu via portal to avoid stacking context / overflow issues.
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
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const [menuStyle, setMenuStyle] = useState({});

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const style = {
      position: 'fixed',
      zIndex: 9999,
      minWidth: '240px',
    };
    if (align === 'right') {
      style.right = window.innerWidth - rect.right + window.innerWidth - rect.right > 0 ? '0px' : '0px';
      style.right = Math.max(0, window.innerWidth - rect.right) + 'px';
    } else {
      style.left = Math.max(0, rect.left) + 'px';
    }
    style.top = (rect.bottom + 8) + 'px';
    setMenuStyle(style);
  }, [align]);

  useEffect(() => {
    if (!isOpen) return;
    updatePosition();
    window.addEventListener('scroll', updatePosition, { capture: true });
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, { capture: true });
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, updatePosition]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current && !menuRef.current.contains(event.target) &&
        triggerRef.current && !triggerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
    if (closeOnSelect) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <div className={`inline-block ${className}`} ref={triggerRef}>
        <div onClick={handleToggle} className="cursor-pointer">
          {trigger}
        </div>
      </div>

      {isOpen && createPortal(
        <div
          ref={menuRef}
          style={menuStyle}
          className="w-60 bg-white/80 backdrop-blur-xl border border-white/40 rounded-[14px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-2 duration-200 origin-top-right"
          onClick={handleMenuClick}
        >
          <div className="py-1">
            {children}
          </div>
        </div>,
        document.body
      )}
    </>
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
    default: 'text-[#3A3A3C] hover:bg-black/5 active:bg-black/10',
    danger: 'text-[#FF3B30] hover:bg-[#FF3B30]/10 active:bg-[#FF3B30]/20',
    active: 'bg-[#0038A8] text-white hover:bg-[#0038A8]/90',
  };

  return (
    <button
      onClick={(e) => {
        onClick?.(e);
      }}
      className={`w-full text-left flex items-center justify-between px-4 py-3 text-[15px] font-medium transition-all ${variants[variant]} ${className}`}
    >
      <span className="flex-1 truncate">{children}</span>
      {Icon && <Icon size={18} className="shrink-0 opacity-70" />}
    </button>
  );
}

/**
 * Separator for the DropdownMenu.
 */
export function DropdownMenuSeparator({ className = '' }) {
  return <div className={`h-[0.5px] bg-black/10 my-1 mx-4 ${className}`} />;
}
