/**
 * Predefined Life Event Bundles (Requirement Bundles)
 */
export const bundles = [
  {
    id: 'wedding',
    title: 'Getting Married',
    description: 'Track all marriage requirements in one place.',
    icon: '💍',
    guides: [
      'psa-birth-certificate',
      'nbi-clearance',
      'national-id',
    ],
    category: 'Civil Documents'
  },
  {
    id: 'first-job',
    title: 'Starting Your First Job',
    description: 'Government IDs and employment requirements.',
    icon: '💼',
    guides: [
      'nbi-clearance',
      'national-id',
      'sss-registration',
      'philhealth-registration',
    ],
    category: 'Employment'
  },
  {
    id: 'newborn',
    title: 'New Baby Requirements',
    description: 'Birth registration and dependent setup.',
    icon: '👶',
    guides: [
      'psa-birth-certificate',
      'philhealth-registration',
    ],
    category: 'Civil Documents'
  },
  {
    id: 'travel',
    title: 'Traveling Abroad',
    description: 'Passport and travel documents.',
    icon: '✈️',
    guides: [
      'passport-appointment',
      'national-id',
      'psa-birth-certificate'
    ],
    category: 'Travel'
  },
  {
    id: 'business',
    title: 'Starting a Business',
    description: 'Business registration essentials.',
    icon: '🏢',
    guides: [
      'national-id',
    ],
    category: 'Business'
  }
];
