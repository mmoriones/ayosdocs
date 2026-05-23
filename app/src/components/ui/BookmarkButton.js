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
 * @param {'square' | 'circle'} [props.variant='square']
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
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
  };

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 18,
  };

  const rounding = variant === 'circle' ? 'rounded-full' : 'rounded-lg';

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <Tooltip 
      content={isFavorite ? "Remove from Favorites" : "Add to Favorites"} 
      {...tooltipProps}
      className={className}
    >
      <button 
        onClick={handleClick}
        className={`${sizes[size]} ${rounding} border transition-all flex items-center justify-center active:scale-95 ${
          isFavorite 
            ? 'bg-ctp-sky-800/[0.08] border-ctp-sky-800/30 text-ctp-sky-800' 
            : 'bg-ctp-base border-ctp-surface1 text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-sky-800 hover:border-ctp-sky-800/30'
        }`}
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
