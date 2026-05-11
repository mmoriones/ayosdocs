/**
 * Predefined Life Event Bundles (Requirement Bundles)
 * These bundles group related guides to help users achieve specific life goals.
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
      // 'cenomar', // Future guide
      // 'marriage-license' // Future guide
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
      'philhealth-application',
      // 'tin-registration' // Future guide
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
      'philhealth-application',
      // 'sss-maternity', // Future guide
    ],
    category: 'Civil Documents'
  }
];
