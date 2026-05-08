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

export const getGuideIcon = (slug) => {
  return iconMap[slug] || notepadLogo;
};

