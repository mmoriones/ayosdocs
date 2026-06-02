/**
 * Centralized Design System for AyosDocs 3D Assets.
 * Consolidates similar colors into 6 core themes to ensure visual consistency.
 * Colors are pulled from CSS variables in globals.css.
 */

// Helper to create a richer gradient with clear contrast. 
// Reversed: Darker at bottom to provide a grounded "shelf" look
const createGradient = (darker, lighter) => `linear-gradient(to top, ${darker}, ${lighter})`;

export const THEMES = {
  BLUE:   { bg: 'var(--theme-blue-light)',   gradient: createGradient('var(--theme-blue-dark)', 'var(--theme-blue-light)'),   ripple: 'rgba(0, 0, 0, 0.05)', ring: '#0038A8' }, 
  PURPLE: { bg: 'var(--theme-purple-light)', gradient: createGradient('var(--theme-purple-dark)', 'var(--theme-purple-light)'), ripple: 'rgba(0, 0, 0, 0.05)', ring: '#0038A8' },
  GREEN:  { bg: 'var(--theme-green-light)',  gradient: createGradient('var(--theme-green-dark)', 'var(--theme-green-light)'),  ripple: 'rgba(0, 0, 0, 0.05)', ring: '#0038A8' },
  ORANGE: { bg: 'var(--theme-orange-light)', gradient: createGradient('var(--theme-orange-dark)', 'var(--theme-orange-light)'), ripple: 'rgba(0, 0, 0, 0.05)', ring: '#0038A8' },
  GOLD:   { bg: 'var(--theme-gold-light)',   gradient: createGradient('var(--theme-gold-dark)', 'var(--theme-gold-light)'),   ripple: 'rgba(0, 0, 0, 0.05)', ring: '#0038A8' },
  PINK:   { bg: 'var(--theme-pink-light)',   gradient: createGradient('var(--theme-pink-dark)', 'var(--theme-pink-light)'),   ripple: 'rgba(0, 0, 0, 0.05)', ring: '#0038A8' },
  GRAY:   { bg: 'var(--theme-gray-light)',   gradient: createGradient('var(--theme-gray-dark)', 'var(--theme-gray-light)'),   ripple: 'rgba(0, 0, 0, 0.05)', ring: '#0038A8' },
  TEAL:   { bg: 'var(--theme-teal-light)',   gradient: createGradient('var(--theme-teal-dark)', 'var(--theme-teal-light)'),   ripple: 'rgba(0, 0, 0, 0.05)', ring: '#0038A8' },
  CORAL:  { bg: 'var(--theme-coral-light)',  gradient: createGradient('var(--theme-coral-dark)', 'var(--theme-coral-light)'),  ripple: 'rgba(0, 0, 0, 0.05)', ring: '#0038A8' },
};

/**
 * Mapping of Guide Icons to their respective themes.
 */
export const iconStyles = {
  // Common Guide Slugs for Trending
  'passport-appointment': THEMES.BLUE,
  'nbi-clearance':         THEMES.BLUE,
  'psa-birth-certificate': THEMES.PURPLE,
  'drivers-license':       THEMES.PURPLE,

  // Fallback Agency Names
  'NBI': THEMES.BLUE,
  'DFA': THEMES.BLUE,
  'PSA': THEMES.PURPLE,
  'SSS': THEMES.BLUE,
  'PhilHealth': THEMES.GREEN,
  'Pag-IBIG': THEMES.ORANGE,
  'BIR': THEMES.GOLD,
  'LTO': THEMES.BLUE,
  'DTI': THEMES.GOLD,
  'PRC': THEMES.PURPLE,
  'DOJ': THEMES.GOLD,
  'POEA': THEMES.BLUE,
  'OWWA': THEMES.BLUE,
  'COMELEC': THEMES.GREEN,
  'Barangay': THEMES.PINK,
  'Police': THEMES.BLUE,
  'Post Office': THEMES.BLUE,
  'LGU': THEMES.GREEN,
  
  // Visual Keywords
  'ShieldCheck': THEMES.BLUE,
  'Passport':    THEMES.BLUE,
  'LandMark':    THEMES.BLUE,
  'Truck':       THEMES.BLUE,
  'Plane':       THEMES.BLUE,
  'Users':       THEMES.BLUE,
  'Globe':       THEMES.BLUE,
  'Lock':        THEMES.BLUE,
  'Police':      THEMES.BLUE,
  'FileText':    THEMES.PURPLE,
  'GraduationCap': THEMES.PURPLE,
  'CreditCard':    THEMES.PURPLE,
  'FileCheck':   THEMES.GREEN,
  'HeartPulse':  THEMES.GREEN,
  'UserCheck':   THEMES.GREEN,
  'House':       THEMES.ORANGE,
  'Id':          THEMES.ORANGE,
  'Mail':        THEMES.ORANGE,
  'Wallet':      THEMES.GOLD,
  'Briefcase':   THEMES.GOLD,
  'Scale':       THEMES.GOLD,
  'MapPin':      THEMES.PINK,
  'Building2':   THEMES.GRAY,
};

/**
 * Utility to get the best theme for a guide.
 * Priority: Specific Slug > Visual Keyword > Agency > Default.
 */
export const getIconTheme = (slug, agency, iconName) => {
  if (slug && iconStyles[slug]) return iconStyles[slug];
  if (iconName && iconStyles[iconName]) return iconStyles[iconName];
  if (agency) {
    const agencyName = Array.isArray(agency) ? agency[0] : agency;
    if (iconStyles[agencyName]) return iconStyles[agencyName];
  }
  return THEMES.BLUE;
};

/**
 * Mapping of Bundle IDs to their respective themes.
 * Uses CSS variables for consistent theming.
 */
export const bundleStyles = {
  'first-job':          THEMES.BLUE,
  'ofw':                THEMES.GREEN,
  'wedding':            THEMES.PINK,
  'business':           THEMES.GOLD,
  'college-graduation': THEMES.PURPLE,
  'travel-tourist':     THEMES.PURPLE,
  'senior-citizen':     THEMES.GREEN,
  'pwd-benefits':       THEMES.BLUE,
  'solo-parent':        THEMES.ORANGE,
  'foundational-docs':  THEMES.GREEN,
};
