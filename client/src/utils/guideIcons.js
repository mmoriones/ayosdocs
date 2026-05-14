import nbiLogo from '../assets/nbi.webp';
import dfaLogo from '../assets/dfa.webp';
import psaLogo from '../assets/psa.webp';
import sssLogo from '../assets/sss.webp';
import philhealthLogo from '../assets/philhealth.webp';
import notepadLogo from '../assets/notepad.webp';

/**
 * Mapping of specific guide slugs to their corresponding logos.
 */
const iconMap = {
  'nbi-clearance': nbiLogo,
  'passport-appointment': dfaLogo,
  'psa-birth-certificate': psaLogo,
  'psa-cenomar-philippines': psaLogo,
  'psa-marriage-certificate': psaLogo,
  'national-id': psaLogo,
  'sss-registration': sssLogo,
  'philhealth-application': philhealthLogo,
};

/**
 * Mapping of government agencies to their default logos.
 */
const agencyMap = {
  'NBI': nbiLogo,
  'DFA': dfaLogo,
  'PSA': psaLogo,
  'SSS': sssLogo,
  'PhilHealth': philhealthLogo,
  // LGUs and other agencies currently use the default notepad icon
};

/**
 * Retrieves the appropriate icon for a guide based on its slug and/or agency.
 * 
 * @param {string} slug - The unique identifier for the guide.
 * @param {string|string[]} [agency] - The agency or agencies associated with the guide.
 * @returns {string} The path or URL to the icon image.
 */
export const getGuideIcon = (slug, agency) => {
  // 1. Try to find a specific icon for the slug
  if (iconMap[slug]) return iconMap[slug];

  // 2. Try to find an icon based on the agency (if provided)
  if (agency) {
    const agencyName = Array.isArray(agency) ? agency[0] : agency;
    if (agencyMap[agencyName]) return agencyMap[agencyName];
  }

  // 3. Smart detection based on slug prefix (fallback)
  if (slug.startsWith('psa-')) return psaLogo;
  if (slug.startsWith('bir-')) return notepadLogo; // Placeholder for BIR logo

  // 4. Default fallback
  return notepadLogo;
};

