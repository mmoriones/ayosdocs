'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { LogIn, UserPlus, Sun, Moon } from 'lucide-react';
import { useSyncExternalStore } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context';
import { Button } from '@/components/ui';

const emptySubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Clean, minimalistic header for public-facing pages.
 * Features theme toggling and authentication triggers.
 */
export default function PublicHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(emptySubscribe, getClientSnapshot, getServerSnapshot);

  const isLoginPage = pathname === '/login';
  const isSignupPage = pathname === '/signup';

  return (
    <header className="h-16 z-50">
      <div className="max-w-[1600px] mx-auto h-full px-6 lg:px-10 flex items-center justify-between">
        <div className="flex items-center gap-3 z-50">
          <Image 
            src="/favicon.svg" 
            alt="AyosDocs" 
            width={36} 
            height={36} 
            className="shrink-0"
          />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-ctp-sky-800">Ayos</span>Docs
          </span>
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2 text-ctp-subtext1 hover:text-ctp-sky-800 hover:bg-ctp-sky-800/5 rounded-lg transition-all active:scale-[0.97]"
            aria-label="Toggle theme"
          >
            {!mounted ? (
              <div className="w-5 h-5" />
            ) : theme === 'light' ? (
              <Moon size={18} />
            ) : (
              <Sun size={18} />
            )}
          </button>

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
