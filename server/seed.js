require('dotenv').config();
const mongoose = require('mongoose');
const Guide = require('./models/Guide');

const addGuide = async (guideData) => {
  try {
    const result = await Guide.findOneAndUpdate(
      { slug: guideData.slug },
      guideData,
      { upsert: true, returnDocument: 'after' }
    );
    console.log(`✅ Processed: ${result.title}`);
  } catch (err) {
    console.error(`❌ Error processing ${guideData.slug}:`, err);
  }
};

const currentGuides = [
  {
    title: "NBI Clearance (New Applicant)",
    slug: "nbi-clearance-guide",
    content: `
      <h2>1. Online Registration</h2>
      <p>The first step is to visit the official NBI Clearance website and create an account. Ensure all details match your valid IDs.</p>
      <div class="ad-placeholder">[In-Article Ad Placeholder]</div>
      <h2>2. Appointment & Payment</h2>
      <p>After registering, select your preferred NBI branch and schedule an appointment. You can pay the fee (approx. 130 PHP + service fee) via GCash, Maya, or 7-Eleven.</p>
      <h2>3. Biometrics & Photo Capture</h2>
      <p>On your appointment date, bring your printed application form or reference number along with two valid government-issued IDs.</p>
    `,
    checklist: [
      { task: "Register Online Account", completed: true },
      { task: "Schedule Appointment", completed: false },
      { task: "Pay Application Fee", completed: false },
      { task: "Biometrics & Photo", completed: false },
      { task: "Claim Clearance", completed: false }
    ],
    category: "Legal"
  },
  {
    title: "Lorem Ipsum (New Applicant)",
    slug: "lorem-ipsum-guide",
    content: `
      <h2>1. Online Registration</h2>
      <p>The first step is to visit the official NBI Clearance website and create an account. Ensure all details match your valid IDs.</p>
      <div class="ad-placeholder">[In-Article Ad Placeholder]</div>
      <h2>2. Appointment & Payment</h2>
      <p>After registering, select your preferred NBI branch and schedule an appointment. You can pay the fee (approx. 130 PHP + service fee) via GCash, Maya, or 7-Eleven.</p>
      <h2>3. Biometrics & Photo Capture</h2>
      <p>On your appointment date, bring your printed application form or reference number along with two valid government-issued IDs.</p>
    `,
    checklist: [
      { task: "Lorem Ipsum", completed: true },
      { task: "Lorem Ipsum", completed: true },
      { task: "Lorem Ipsum", completed: false },
      { task: "Lorem Ipsum", completed: true },
      { task: "Lorem Ipsum", completed: false }
    ],
    category: "Legal"
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🚀 Starting database sync...');

    // Use Promise.all to run the addGuide function for every guide in your array
    await Promise.all(currentGuides.map(guide => addGuide(guide)));

    console.log('✨ All guides synchronized! Press Ctrl+C to exit.');
  })
  .catch(err => console.error('❌ Connection error:', err));