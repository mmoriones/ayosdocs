/**
 * Predefined Life Event Bundles (Requirement Bundles)
 * Focused on the 10 core milestones defined in the project roadmap.
 */
export const bundles = [
  {
    id: 'first-job',
    title: 'First Job / Fresh Graduate',
    description: 'Essential documents for starting your first employment.',
    icon: '🎓',
    category: 'Employment',
    flow: [
      { 
        step: 1, 
        label: 'Foundational Documents', 
        guides: ['psa-birth-certificate', 'national-id'] 
      },
      { 
        step: 2, 
        label: 'Local Clearances', 
        guides: ['barangay-clearance', 'police-clearance', 'nbi-clearance'] 
      },
      { 
        step: 3, 
        label: 'Government Registrations', 
        guides: ['bir-tin-registration', 'sss-registration', 'philhealth-registration', 'pag-ibig-registration'] 
      }
    ]
  },
  {
    id: 'ofw',
    title: 'OFW / Going Abroad',
    description: 'Work, migration, and deployment requirements for Filipinos.',
    icon: '✈️',
    category: 'Travel',
    flow: [
      { 
        step: 1, 
        label: 'Identity & Civil Docs', 
        guides: ['psa-birth-certificate', 'psa-marriage-certificate', 'national-id'] 
      },
      { 
        step: 2, 
        label: 'Travel Documents', 
        guides: ['passport-appointment', 'nbi-clearance', 'dfa-apostille'] 
      },
      { 
        step: 3, 
        label: 'Deployment Essentials', 
        guides: ['owwa-membership'] 
      }
    ]
  },
  {
    id: 'wedding',
    title: 'Marriage / Civil Wedding',
    description: 'Step-by-step requirements for getting married legally.',
    icon: '💍',
    category: 'Civil Documents',
    flow: [
      { 
        step: 1, 
        label: 'Required Certificates', 
        guides: ['psa-birth-certificate', 'psa-cenomar'] 
      },
      { 
        step: 2, 
        label: 'Legal Application', 
        guides: ['marriage-license'] 
      },
      { 
        step: 3, 
        label: 'Post-Wedding Docs', 
        guides: ['psa-marriage-certificate'] 
      }
    ]
  },
  {
    id: 'business',
    title: 'Business Starter / Entrepreneur',
    description: 'Registration essentials for starting a legal business in the Philippines.',
    icon: '🏢',
    category: 'Business',
    flow: [
      { 
        step: 1, 
        label: 'Primary Registration', 
        guides: ['dti-registration', 'national-id'] 
      },
      { 
        step: 2, 
        label: 'Local Permits', 
        guides: ['barangay-clearance', 'mayors-permit'] 
      },
      { 
        step: 3, 
        label: 'Tax & Compliance', 
        guides: ['bir-1901-registration'] 
      }
    ]
  },
  {
    id: 'travel-tourist',
    title: 'Travel / Tourist Visa',
    description: 'Documents needed for international travel and visa applications.',
    icon: '🌍',
    category: 'Travel',
    flow: [
      { 
        step: 1, 
        label: 'Foundational ID', 
        guides: ['national-id'] 
      },
      { 
        step: 2, 
        label: 'Primary Travel Doc', 
        guides: ['passport-appointment'] 
      },
      { 
        step: 3, 
        label: 'Supporting Evidence', 
        guides: ['psa-birth-certificate'] 
      }
    ]
  },
  {
    id: 'senior-citizen',
    title: 'Senior Citizen Benefits',
    description: 'Accessing discounts, privileges, and government benefits for seniors.',
    icon: '👵',
    category: 'Benefits',
    flow: [
      { 
        step: 1, 
        label: 'Age Verification', 
        guides: ['psa-birth-certificate', 'national-id'] 
      },
      { 
        step: 2, 
        label: 'Benefit Application', 
        guides: ['senior-citizen-id'] 
      }
    ]
  },
  {
    id: 'pwd-benefits',
    title: 'PWD Benefits',
    description: 'Accessing PWD privileges and discounts.',
    icon: '♿',
    category: 'Benefits',
    flow: [
      { 
        step: 1, 
        label: 'Foundational Docs', 
        guides: ['national-id', 'barangay-clearance'] 
      },
      { 
        step: 2, 
        label: 'PWD Registration', 
        guides: ['pwd-id'] 
      }
    ]
  },
  {
    id: 'solo-parent',
    title: 'Solo Parent Benefits',
    description: 'Solo Parent ID and government assistance programs.',
    icon: '👪',
    category: 'Benefits',
    flow: [
      { 
        step: 1, 
        label: 'Family Documents', 
        guides: ['psa-birth-certificate', 'barangay-clearance'] 
      },
      { 
        step: 2, 
        label: 'Status Application', 
        guides: ['solo-parent-id'] 
      }
    ]
  },
  {
    id: 'foundational-docs',
    title: 'General Identity / Foundational',
    description: 'The core documents needed to unlock most government services.',
    icon: '🆔',
    category: 'Civil Documents',
    flow: [
      { 
        step: 1, 
        label: 'Primary Identity', 
        guides: ['psa-birth-certificate'] 
      },
      { 
        step: 2, 
        label: 'Secondary Verification', 
        guides: ['barangay-clearance'] 
      },
      { 
        step: 3, 
        label: 'National Recognition', 
        guides: ['national-id'] 
      }
    ]
  }
];
