'use client';

import Image from 'next/image';
import { Mail, User } from 'lucide-react';

/**
 * SocialProviders Component
 * Renders standardized social login buttons (Google, Guest, etc.)
 */
export function SocialProviders({ 
  onGoogleLogin, 
  onEmailClick, 
  onGuestClick,
  isExchanging,
  showEmailOption = true,
  variant = 'modal' // 'modal' or 'page'
}) {
  const isPage = variant === 'page';

  return (
    <div className="space-y-4 w-full">
      <div className={isPage ? "grid grid-cols-2 gap-3" : "space-y-4"}>
        <button
          onClick={onGoogleLogin}
          disabled={isExchanging}
          className={`w-full flex items-center justify-center gap-3 bg-ctp-base border border-ctp-surface1 hover:bg-ctp-mantle text-ctp-text font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 ${
            isPage ? 'py-3.5 text-[10px] uppercase tracking-widest' : 'py-3.5'
          }`}
        >
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={isPage ? 14 : 18}
            height={isPage ? 14 : 18}
          />
          {isPage ? 'Google' : 'Continue with Google'}
        </button>

        {onGuestClick && (
          <button
            onClick={onGuestClick}
            disabled={isExchanging}
            className={`w-full flex items-center justify-center gap-3 bg-ctp-base border border-ctp-surface1 hover:bg-ctp-mantle text-ctp-text font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 ${
              isPage ? 'py-3.5 text-[10px] uppercase tracking-widest' : 'py-3.5'
            }`}
          >
            <User size={isPage ? 14 : 18} className="text-ctp-subtext1" />
            {isPage ? 'Guest' : 'Continue as Guest'}
          </button>
        )}
      </div>

      {showEmailOption && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-ctp-surface1"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className={`${isPage ? 'bg-ctp-base' : 'bg-ctp-mantle'} px-2 text-ctp-subtext1 font-semibold`}>
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={onEmailClick}
            disabled={isExchanging}
            className={`w-full flex items-center justify-center gap-3 bg-ctp-surface0 hover:bg-ctp-surface1 text-ctp-text font-semibold rounded-xl transition-all active:scale-[0.98] shadow-sm disabled:opacity-50 ${
              isPage ? 'py-3 text-xs uppercase tracking-widest' : 'py-3.5'
            }`}
          >
            <Mail size={isPage ? 14 : 18} className="text-ctp-subtext1" />
            Email and Password
          </button>
        </>
      )}
    </div>
  );
}
