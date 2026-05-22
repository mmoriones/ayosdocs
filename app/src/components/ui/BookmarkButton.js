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
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 14,
    md: 16,
    lg: 20,
  };

  const rounding = variant === 'circle' ? 'rounded-full' : (size === 'lg' ? 'rounded-xl' : 'rounded-lg');

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
        className={`${sizes[size]} ${rounding} border transition-all flex items-center justify-center active:scale-90 shadow-sm ${
          isFavorite 
            ? 'bg-ctp-sky-800 border-ctp-sky-800 text-white shadow-ctp-sky-800/20' 
            : 'bg-ctp-base border-ctp-surface1 text-ctp-subtext1 hover:text-ctp-sky-800 hover:border-ctp-sky-800/30'
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
