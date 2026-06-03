'use client';

import Image from 'next/image';
import { User } from 'lucide-react';
import { Button } from '@/components/ui';

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
        <Button
          variant="secondary"
          onClick={onGoogleLogin}
          disabled={isExchanging}
          isLoading={exchangingMethod === 'google'}
          leftIcon={
            <Image
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="Google"
              width={18}
              height={18}
            />
          }
          className={`w-full rounded-full font-bold ${isPage ? 'h-14 text-[15px]' : 'h-12 text-[14px]'} disabled:cursor-not-allowed`}
        >
          Google
        </Button>

        {onGuestClick && (
          <Button
            variant="secondary"
            onClick={onGuestClick}
            disabled={isExchanging}
            leftIcon={<User size={18} className="text-[#0038A8]" strokeWidth={2.5} />}
            className={`w-full rounded-full font-bold ${isPage ? 'h-14 text-[15px]' : 'h-12 text-[14px]'} disabled:cursor-not-allowed`}
          >
            Guest
          </Button>
        )}
      </div>

      {showEmailOption && (
        <div className="flex items-center gap-4 py-3">
          <span className="flex-1 border-t border-gray-100"></span>
          <span className="text-[11px] text-gray-400 font-bold uppercase tracking-[0.2em] shrink-0">
            Or Continue With
          </span>
          <span className="flex-1 border-t border-gray-100"></span>
        </div>
      )}
    </div>
  );
}
