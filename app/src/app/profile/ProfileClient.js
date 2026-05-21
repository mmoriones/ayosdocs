'use client';

import { useSession } from 'next-auth/react';
import { User, Mail, ShieldCheck, Calendar, Camera } from 'lucide-react';
import Image from 'next/image';

/**
 * Temporary Profile client page.
 */
export default function ProfileClient() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <div className="bg-ctp-base font-sans text-ctp-text min-h-screen pb-20">
      <div className="px-6 lg:px-10 py-8 border-b border-ctp-surface1 bg-ctp-mantle/50">
        <div className="max-w-[1600px] mx-auto">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-ctp-text">Profile</h1>
            <p className="text-sm text-ctp-subtext1">Manage your identity and account details.</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 mt-8 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-ctp-surface1 flex items-center justify-between">
                <h2 className="text-lg font-bold tracking-tight">Personal Information</h2>
                <button className="text-xs font-bold text-ctp-sky-800 hover:underline uppercase tracking-wider">Edit info</button>
              </div>
              <div className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center gap-8">
                  <div className="relative shrink-0">
                    {user?.image ? (
                      <Image 
                        src={user.image} 
                        alt={user.name} 
                        width={96} 
                        height={96} 
                        className="rounded-2xl border border-ctp-surface1 shadow-md"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-ctp-sky-800/10 border border-ctp-sky-800/20 flex items-center justify-center text-ctp-sky-800 text-3xl font-bold">
                        {user?.name?.charAt(0) || 'A'}
                      </div>
                    )}
                    <button className="absolute -bottom-2 -right-2 p-2 bg-ctp-base border border-ctp-surface1 rounded-lg shadow-sm text-ctp-subtext1 hover:text-ctp-sky-800 transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Full Name</label>
                        <div className="flex items-center gap-2 text-ctp-text font-semibold">
                          <User size={16} className="text-ctp-subtext0" />
                          <span>{user?.name || 'AyosDocs User'}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest">Email Address</label>
                        <div className="flex items-center gap-2 text-ctp-text font-semibold">
                          <Mail size={16} className="text-ctp-subtext0" />
                          <span>{user?.email || 'user@example.com'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bg-ctp-base border border-ctp-surface1 rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-ctp-surface1">
                <h2 className="text-lg font-bold tracking-tight">Account Verification</h2>
              </div>
              <div className="p-8">
                <div className={`flex items-center gap-6 p-6 rounded-xl border ${
                  user?.isVerified 
                    ? 'bg-ctp-green/5 border-ctp-green/20' 
                    : 'bg-ctp-yellow/5 border-ctp-yellow/20'
                }`}>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                    user?.isVerified ? 'bg-ctp-green/10 text-ctp-green' : 'bg-ctp-yellow/10 text-ctp-yellow'
                  }`}>
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold tracking-tight">
                      {user?.isVerified ? 'Verified Account' : 'Action Required: Verify Email'}
                    </h4>
                    <p className="text-sm text-ctp-subtext1 mt-1">
                      {user?.isVerified 
                        ? 'Your identity has been confirmed. You have full access to progress tracking and cloud sync.'
                        : 'Please verify your email address to enable secure cloud sync and prevent data loss.'}
                    </p>
                  </div>
                  {!user?.isVerified && (
                    <button className="ml-auto px-4 py-2 bg-ctp-yellow-800/10 text-ctp-yellow-800 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-ctp-yellow-800/20 transition-all">
                      Resend Email
                    </button>
                  )}
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
            <section className="bg-ctp-mantle border border-ctp-surface1 rounded-xl p-6 space-y-6 shadow-sm">
              <h3 className="text-sm font-bold tracking-tight uppercase tracking-widest text-ctp-subtext1">Profile Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b border-ctp-surface1/50">
                  <div className="flex items-center gap-2 text-ctp-subtext1">
                    <Calendar size={14} />
                    <span className="text-xs font-medium">Member Since</span>
                  </div>
                  <span className="text-xs font-bold">May 2024</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2 text-ctp-subtext1">
                    <ShieldCheck size={14} />
                    <span className="text-xs font-medium">Account Type</span>
                  </div>
                  <span className="text-xs font-bold text-ctp-sky-800">Standard</span>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
