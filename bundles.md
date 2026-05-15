| Bundle / Life Milestone                  | Most Common Documents & Requirements                                                                                                                                                        | Typical Goal / Use Case                           | Common Dependency Flow                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------- | ----------------------------------------------------------------------------------- |
| **First Job / Fresh Graduate**           | PSA Birth Certificate, National ID/Valid ID, SSS Number, PhilHealth Registration, Pag-IBIG MID, TIN, NBI Clearance, Police Clearance, Barangay Clearance, First Time Job Seeker Certificate | Starting first employment                         | PSA Birth Certificate → Valid ID → Employment Documents → Job Onboarding            |
| **OFW / Going Abroad**                   | Passport, Visa Documents, PSA Birth/Marriage Certificate, NBI Clearance, Apostille, OEC, OWWA Membership, Medical Exam, Contract Verification                                               | Overseas work, migration, deployment              | PSA Docs → Passport → Visa → OEC → Deployment                                       |
| **Marriage / Civil Wedding**             | PSA Birth Certificate, CENOMAR, Marriage License, Valid IDs, Pre-Marriage Counseling Certificate, Witness Requirements, Parental Consent/Advice (if needed)                                 | Getting married legally                           | Birth Certificate + CENOMAR → Marriage License → Wedding → PSA Marriage Certificate |
| **Business Starter / Entrepreneur**      | DTI Registration, Barangay Clearance, Mayor’s Permit, BIR Registration, Books of Accounts, Official Receipts/Invoices, Business Address Proof, Valid IDs                                    | Starting a legal business                         | DTI → Barangay Clearance → Mayor’s Permit → BIR Registration                        |
| **College / Graduation**                 | PSA Birth Certificate, TOR, Diploma, Good Moral Certificate, School Records, Scholarship Forms, Valid IDs                                                                                   | Enrollment, graduation, board exams, scholarships | School Records → Graduation Docs → Employment / Further Studies                     |
| **Travel / Tourist Visa**                | Passport, PSA Birth Certificate, Visa Forms, Bank Statements, COE/ITR, Travel Itinerary, Hotel Bookings, Valid IDs                                                                          | International travel and visa applications        | Valid ID → Passport → Visa Requirements → Travel                                    |
| **Senior Citizen Benefits**              | Birth Certificate, Valid ID, Proof of Residence, Senior Citizen ID Application                                                                                                              | Accessing senior discounts and benefits           | Age Verification → Senior Citizen ID → Government Benefits                          |
| **PWD Benefits**                         | Medical Certificate, Valid ID, Barangay Certificate, PWD ID Application, Supporting Medical Documents                                                                                       | Accessing PWD privileges and discounts            | Medical Proof → PWD Registration → Benefits Access                                  |
| **Solo Parent Benefits**                 | Proof of Solo Parent Status, Children’s Birth Certificates, Barangay Certification, Financial/Support Documents                                                                             | Solo Parent ID and assistance programs            | Proof of Status → Solo Parent ID → Government Assistance                            |
| **General Identity / Foundational Docs** | PSA Birth Certificate, National ID, Barangay Clearance, Valid IDs                                                                                            | Unlocking most government processes               | PSA Birth Certificate → Valid ID → Access to Other Services                         |

---

# Requirement Bundles Implementation Plan (v2.0)

## Objective
Transition AyosDocs from a static guide library to a workflow-driven platform by implementing structured "Life Event Bundles" with dependency flows and persistent tracking.

## Phase 1: Data Architecture Refactoring
- **Task:** Update `src/data/bundles.js` to support chronological stages.
- **Changes:**
    - Convert `guides` array to a `flow` array.
    - Add `step`, `label`, and `guides` fields to each flow stage.
    - Add new bundles: OFW, College, Senior Citizen, PWD, Solo Parent, and General Identity.

## Phase 2: Bundles Library Page
- **Task:** Create a dedicated discovery page for bundles.
- **Key Files:**
    - `src/app/bundles/page.js` (Server Component)
    - `src/app/bundles/BundlesClient.js` (Client Component)
- **Features:**
    - Category-based filtering (Employment, Travel, etc.).
    - Search specifically for life goals.
    - Bundle-specific metadata display (Total docs, estimated time).

## Phase 3: Workflow Visualization
- **Task:** Implement the detailed bundle view with the dependency flow.
- **Key Files:**
    - `src/app/bundles/[slug]/page.js`
- **Features:**
    - Vertical timeline/step UI showing the "Common Dependency Flow".
    - "Add to My Progress" button that tracks all guides in the bundle.
    - Deep links to individual guide pages.

## Phase 4: Dashboard & Tracking Integration
- **Task:** Update the "My Progress" page to handle workflow-based tracking.
- **Key Files:**
    - `src/app/my-docs/ProgressClient.js`
    - `src/features/guides/components/tracking/BundleCard.js`
- **Features:**
    - Visualizing progress by "Stage" (e.g., "Stage 1: 2/2 Complete").
    - Aggregate progress bars for bundles.

## Verification & Testing
- **Manual Test:** Verify that completing a guide in one bundle automatically updates the progress in another bundle containing the same guide.
- **UI Test:** Ensure the timeline UI correctly displays the sequence defined in the dependency flow.
- **Data Test:** Validate that all new bundles from `bundles.md` are correctly rendered in the library.

