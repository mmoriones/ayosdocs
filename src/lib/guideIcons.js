/**
 * Mapping of specific guide slugs to their corresponding logos.
 */
const iconMap = {
  'nbi-clearance': '/assets/nbi.webp',
  'passport-appointment': '/assets/dfa.webp',
  'psa-birth-certificate': '/assets/psa.webp',
  'psa-cenomar': '/assets/psa.webp',
  'psa-marriage-certificate': '/assets/psa.webp',
  'national-id': '/assets/psa.webp',
  'sss-registration': '/assets/sss.webp',
  'philhealth-registration': '/assets/philhealth.webp',
};

/**
 * Mapping of government agencies to their default logos.
 */
const agencyMap = {
  'NBI': '/assets/nbi.webp',
  'DFA': '/assets/dfa.webp',
  'PSA': '/assets/psa.webp',
  'SSS': '/assets/sss.webp',
  'PhilHealth': '/assets/philhealth.webp',
};

/**
 * Retrieves the appropriate icon for a guide based on its slug and/or agency.
 * 
 * @param {string} slug - The unique identifier for the guide.
 * @param {string|string[]} [agency] - The agency or agencies associated with the guide.
 * @returns {string} The URL to the icon image.
 */
export const getGuideIcon = (slug, agency) => {
  if (iconMap[slug]) return iconMap[slug];

  if (agency) {
    const agencyName = Array.isArray(agency) ? agency[0] : agency;
    if (agencyMap[agencyName]) return agencyMap[agencyName];
  }

  if (slug.startsWith('psa-')) return '/assets/psa.webp';
  
  return '/assets/notepad.webp';
};
