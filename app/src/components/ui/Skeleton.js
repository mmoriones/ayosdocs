'use client';

/**
 * Standardized Skeleton loader component for data-fetching states.
 * 
 * @param {Object} props
 * @param {string} [props.className] - Custom tailwind classes for dimensions and shape.
 * @param {boolean} [props.circle=false] - Whether the skeleton should be a circle.
 */
export default function Skeleton({ 
  className = '', 
  circle = false,
  ...props 
}) {
  const baseStyles = "bg-ctp-surface0 animate-pulse-slow";
  const shapeStyles = circle ? "rounded-full" : "rounded-lg";
  
  return (
    <div 
      className={`${baseStyles} ${shapeStyles} ${className}`} 
      {...props}
    />
  );
}
