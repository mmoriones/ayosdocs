import React from 'react';
import Image from 'next/image';

/**
 * Mapping of government agencies to custom webp icon keys.
 * Keys match the Visual Keywords in assetStyles.js.
 */
const agencyIconKeyMap = {
  'NBI': 'ShieldCheck',
  'DFA': 'Passport',
  'PSA': 'FileText',
  'SSS': 'LandMark',
  'PhilHealth': 'HeartPulse',
  'Pag-IBIG': 'House',
  'BIR': 'Wallet',
  'LTO': 'Truck',
  'DTI': 'Briefcase',
  'PRC': 'GraduationCap',
  'DOJ': 'Scale',
  'POEA': 'Plane',
  'OWWA': 'Users',
  'COMELEC': 'UserCheck',
  'Barangay': 'MapPin',
  'Police': 'Police',
  'Post Office': 'Mail',
  'PHLPost': 'Mail',
};

/**
 * Detects the icon key (Visual Keyword) for a guide based on slug and agency.
 */
export const getIconName = (slug, agency) => {
  // 1. Highest Priority: Explicit Agency mapping
  if (agency) {
    const agencyName = Array.isArray(agency) ? agency[0] : agency;
    if (agencyIconKeyMap[agencyName]) {
      return agencyIconKeyMap[agencyName];
    }
  }

  // 2. Secondary Priority: Granular Slug Detection
  if (slug) {
    const s = slug.toLowerCase();
    
    // Very specific matches first
    if (s.includes('postal') || s.includes('mail')) return 'Mail';
    if (s.includes('police') || s.includes('nbi-clearance')) return 'Police';
    if (s.includes('visa') || s.includes('travel')) return 'Globe';
    
    // Pattern matches
    if (s.includes('clearance')) return 'FileCheck';
    if (s.includes('registration') || s.includes('permit')) return 'Building2';
    if (s.includes('bank') || s.includes('loan')) return 'LandMark';
    if (s.includes('school') || s.includes('student')) return 'GraduationCap';
    if (s.includes('business')) return 'Briefcase';
    if (s.includes('security') || s.includes('privacy') || s.includes('lock')) return 'Lock';
  }

  return 'FileText';
};

/**
 * Renders a custom webp icon based on guide slug and agency.
 */
export const GuideIcon = ({ slug, agency, size = 24, className = '', strokeWidth, ...props }) => {
  const iconName = getIconName(slug, agency);
  const iconPath = `/assets/guides/${iconName}.webp`;

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
