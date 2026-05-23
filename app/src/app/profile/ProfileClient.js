'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { User, Mail, ShieldCheck, Calendar, Camera, LogOut, Loader2, CheckCircle2, Edit3 } from 'lucide-react';
import { useToast } from '@/context';
import { updateUserProfileAction } from '@/app/actions/user';
import { Button, Input, Card, Skeleton, Avatar, Tooltip } from '@/components/ui';

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
      <div className="px-6 lg:px-10 py-8 border-b border-ctp-surface1 bg-ctp-mantle/50 mb-8">
        <div className="max-w-[1600px] mx-auto">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-ctp-text">Profile</h1>
            <p className="text-xs text-ctp-subtext1 font-medium">Manage your personal identity and account security credentials.</p>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Profile Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Personal Information Section */}
            <Card 
              title="Personal Identity" 
              background="mantle"
              className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm animate-in fade-in duration-300"
              overflow="visible"
              headerAction={
                !isEditing && status !== 'loading' && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setIsEditing(true)}
                    leftIcon={<Edit3 size={14} />}
                    className="text-ctp-sky-800"
                  >
                    Modify
                  </Button>
                )
              }
            >
              {status === 'loading' ? (
                 <div className="space-y-8">
                    <div className="flex flex-col md:flex-row gap-10">
                      <Skeleton className="w-20 h-20 rounded-xl shrink-0" />
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1.5">
                          <Skeleton className="w-16 h-2.5 ml-1 opacity-50" />
                          <Skeleton className="w-full h-10 rounded-lg" />
                        </div>
                        <div className="space-y-1.5 opacity-60">
                          <Skeleton className="w-16 h-2.5 ml-1 opacity-50" />
                          <Skeleton className="w-full h-10 rounded-lg" />
                        </div>
                      </div>
                    </div>
                 </div>
              ) : (
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row md:items-start gap-10">
                  <div className="relative w-20 h-20 shrink-0">
                    <Avatar
                      src={user?.image}
                      name={user?.name || 'A'}
                      size="xl"
                      className="rounded-xl border-2 border-ctp-base ring-1 ring-ctp-surface1 shadow-sm"
                    />
                    <div className="absolute bottom-0 right-0 translate-x-1 translate-y-1 z-10">
                      <Tooltip content="Upload coming soon" position="top">
                        <div className="p-1.5 bg-ctp-base border border-ctp-surface1 rounded shadow-sm text-ctp-sky-800 cursor-not-allowed hover:bg-ctp-mantle transition-colors">
                          <Camera size={12} strokeWidth={2.5} />
                        </div>
                      </Tooltip>
                    </div>
                  </div>

                  {/* Info Form/Display */}
                  <div className="flex-1 w-full">
                    {isEditing ? (
                      <form onSubmit={handleSaveProfile} className="space-y-6 max-w-lg">
                        <Input
                          label="Full Name"
                          value={newName}
                          onChange={(e) => {
                            setNewName(e.target.value);
                            if (error) setError('');
                          }}
                          placeholder="Enter your name"
                          maxLength={70}
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
                            Save Updates
                          </Button>
                          <Button 
                            variant="secondary" 
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
                          <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-[0.15em] ml-1">Legal Name</label>
                          <div className="flex items-center gap-3 px-3.5 py-2.5 bg-ctp-mantle/50 border border-ctp-surface1 rounded-lg text-sm font-bold text-ctp-text">
                            <User size={16} className="text-ctp-sky-800" strokeWidth={2.5} />
                            <span>{user?.name}</span>
                          </div>
                        </div>
                        <div className="space-y-1.5 opacity-80 min-w-0">
                          <label className="text-[10px] font-bold text-ctp-subtext1 uppercase tracking-[0.15em] ml-1">Email Address</label>
                          <Tooltip content={user?.email} className="w-full">
                            <div className="flex items-center gap-3 px-3.5 py-2.5 bg-ctp-crust/30 border border-ctp-surface1 rounded-lg text-sm font-bold text-ctp-subtext1 overflow-hidden">
                              <Mail size={16} className="text-ctp-surface2 shrink-0" strokeWidth={2.5} />
                              <span className="truncate">{user?.email}</span>
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              )}
            </Card>

            {/* Account Verification Section */}
            <Card title="Security Status" background="mantle" className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm">
              {status === 'loading' ? (
                 <div className="flex flex-col md:flex-row md:items-center gap-6 p-5 rounded-lg border border-ctp-surface1/30">
                  <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="w-24 h-3.5" />
                    <Skeleton className="w-3/4 h-2.5" />
                  </div>
                </div>
              ) : (
              <div className={`flex flex-col md:flex-row md:items-center gap-6 p-5 rounded-lg border ${
                user?.isVerified 
                  ? 'bg-ctp-green/[0.07] border-ctp-green/20' 
                  : 'bg-ctp-yellow/[0.04] border-ctp-yellow/20'
              }`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 shadow-sm border ${
                  user?.isVerified ? 'bg-ctp-base text-ctp-green border-ctp-green/20' : 'bg-ctp-base text-ctp-yellow border-ctp-yellow/20'
                }`}>
                  <ShieldCheck size={20} strokeWidth={2.5} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold tracking-tight uppercase">
                    {user?.isVerified ? 'Identity Verified' : 'Action Required'}
                  </h4>
                  <p className="text-xs text-ctp-subtext1 mt-1 leading-relaxed font-medium">
                    {user?.isVerified 
                      ? 'Your account is fully verified. Secure cloud sync and guide history are active.'
                      : 'Verify your email to enable cross-device synchronization and document backup.'}
                  </p>
                </div>
                {!user?.isVerified && (
                  <Button variant="secondary" size="sm" className="whitespace-nowrap shadow-sm bg-ctp-base">
                    Send Link
                  </Button>
                )}
              </div>
              )}
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-8">
            <Card title="Account Overview" background="mantle" className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm border-dashed">
              {status === 'loading' ? (
                 <div className="space-y-3">
                    <div className="flex justify-between items-center py-2 border-b border-ctp-surface1/50"><Skeleton className="w-16 h-2.5" /><Skeleton className="w-14 h-2.5" /></div>
                    <div className="flex justify-between items-center py-2"><Skeleton className="w-16 h-2.5" /><Skeleton className="w-14 h-2.5" /></div>
                    <Skeleton className="w-full h-10 rounded-lg mt-8" />
                 </div>
              ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-ctp-surface1/50">
                    <div className="flex items-center gap-2.5 text-ctp-subtext1">
                      <Calendar size={14} className="text-ctp-sky-800" strokeWidth={2.5} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Joined</span>
                    </div>
                    <span className="text-[11px] font-bold text-ctp-text uppercase">May 2026</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-2.5 text-ctp-subtext1">
                      <ShieldCheck size={14} className="text-ctp-sky-800" strokeWidth={2.5} />
                      <span className="text-[10px] font-bold uppercase tracking-widest">Type</span>
                    </div>
                    <span className="text-[11px] font-bold text-ctp-sky-800 uppercase">
                      {session?.user?.googleAuth && session?.user?.hasPassword ? 'Hybrid' : session?.user?.googleAuth ? 'Google' : 'Local'}
                    </span>
                  </div>
                </div>

                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="w-full mt-8 flex items-center justify-center gap-2 p-2.5 rounded-lg border border-ctp-red/20 bg-ctp-red/[0.04] text-ctp-red text-[10px] font-bold uppercase tracking-widest hover:bg-ctp-red/[0.08] hover:border-ctp-red/30 transition-all group"
                >
                  <LogOut size={14} strokeWidth={3} className="transition-transform group-hover:-translate-x-0.5" />
                  Sign Out of Account
                </button>
              </>
              )}
            </Card>

            <Card background="mantle" noPadding className="bg-ctp-mantle/50 border-ctp-surface1 shadow-sm overflow-hidden group">
              <div className="p-4 border-b border-ctp-surface1 flex items-center gap-2">
                <Edit3 size={14} className="text-ctp-sky-800" />
                <h3 className="text-[10px] font-bold text-ctp-subtext0 uppercase tracking-[0.15em]">Guide Discovery</h3>
              </div>
              <div className="p-5 space-y-4">
                <p className="text-[11px] font-medium leading-relaxed text-ctp-subtext1">
                  Ready to track more? Explore our updated knowledge base for the latest government requirements.
                </p>
                <Button 
                  variant="secondary"
                  onClick={() => router.push('/guides')}
                  className="w-full text-[10px] uppercase tracking-widest shadow-lg shadow-ctp-sky-800/5"
                >
                  Browse Guides
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
