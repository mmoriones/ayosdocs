import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  FileText, 
  CreditCard, 
  HeartPulse, 
  Briefcase,
  FileSearch,
  Users,
  Building2,
  FileCheck,
  Sticker,
  UserCheck,
  Truck,
  GraduationCap,
  Scale,
  Hotel,
  Passport,
  BadgeCheck,
  Globe,
  Wallet,
  Landmark,
  FileStack,
  Contact2,
  Plane
} from 'lucide-react';

/**
 * Mapping of government agencies to Lucide icons for legal safety.
 */
const agencyMap = {
  'NBI': ShieldCheck,
  'DFA': Globe,
  'PSA': FileText,
  'SSS': Landmark,
  'PhilHealth': HeartPulse,
  'Pag-IBIG': Hotel,
  'BIR': Wallet,
  'LTO': Truck,
  'DTI': Briefcase,
  'PRC': GraduationCap,
  'DOJ': Scale,
  'POEA': Plane,
  'OWWA': Users,
  'COMELEC': UserCheck,
  'Barangay': MapPin,
  'Police': ShieldCheck,
  'Post Office': Contact2,
};

/**
 * Renders a Lucide icon based on guide slug and agency.
 * Using a component approach to satisfy React best practices.
 */
export const GuideIcon = ({ slug, agency, ...props }) => {
  let IconComponent = FileText;

  if (agency) {
    const agencyName = Array.isArray(agency) ? agency[0] : agency;
    if (agencyMap[agencyName]) {
      IconComponent = agencyMap[agencyName];
    }
  }

  // Fallback to slug-based detection if agency doesn't match
  if (IconComponent === FileText) {
    if (slug.includes('clearance')) IconComponent = FileCheck;
    else if (slug.includes('registration')) IconComponent = FileSearch;
    else if (slug.includes('license')) IconComponent = CreditCard;
    else if (slug.includes('id')) IconComponent = Sticker;
    else if (slug.includes('permit')) IconComponent = Building2;
    else if (slug.includes('psa-')) IconComponent = FileStack;
  }
  
  return <IconComponent {...props} />;
};
