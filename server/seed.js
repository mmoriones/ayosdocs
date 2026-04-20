require('dotenv').config();
const mongoose = require('mongoose');
const Guide = require('./models/Guide');

const sampleGuides = [
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
  }
];

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('🌱 Seeding database...');
    await Guide.deleteMany({}); // Clears existing guides to avoid duplicates
    await Guide.insertMany(sampleGuides);
    console.log('✅ Seeding complete! Press Ctrl+C to exit.');
  })
  .catch(err => console.error('❌ Seeding error:', err));