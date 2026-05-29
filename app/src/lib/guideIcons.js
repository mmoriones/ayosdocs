import React from 'react';
import Image from 'next/image';

/**
 * Mapping of government agencies to custom webp icons.
 * Files are PascalCase to match the filesystem.
 */
const agencyIconMap = {
  'NBI': '/assets/icons/ShieldCheck.webp',
  'DFA': '/assets/icons/Passport.webp',
  'PSA': '/assets/icons/FileText.webp',
  'SSS': '/assets/icons/LandMark.webp',
  'PhilHealth': '/assets/icons/HeartPulse.webp',
  'Pag-IBIG': '/assets/icons/House.webp',
  'BIR': '/assets/icons/Wallet.webp',
  'LTO': '/assets/icons/Truck.webp',
  'DTI': '/assets/icons/Briefcase.webp',
  'PRC': '/assets/icons/GraduationCap.webp',
  'DOJ': '/assets/icons/Scale.webp',
  'POEA': '/assets/icons/Plane.webp',
  'OWWA': '/assets/icons/Users.webp',
  'COMELEC': '/assets/icons/UserCheck.webp',
  'Barangay': '/assets/icons/MapPin.webp',
  'Police': '/assets/icons/Police.webp',
  'Post Office': '/assets/icons/Mail.webp',
};

/**
 * Renders a custom webp icon based on guide slug and agency.
 * Falls back to Lucide FileText if no asset matches.
 */
export const GuideIcon = ({ slug, agency, size = 24, className = '', strokeWidth, ...props }) => {
  let iconPath = null;

  if (agency) {
    const agencyName = Array.isArray(agency) ? agency[0] : agency;
    if (agencyIconMap[agencyName]) {
      iconPath = agencyIconMap[agencyName];
    }
  }

  // Fallback to slug-based detection if agency doesn't match or is not provided
  if (!iconPath && slug) {
    const s = slug.toLowerCase();
    if (s.includes('clearance')) iconPath = '/assets/icons/FileCheck.webp'; 
    else if (s.includes('registration') || s.includes('permit')) iconPath = '/assets/icons/Building2.webp';
    else if (s.includes('license') || s.includes('card')) iconPath = '/assets/icons/CreditCard.webp';
    else if (s.includes('id')) iconPath = '/assets/icons/Id.webp';
    else if (s.includes('psa-') || s.includes('birth') || s.includes('marriage') || s.includes('death')) iconPath = '/assets/icons/FileText.webp';
    else if (s.includes('passport')) iconPath = '/assets/icons/Passport.webp';
    else if (s.includes('visa') || s.includes('travel')) iconPath = '/assets/icons/Globe.webp';
    else if (s.includes('bank') || s.includes('loan')) iconPath = '/assets/icons/LandMark.webp';
    else if (s.includes('school') || s.includes('student')) iconPath = '/assets/icons/GraduationCap.webp';
    else if (s.includes('business')) iconPath = '/assets/icons/Briefcase.webp';
    else if (s.includes('security') || s.includes('privacy') || s.includes('lock')) iconPath = '/assets/icons/Lock.webp';
  }

  // Final fallback to generic document icon if still null
  if (!iconPath) {
    iconPath = '/assets/icons/FileText.webp';
  }

  // Lucide icons often use 'size' prop as a number. 
  // next/image requires width and height.
  const dimensions = typeof size === 'number' ? size : 24;
  
  return (
    <Image 
      src={iconPath}
      alt={`${agency || slug || 'guide'} icon`}
      width={dimensions}
      height={dimensions}
      className={className}
      {...props}
    />
  );
};
