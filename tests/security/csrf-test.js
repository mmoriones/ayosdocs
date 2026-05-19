const axios = require('axios');

/**
 * CSRF Protection Test
 * 
 * This script verifies that the API routes block requests with untrusted Origin/Referer headers.
 * 
 * Usage: 
 * 1. Start the dev server: npm run dev
 * 2. Run test: node tests/security/csrf-test.js
 */
async function testCSRF() {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const targetUrl = `${baseUrl}/api/user/update-progress`;

  try {
    console.log(`Testing API at ${targetUrl} with spoofed Origin...`);
    
    const response = await axios.post(targetUrl, {
      guideSlug: 'nbi-clearance',
      completedTasks: [0]
    }, {
      headers: {
        'Origin': 'https://evil-attacker.com',
        'Referer': 'https://evil-attacker.com/',
        'Content-Type': 'application/json'
      }
    });

    console.log("Result:", response.status, response.data);
    console.log("FAILED: Request was NOT blocked by CSRF protection.");
  } catch (error) {
    if (error.response) {
      console.log("Status:", error.response.status);
      console.log("Message:", error.response.data.message);
      
      if (error.response.status === 403) {
        console.log("SUCCESS: Request blocked by CSRF protection (403 Forbidden).");
      } else if (error.response.status === 401) {
        console.log("ℹINFO: Request blocked by Authentication (401 Unauthorized). CSRF check is likely behind auth or both are active.");
      } else {
        console.log("FAILED: Unexpected status code.");
      }
    } else {
      console.error("Error:", error.message);
      console.log("Note: Make sure your development server is running at", baseUrl);
    }
  }
}

testCSRF();
