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

  // Generate a deterministic color based on the name
  const getColor = (fullName) => {
    const colors = [
      { bg: 'bg-[#0038A8]/10', border: 'border-[#0038A8]/20', text: 'text-[#0038A8]' }, // Blue
      { bg: 'bg-[#AF52DE]/10', border: 'border-[#AF52DE]/20', text: 'text-[#AF52DE]' }, // Mauve
      { bg: 'bg-[#34C759]/10', border: 'border-[#34C759]/20', text: 'text-[#34C759]' }, // Green
      { bg: 'bg-[#FF9500]/10', border: 'border-[#FF9500]/20', text: 'text-[#FF9500]' }, // Orange
      { bg: 'bg-[#5856D6]/10', border: 'border-[#5856D6]/20', text: 'text-[#5856D6]' }, // Indigo
    ];
    
    if (!fullName) return colors[0];
    
    // Simple hash function
    let hash = 0;
    for (let i = 0; i < fullName.length; i++) {
      hash = fullName.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    return colors[Math.abs(hash) % colors.length];
  };

  const theme = getColor(name);

  if (src) {
    return (
      <div className={`${sizes[size]} rounded-full overflow-hidden border-2 border-white shrink-0 ${className}`}>
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
      className={`${sizes[size]} rounded-full ${theme.bg} border-2 ${theme.border} flex items-center justify-center font-bold ${theme.text} shrink-0 ${className}`}
    >
      {getInitials(name)}
    </div>
  );
}
