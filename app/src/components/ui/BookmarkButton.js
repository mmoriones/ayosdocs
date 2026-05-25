'use client';

import { Bookmark } from 'lucide-react';
import { Tooltip } from '@/components/ui';

/**
 * Reusable Bookmark/Favorite button with built-in tooltip and consistent styling.
 * 
 * @param {Object} props
 * @param {boolean} props.isFavorite - Current favorite state.
 * @param {Function} props.onClick - Click handler.
 * @param {'sm' | 'md' | 'lg'} [props.size='md']
 * @param {'square' | 'circle' | 'bare'} [props.variant='square']
 * @param {string} [props.className='']
 * @param {Object} [props.tooltipProps={}] - Props for the internal Tooltip.
 */
export default function BookmarkButton({ 
  isFavorite, 
  onClick, 
  size = 'md', 
  variant = 'square',
  className = '',
  tooltipProps = {}
}) {
  const sizes = {
    sm: variant === 'bare' ? 'w-6 h-6' : 'w-7 h-7',
    md: variant === 'bare' ? 'w-8 h-8' : 'w-9 h-9',
    lg: variant === 'bare' ? 'w-10 h-10' : 'w-11 h-11',
  };

  const iconSizes = {
    sm: 13,
    md: 16,
    lg: 20,
  };

  const rounding = variant === 'circle' ? 'rounded-full' : 'rounded-lg';

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
  };

  const variantClasses = {
    bare: isFavorite 
      ? 'text-ctp-sky-800 bg-ctp-sky-800/10' 
      : 'text-ctp-subtext1 hover:text-ctp-sky-800 hover:bg-ctp-sky-800/5',
    square: isFavorite 
      ? 'bg-ctp-sky-800/[0.08] border-ctp-sky-800/30 text-ctp-sky-800 border' 
      : 'bg-ctp-base border-ctp-surface1 text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-sky-800 hover:border-ctp-sky-800/30 border',
    circle: isFavorite 
      ? 'bg-ctp-sky-800/[0.08] border-ctp-sky-800/30 text-ctp-sky-800 border' 
      : 'bg-ctp-base border-ctp-surface1 text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-sky-800 hover:border-ctp-sky-800/30 border',
  };

  return (
    <Tooltip 
      content={isFavorite ? "Remove from Favorites" : "Add to Favorites"} 
      {...tooltipProps}
      className={className}
    >
      <button 
        onClick={handleClick}
        className={`click-ripple ${sizes[size]} ${rounding} transition-all flex items-center justify-center ${variantClasses[variant] || variantClasses.square}`}
        aria-label={isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      >
        <Bookmark 
          size={iconSizes[size]} 
          className="transition-colors" 
          fill={isFavorite ? "currentColor" : "none"} 
          strokeWidth={2.5}
        />
      </button>
    </Tooltip>
  );
}
