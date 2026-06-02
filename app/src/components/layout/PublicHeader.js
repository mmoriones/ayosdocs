'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { LogIn, UserPlus } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui';

/**
 * Clean, minimalistic header for public-facing pages.
 * Features theme toggling and authentication triggers.
 */
export default function PublicHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();

  const isLoginPage = pathname === '/login';
  const isSignupPage = pathname === '/signup';

  return (
    <header className="h-16 z-50">
      <div className="max-w-[1600px] mx-auto h-full px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3 z-50">
          <Image 
            src="/ayosdocs.webp"
            alt="AyosDocs"
            width={32}
            height={32}
            className="shrink-0"
          />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-ctp-sky-800">Ayos</span>Docs
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          {!session && isSignupPage && (
            <Button variant="primary" size="sm" onClick={() => router.push('/login')} leftIcon={<LogIn size={16} />} className="text-sm px-5 py-2">
              Sign In
            </Button>
          )}

          {!session && isLoginPage && (
            <Button variant="primary" size="sm" onClick={() => router.push('/signup')} leftIcon={<UserPlus size={16} />} className="text-sm px-5 py-2">
              Sign Up
            </Button>
          )}

          {!session && !isLoginPage && !isSignupPage && (
            <Button variant="primary" size="sm" onClick={() => router.push('/login')} leftIcon={<LogIn size={16} />} className="text-sm px-5 py-2">
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
