import { 
  GraduationCap, 
  Plane, 
  Heart, 
  Briefcase, 
  Scroll, 
  Globe, 
  UserRound, 
  Accessibility, 
  Users, 
  Fingerprint,
  Layers
} from 'lucide-react';

/**
 * Helper to get Lucide icon for a bundle.
 * 
 * @param {string} id - The unique identifier for the bundle.
 * @param {object} props - Optional props for the icon (size, color, etc.)
 * @returns {JSX.Element} The Lucide icon component.
 */
export const getBundleIcon = (id, props = { className: "text-ctp-sky-800", size: 32 }) => {
  switch (id) {
    case 'first-job': return <GraduationCap {...props} />;
    case 'ofw': return <Plane {...props} />;
    case 'wedding': return <Heart {...props} />;
    case 'business': return <Briefcase {...props} />;
    case 'college-graduation': return <Scroll {...props} />;
    case 'travel-tourist': return <Globe {...props} />;
    case 'senior-citizen': return <UserRound {...props} />;
    case 'pwd-benefits': return <Accessibility {...props} />;
    case 'solo-parent': return <Users {...props} />;
    case 'foundational-docs': return <Fingerprint {...props} />;
    default: return <Layers {...props} />;
  }
};
