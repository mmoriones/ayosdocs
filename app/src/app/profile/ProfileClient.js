'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, Mail, ShieldCheck, Calendar, Camera, LogOut, Loader2, CheckCircle2, Edit3 } from 'lucide-react';
import Image from 'next/image';
import { useToast } from '@/context/ToastContext';
import { updateUserProfileAction } from '@/app/actions/user';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import Skeleton from '@/components/ui/Skeleton';

/**
 * Enhanced Profile client page with editable identity management.
 */
export default function ProfileClient() {
  const { data: session, status, update } = useSession();
  const { showToast } = useToast();
  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Sync state when session data changes and we are not editing
  if (user?.name && !isEditing && newName !== user.name) {
    setNewName(user.name);
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!newName.trim() || newName === user?.name) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('fullName', newName.trim());

      const result = await updateUserProfileAction(formData);

      if (result.success) {
        // Refresh session to show new name globally
        await update();
        
        showToast({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your name has been updated successfully.'
        });
        setIsEditing(false);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getFieldError = () => {
    if (newName && newName.trim().length < 2) return 'Name must be at least 2 characters';
    if (error) return error;
    return '';
  };

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
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information Section */}
            <Card 
              title="Personal Information" 
              headerAction={
                !isEditing && status !== 'loading' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    leftIcon={<Edit3 size={14} />}
                  >
                    Edit info
                  </Button>
                )
              }
              className="animate-in fade-in slide-in-from-bottom-2 duration-300"
            >
              {status === 'loading' ? (
                 <div className="p-2 space-y-8">
                    <div className="flex flex-col md:flex-row gap-8">
                      <Skeleton className="w-24 h-24 rounded-2xl shrink-0" />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-2.5">
                          <Skeleton className="w-20 h-2.5 ml-1 opacity-50" />
                          <Skeleton className="w-full h-12 rounded-xl" />
                        </div>
                        <div className="space-y-2.5 opacity-60">
                          <Skeleton className="w-20 h-2.5 ml-1 opacity-50" />
                          <Skeleton className="w-full h-12 rounded-xl" />
                        </div>
                      </div>
                    </div>
                 </div>
              ) : (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-start gap-8">
                  {/* Avatar (Static for now) */}
                  <div className="relative shrink-0">
                    {user?.image ? (
                      <Image 
                        src={user.image} 
                        alt={user.name || 'User'} 
                        width={96} 
                        height={96} 
                        className="rounded-2xl border border-ctp-surface1 shadow-md object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-ctp-sky-800/10 border border-ctp-sky-800/20 flex items-center justify-center text-ctp-sky-800 text-3xl font-bold uppercase">
                        {user?.name?.charAt(0) || 'A'}
                      </div>
                    )}
                    <div className="absolute -bottom-2 -right-2 p-2 bg-ctp-base border border-ctp-surface1 rounded-lg shadow-sm text-ctp-subtext1 opacity-50 cursor-not-allowed" title="Avatar editing coming soon">
                      <Camera size={16} />
                    </div>
                  </div>

                  {/* Info Form/Display */}
                  <div className="flex-1 w-full">
                    {isEditing ? (
                      <form onSubmit={handleSaveProfile} className="space-y-6 max-w-md">
                        <Input
                          label="Full Name"
                          value={newName}
                          onChange={(e) => {
                            setNewName(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="Your full name"
                          error={getFieldError()}
                          leftIcon={User}
                          disabled={isSubmitting}
                          autoFocus
                          required
                        />
                        
                        <div className="flex items-center gap-3 pt-2">
                          <Button 
                            type="submit" 
                            isLoading={isSubmitting}
                            disabled={newName.trim() === user?.name || newName.trim().length < 2}
                            size="md"
                          >
                            Save Changes
                          </Button>
                          <Button 
                            variant="outline" 
                            size="md" 
                            onClick={() => {
                              setIsEditing(false);
                              setError('');
                            }}
                            disabled={isSubmitting}
                          >
                            Cancel
                          </Button>
                        </div>
                      </form>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest ml-1">Full Name</label>
                          <div className="flex items-center gap-3 px-4 py-3.5 bg-ctp-mantle border border-ctp-surface1 rounded-xl text-sm font-semibold text-ctp-text shadow-inner">
                            <User size={16} className="text-ctp-sky-800" />
                            <span>{user?.name}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5 opacity-80 min-w-0">
                          <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-widest ml-1">Email Address</label>
                          <div className="flex items-center gap-3 px-4 py-3.5 bg-ctp-mantle/50 border border-ctp-surface1 rounded-xl text-sm font-semibold text-ctp-subtext1 overflow-hidden">
                            <Mail size={16} className="text-ctp-surface2 shrink-0" />
                            <span className="truncate" title={user?.email}>{user?.email}</span>
                          </div>
                          <p className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-tight ml-1 mt-1 truncate">Contact your admin to change email</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )}
            </Card>

            {/* Account Verification Section */}
            <Card title="Account Verification">
              {status === 'loading' ? (
                 <div className="flex items-center gap-6 p-2">
                  <Skeleton className="w-12 h-12 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-1/3 h-4" />
                    <Skeleton className="w-full h-3" />
                  </div>
                </div>
              ) : (
              <div className={`flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-xl border ${
                user?.isVerified 
                  ? 'bg-ctp-green/5 border-ctp-green/20' 
                  : 'bg-ctp-yellow/5 border-ctp-yellow/20'
              }`}>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  user?.isVerified ? 'bg-ctp-green/10 text-ctp-green' : 'bg-ctp-yellow/10 text-ctp-yellow'
                }`}>
                  <ShieldCheck size={24} />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold tracking-tight">
                    {user?.isVerified ? 'Verified Account' : 'Action Required: Verify Email'}
                  </h4>
                  <p className="text-sm text-ctp-subtext1 mt-1 leading-relaxed">
                    {user?.isVerified 
                      ? 'Your identity has been confirmed. You have full access to all government guide tracking and cloud sync features.'
                      : 'Please verify your email address to enable secure cloud sync and prevent data loss during browser sessions.'}
                  </p>
                </div>
                {!user?.isVerified && (
                  <Button variant="secondary" size="sm" className="whitespace-nowrap">
                    Resend Verification
                  </Button>
                )}
              </div>
              )}
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
            <Card title="Profile Stats" background="mantle">
              {status === 'loading' ? (
                 <div className="space-y-6 py-2">
                    <div className="flex justify-between items-center"><Skeleton className="w-20 h-3" /><Skeleton className="w-12 h-3" /></div>
                    <div className="flex justify-between items-center"><Skeleton className="w-20 h-3" /><Skeleton className="w-16 h-3" /></div>
                    <Skeleton className="w-full h-10 rounded-xl mt-4" />
                 </div>
              ) : (
              <>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-2 border-b border-ctp-surface1/50">
                    <div className="flex items-center gap-2 text-ctp-subtext1">
                      <Calendar size={14} />
                      <span className="text-xs font-medium">Member Since</span>
                    </div>
                    <span className="text-xs font-bold">May 2026</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2 text-ctp-subtext1">
                      <ShieldCheck size={14} />
                      <span className="text-xs font-medium">Account Type</span>
                    </div>
                    <span className="text-xs font-bold text-ctp-sky-800">
                      {session?.user?.googleAuth && session?.user?.hasPassword ? 'Hybrid' : session?.user?.googleAuth ? 'Google OAuth' : 'Standard'}
                    </span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full mt-8 text-ctp-red hover:bg-red-500/5 hover:border-red-500/20"
                  leftIcon={<LogOut size={14} />}
                >
                  Sign Out
                </Button>
              </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
