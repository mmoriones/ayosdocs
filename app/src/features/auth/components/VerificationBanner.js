'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { AlertTriangle, Send, Loader2, CheckCircle } from 'lucide-react';
import { resendVerificationAction } from '@/app/actions/user';
import { useToast } from '@/context/ToastContext';

/**
 * VerificationBanner Component
 * 
 * Displayed for logged-in users who haven't verified their email.
 */
export default function VerificationBanner() {
  const { data: session, update } = useSession();
  const { showToast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Don't show if not logged in or already verified
  if (!session?.user || session.user.isVerified) {
    return null;
  }

  const handleResend = async () => {
    setIsResending(true);
    try {
      const result = await resendVerificationAction();
      if (result.success) {
        setIsSent(true);
        showToast({
          type: 'success',
          title: 'Verification Sent',
          message: result.message
        });
        // Reset "sent" state after a while to allow another attempt if needed (though limited by action)
        setTimeout(() => setIsSent(false), 60000);
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: result.message
        });
      }
    } catch (error) {
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to resend verification email.'
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-ctp-yellow-800/10 border-b border-ctp-yellow-800/20 py-2.5 px-6 lg:px-8">
      <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-ctp-yellow-800">
          <AlertTriangle size={18} className="shrink-0" />
          <p className="text-xs sm:text-sm font-semibold">
            Your email is not verified. Please check your inbox or resend the link.
          </p>
        </div>

        <button
          onClick={handleResend}
          disabled={isResending || isSent}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-ctp-yellow-800 text-ctp-base text-[11px] sm:text-[12px] font-bold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
        >
          {isResending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Sending...
            </>
          ) : isSent ? (
            <>
              <CheckCircle size={14} />
              Link Sent
            </>
          ) : (
            <>
              <Send size={14} />
              Resend Link
            </>
          )}
        </button>
      </div>
    </div>
  );
}
