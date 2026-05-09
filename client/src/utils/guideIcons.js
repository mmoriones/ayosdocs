import nbiLogo from '../assets/nbi.webp';
import dfaLogo from '../assets/dfa.webp';
import psaLogo from '../assets/psa.webp';
import sssLogo from '../assets/sss.webp';
import philhealthLogo from '../assets/philhealth.webp';
import notepadLogo from '../assets/notepad.webp';

const iconMap = {
  'nbi-clearance': nbiLogo,
  'passport-appointment': dfaLogo,
  'psa-birth-certificate': psaLogo,
  'national-id': psaLogo,
  'sss-registration': sssLogo,
  'philhealth-application': philhealthLogo,
};

/**
 * Retrieves the appropriate icon for a guide based on its slug.
 * Falls back to a default notepad icon if no specific logo is found.
 * 
 * @param {string} slug - The slug of the guide.
 * @returns {string} The path or URL to the icon image.
 */
export const getGuideIcon = (slug) => {
  return iconMap[slug] || notepadLogo;
};

