'use client';

import Image from 'next/image';
import { Loader2, Mail, User } from 'lucide-react';

/**
 * SocialProviders Component
 * Renders standardized social login buttons (Google, Guest, etc.)
 */
export function SocialProviders({ 
  onGoogleLogin, 
  onGuestClick,
  isExchanging,
  exchangingMethod,
  showEmailOption = true,
  variant = 'modal' // 'modal' or 'page'
}) {
  const isPage = variant === 'page';

  return (
    <div className="space-y-3 w-full">
      <div className={onGuestClick ? "grid grid-cols-2 gap-3" : "space-y-3"}>
        <button
          onClick={onGoogleLogin}
          disabled={isExchanging}
          className={`w-full flex items-center justify-center gap-2.5 bg-white border border-gray-100 hover:border-gray-200 text-[#1C1C1E] font-bold rounded-2xl transition-all active:scale-[0.98] shadow-[0_4px_12px_rgba(0,0,0,0.03)] disabled:cursor-not-allowed ${
            isPage ? 'py-4 text-[15px]' : 'py-3.5 text-[14px]'
          }`}
        >
          {exchangingMethod === 'google' ? (
            <Loader2 size={18} className="animate-spin text-[#0038A8]" />
          ) : (
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={18}
              height={18}
            />
          )}
          Google
        </button>

        {onGuestClick && (
          <button
            onClick={onGuestClick}
            disabled={isExchanging}
            className={`w-full flex items-center justify-center gap-2.5 bg-white border border-gray-100 hover:border-gray-200 text-[#1C1C1E] font-bold rounded-2xl transition-all active:scale-[0.98] shadow-[0_4px_12px_rgba(0,0,0,0.03)] disabled:cursor-not-allowed ${
              isPage ? 'py-4 text-[15px]' : 'py-3.5 text-[14px]'
            }`}
          >
            <User size={18} className="text-[#0038A8]" strokeWidth={2.5} />
            Guest
          </button>
        )}
      </div>

      {showEmailOption && (
        <div className="relative py-3">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-gray-100"></span>
          </div>
          <div className="relative flex justify-center text-[11px]">
            <span className="bg-white px-4 text-gray-400 font-bold uppercase tracking-[0.2em]">
              Or Continue With
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
