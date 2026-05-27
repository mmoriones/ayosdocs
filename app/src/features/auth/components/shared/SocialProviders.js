'use client';

import Image from 'next/image';
import { Loader2, Mail, User } from 'lucide-react';

/**
 * SocialProviders Component
 * Renders standardized social login buttons (Google, Guest, etc.)
 */
export function SocialProviders({ 
  onGoogleLogin, 
  onEmailClick, 
  onGuestClick,
  isExchanging,
  exchangingMethod,
  showEmailOption = true,
  variant = 'modal' // 'modal' or 'page'
}) {
  const isPage = variant === 'page';

  return (
    <div className="space-y-4 w-full">
      <div className={isPage ? "grid grid-cols-2 gap-3" : "space-y-3"}>
        <button
          onClick={onGoogleLogin}
          disabled={isExchanging}
          className={`w-full flex items-center justify-center gap-2.5 bg-ctp-base border border-ctp-surface1 hover:border-ctp-surface2 hover:bg-ctp-mantle text-ctp-text font-normal rounded-lg transition-all active:scale-[0.98] shadow-sm disabled:cursor-not-allowed ${
            isPage ? 'py-2.5 text-[13px]' : 'py-3'
          }`}
        >
          {exchangingMethod === 'google' ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={16}
              height={16}
            />
          )}
          Continue with Google
        </button>

        {onGuestClick && (
          <button
            onClick={onGuestClick}
            disabled={isExchanging}
            className={`w-full flex items-center justify-center gap-2.5 bg-ctp-base border border-ctp-surface1 hover:border-ctp-surface2 hover:bg-ctp-mantle text-ctp-text font-normal rounded-lg transition-all active:scale-[0.98] shadow-sm disabled:cursor-not-allowed ${
              isPage ? 'py-2.5 text-[13px]' : 'py-3'
            }`}
          >
            <User size={16} className="text-ctp-text" />
            Continue as Guest
          </button>
        )}
      </div>

      {showEmailOption && (
        <>
          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-ctp-surface1"></span>
            </div>
            <div className="relative flex justify-center text-[11px]">
              <span className={`${isPage ? 'bg-ctp-base' : 'bg-ctp-mantle'} px-4 text-ctp-subtext1 font-medium`}>
                or
              </span>
            </div>
          </div>

          <button
            onClick={onEmailClick}
            disabled={isExchanging}
            className={`w-full flex items-center justify-center gap-2.5 bg-ctp-base border border-ctp-surface1 hover:border-ctp-surface2 hover:bg-ctp-mantle text-ctp-text font-normal rounded-lg transition-all active:scale-[0.98] shadow-sm disabled:cursor-not-allowed ${
              isPage ? 'py-3 text-[13px]' : 'py-3.5'
            }`}
          >
            <Mail size={16} className="text-ctp-text" />
            Continue with Email
          </button>
        </>
      )}
    </div>
  );
}
