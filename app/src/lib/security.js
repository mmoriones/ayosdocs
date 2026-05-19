import { headers } from 'next/headers';

/**
 * Validates the request origin/referer against the application's base URL.
 * This is a basic CSRF protection for API Route Handlers.
 * Note: Server Actions have this built-in.
 * 
 * @returns {boolean} True if the request is from a trusted origin.
 */
export async function validateCSRF() {
  const headersList = await headers();
  const origin = headersList.get('origin');
  const referer = headersList.get('referer');
  
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const url = new URL(baseUrl);
  const trustedOrigin = url.origin;

  // Origin check
  if (origin && origin !== trustedOrigin) {
    return false;
  }

  // Referer check (fallback if origin is missing)
  if (!origin && referer) {
    try {
      const refererUrl = new URL(referer);
      if (refererUrl.origin !== trustedOrigin) {
        return false;
      }
    } catch (e) {
      return false;
    }
  }

  // If both are missing, we might want to block in production
  if (!origin && !referer && process.env.NODE_ENV === 'production') {
    return false;
  }

  return true;
}
