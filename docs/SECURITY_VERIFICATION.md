
# Security Verification Guide

This guide outlines how to manually verify the Security Hardening (CSRF, Sessions) and Rate Limiting features.

## 1. Verify Security Headers & Cookies
Open your application and use the browser **Developer Tools** (F12):

### Headers:
- Go to the **Network** tab and refresh.
- Click the main document (usually the first item).
- Look for `Content-Security-Policy`, `X-Frame-Options: DENY`, and `Strict-Transport-Security`.

### Cookies:
- Go to the **Application** (Chrome) or **Storage** (Firefox) tab.
- Under **Cookies**, verify that `next-auth.session-token` and `next-auth.csrf-token` are:
 - `HTTPOnly`: Yes (prevents JS access)
 - `SameSite`: `Strict` (for CSRF token) or `Lax` (for Session)

## 2. Verify Rate Limiting & Account Lockout (Manual)

### Account Lockout (User-Level)
1. Open the **Login** modal.
2. Enter a valid registered email but a **wrong password**.
3. Repeat **5 times**.
4. On the **6th attempt**, verify:
 - Status message says: *"Account temporarily locked. Try again in 15 minutes."*
 - A red **Security Alert** toast appears at the top.

### IP-Based Throttling (System-Level)
1. Try to **Sign Up** with different random emails rapidly.
2. After **5 attempts** within a minute, verify:
 - Status message says: *"Too many registration attempts. Please try again later."*
 - An **Action Throttled** toast appears.

## 3. Database "Peek Under the Hood"
The most reliable way to verify the logic is to check your MongoDB (using **MongoDB Compass**):

- **Users Collection**: Find your test user. Watch the `loginAttempts` field increment (1, 2, 3...) with each failed attempt. After the 5th, `lockUntil` will be populated with a future time.
- **RateLimits Collection**: You will see entries like `rate_limit:127.0.0.1:register`. The `points` field tracks how many times your IP has triggered that action.

---
**Tip**: If you block yourself during testing, you can reset your status in the DB by setting `loginAttempts: 0` and deleting the `lockUntil` field for your user.
