import React from 'react';
import Image from 'next/image';
import { Layers } from 'lucide-react';

/**
 * Mapping of bundle IDs to custom webp icons.
 */
const bundleIconMap = {
  'first-job': '/assets/bundles/Job.webp',
  'ofw': '/assets/bundles/Ofw.webp',
  'wedding': '/assets/bundles/Marriage.webp',
  'business': '/assets/bundles/Business.webp',
  'college-graduation': '/assets/guides/GraduationCap.webp',
  'travel-tourist': '/assets/bundles/Travel.webp',
  'senior-citizen': '/assets/bundles/SeniorCouple.webp',
  'pwd-benefits': '/assets/bundles/WheelChair.webp',
  'solo-parent': '/assets/bundles/SoloParent.webp',
  'foundational-docs': '/assets/bundles/GeneralIdentity.webp',
};

/**
 * Helper to get an icon for a bundle using new webp assets.
 * 
 * @param {string} id - The unique identifier for the bundle.
 * @param {object} props - Optional props for the icon (size, className, etc.)
 * @returns {JSX.Element} The rendered icon (Image or Lucide fallback).
 */
export const getBundleIcon = (id, props = {}) => {
  const { className = '', size = 32 } = props;
  
  const iconPath = bundleIconMap[id] || '/assets/bundles/GeneralIdentity.webp';

  return (
    <div className={`relative shrink-0 ${className}`} style={{ width: size, height: size }}>
      <Image 
        src={iconPath}
        alt={`${id} bundle icon`}
        fill
        sizes="100px"
        className="object-contain"
      />
    </div>
  );
};
