'use client';

import React from 'react';

/**
 * TrackingIndicator Component
 * A status indicator for active bundles and guides.
 * 
 * @param {Object} props
 * @param {'guide' | 'bundle'} props.variant - The type of item being tracked.
 * @param {string} [props.label] - Optional override for the status text.
 * @param {boolean} [props.pulse=false] - Whether to animate the status dot.
 * @param {string} [props.className] - Optional custom classes.
 */
const TrackingIndicator = ({ 
  variant = 'guide', 
  label, 
  pulse = false,
  className = "" 
}) => {
  const isBundle = variant === 'bundle';
  
  // Design: High-contrast text on low-opacity backgrounds with precise borders
  const styles = {
    guide: {
      container: "bg-ctp-green/[0.05] text-ctp-green border-ctp-green/10",
      dot: "bg-ctp-green shadow-[0_0_4px_rgba(166,227,161,0.5)]",
      text: "TRACKING"
    },
    bundle: {
      container: "bg-ctp-sky-800/[0.05] text-ctp-sky-800 border-ctp-sky-800/20",
      dot: "bg-ctp-sky-800 shadow-[0_0_4px_rgba(4,165,229,0.5)]",
      text: "ACTIVE"
    }
  };

  const current = styles[variant] || styles.guide;

  return (
    <div className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded border transition-all ${current.container} ${className}`}>
      <div className={`w-1 h-1 rounded-full ${current.dot} ${pulse ? 'animate-pulse' : ''}`} />
      <span className="text-ui-tiny font-bold uppercase tracking-[0.15em] leading-none">
        {label || current.text}
      </span>
    </div>
  );
};

export default TrackingIndicator;
