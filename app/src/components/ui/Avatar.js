'use client';

import Image from 'next/image';

/**
 * Reusable Avatar component with image and initials fallback.
 *
 * @param {Object} props
 * @param {string} [props.src] - Image source URL.
 * @param {string} [props.alt] - Alt text for the image.
 * @param {string} [props.name] - Full name for generating initials fallback.
 * @param {'sm' | 'md' | 'lg' | 'xl'} [props.size='md']
 * @param {string} [props.className='']
 */
export default function Avatar({
  src,
  alt = '',
  name = '',
  size = 'md',
  className = '',
}) {
  const sizes = {
    sm: 'w-8 h-8 text-ui-micro',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-sm',
    xl: 'w-20 h-20 text-base',
  };

  const imageSizes = {
    sm: 32,
    md: 40,
    lg: 56,
    xl: 80,
  };

  const getInitials = (fullName) => {
    if (!fullName) return '?';
    return fullName
      .split(' ')
      .map((n) => n[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  if (src) {
    return (
      <div className={`${sizes[size]} rounded-full overflow-hidden border-2 border-ctp-surface1 shrink-0 ${className}`}>
        <Image
          src={src}
          alt={alt || name || 'Avatar'}
          width={imageSizes[size]}
          height={imageSizes[size]}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${sizes[size]} rounded-full bg-ctp-sky-800/10 border-2 border-ctp-sky-800/20 flex items-center justify-center font-bold text-ctp-sky-800 shrink-0 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
