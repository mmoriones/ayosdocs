'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { 
  Bell, 
  ChevronRight, 
  CheckCircle2, 
  Layers, 
  Bookmark, 
  FileText, 
  ShieldCheck, 
  LogOut, 
  Edit3,
  User as UserIcon,
  Mail,
  Target
} from 'lucide-react';
import { useToast } from '@/context';
import { updateUserProfileAction } from '@/app/actions/user';
import { Button, Input, Card, Avatar, SignOutModal, Badge } from '@/components/ui';
import { getIconName, GuideIcon } from '@/lib/guideIcons';
import { getIconTheme } from '@/lib/assetStyles';

/**
 * Redesigned Profile client page following the new mobile-first aesthetics.
 */
export default function ProfileClient({ allGuides }) {
  const { data: session, status, update } = useSession();
  const { showToast } = useToast();
  const router = useRouter();
  const user = session?.user;

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const { data: userData, isLoading: isLoadingUserData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: !!user,
  });

  const stats = useMemo(() => {
    if (!userData || !allGuides) return { completed: 0, activeBundles: 0, saved: 0 };
    
    const completed = (userData.savedProgress || []).filter(p => {
      const guide = allGuides.find(g => g.slug === p.guideSlug);
      if (!guide) return false;
      const done = p.completedTasks?.split(',').filter(Boolean).length || 0;
      return done > 0 && done >= (guide.checklist?.length || 0);
    }).length;

    return {
      completed,
      activeBundles: userData.trackedBundles?.length || 0,
      saved: userData.savedProgress?.length || 0
    };
  }, [userData, allGuides]);

  const vaultItems = useMemo(() => {
    if (!userData?.savedProgress) return [];
    return [...userData.savedProgress]
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, 3)
      .map(p => {
        const guide = allGuides.find(g => g.slug === p.guideSlug);
        return {
          ...p,
          title: guide?.shortTitle || guide?.title || 'Unknown Guide',
          agency: guide?.agency || 'N/A',
          slug: p.guideSlug
        };
      });
  }, [userData, allGuides]);

  const overallProgress = useMemo(() => {
    if (!userData?.savedProgress || userData.savedProgress.length === 0) return 0;
    
    let totalTasks = 0;
    let completedTasks = 0;

    userData.savedProgress.forEach(p => {
      const guide = allGuides.find(g => g.slug === p.guideSlug);
      if (guide) {
        totalTasks += (guide.checklist?.length || 0);
        completedTasks += p.completedTasks?.split(',').filter(Boolean).length || 0;
      }
    });

    return totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  }, [userData, allGuides]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!newName.trim() || newName === user?.name) {
      setIsEditing(false);
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('fullName', newName.trim());
      const result = await updateUserProfileAction(formData);

      if (result.success) {
        await update();
        showToast({
          type: 'success',
          title: 'Profile Updated',
          message: 'Your name has been updated successfully.'
        });
        setIsEditing(false);
      } else {
        showToast({ type: 'error', title: 'Error', message: result.message });
      }
    } catch (err) {
      showToast({ type: 'error', title: 'Error', message: 'An unexpected error occurred.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-ios-gradient flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-gray-200 rounded-full" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-32 bg-ios-gradient animate-in fade-in duration-700">
      {/* Top Header */}
      <header className="px-6 pt-8 pb-4 flex justify-between items-center sticky top-0 z-20 backdrop-blur-md">
        <h1 className="text-[34px] font-bold tracking-tight text-[#1C1C1E]">Profile</h1>
      </header>

      <div className="max-w-md mx-auto space-y-8">
        {/* User Identity Card */}
        <section className="px-6">
          <Card 
            interactive
            onClick={() => !isEditing && setIsEditing(true)}
            className="p-6 !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/80 backdrop-blur-xl group"
            noPadding
          >
            <div className="flex items-center gap-5">
              <div className="relative">
                <Avatar 
                  src={user?.image} 
                  name={user?.name} 
                  size="xl" 
                  className="rounded-[22px] border-4 border-white shadow-md ring-1 ring-black/5" 
                />
              </div>
              <div className="flex-1 min-w-0">
                {isEditing ? (
                  <form onSubmit={handleSaveProfile} className="space-y-3" onClick={e => e.stopPropagation()}>
                    <Input
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Full Name"
                      className="h-10 text-sm"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button size="xs" isLoading={isSubmitting} type="submit">Save</Button>
                      <Button size="xs" variant="secondary" onClick={() => setIsEditing(false)}>Cancel</Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h2 className="text-[22px] font-black text-[#1C1C1E] tracking-tight truncate">
                      {user?.name}
                    </h2>
                    <p className="text-[14px] font-medium text-gray-400 truncate mb-2">
                      {user?.email}
                    </p>
                    {user?.isVerified && (
                      <Badge variant="success" className="bg-[#FFCC00]/10 text-[#FF9500] border-none px-2 py-0.5 rounded-full flex items-center gap-1 w-fit">
                        <CheckCircle2 size={12} fill="currentColor" className="text-white" />
                        <span className="text-[10px] font-bold uppercase tracking-wider">Verified</span>
                      </Badge>
                    )}
                  </>
                )}
              </div>
              {!isEditing && (
                <ChevronRight size={20} className="text-gray-300 group-active:translate-x-1 transition-transform" />
              )}
            </div>
          </Card>
        </section>

        {/* Quick Stats Grid */}
        <section className="px-6 grid grid-cols-3 gap-3">
          <StatCard 
            icon={<CheckCircle2 size={18} />} 
            value={stats.completed} 
            label="Guides Completed" 
            color="text-[#007AFF]" 
            bg="bg-[#007AFF]/5" 
          />
          <StatCard 
            icon={<Layers size={18} />} 
            value={stats.activeBundles} 
            label="Active Bundles" 
            color="text-[#34C759]" 
            bg="bg-[#34C759]/5" 
          />
          <StatCard 
            icon={<Bookmark size={18} />} 
            value={stats.saved} 
            label="Saved Documents" 
            color="text-[#AF52DE]" 
            bg="bg-[#AF52DE]/5" 
          />
        </section>

        {/* Document Vault Section */}
        <section className="px-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-[17px] font-bold text-[#1C1C1E]">My Document Vault</h3>
            <button onClick={() => router.push('/my-docs')} className="text-[13px] font-bold text-[#0038A8]">See All</button>
          </div>
          <div className="space-y-3">
            {vaultItems.length > 0 ? vaultItems.map((item) => (
              <VaultItem key={item.slug} item={item} />
            )) : (
              <div className="py-8 text-center bg-white/40 rounded-[28px] border border-dashed border-gray-200">
                <p className="text-sm text-gray-400 font-medium">No documents yet.</p>
              </div>
            )}
          </div>
        </section>

        {/* Life Goal Progress Section */}
        <section className="px-6">
          <Card 
            className="p-6 !border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.03)] bg-white/80 backdrop-blur-xl"
            noPadding
          >
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[17px] font-bold text-[#1C1C1E]">Life Goal Progress</h3>
                <p className="text-[13px] font-medium text-gray-400">Overall Progress</p>
              </div>
              
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="40" cy="40" r="34" stroke="#f2f2f7" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="40" cy="40" r="34" 
                    stroke="#FFCC00" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={213.6} 
                    strokeDashoffset={213.6 * (1 - overallProgress / 100)} 
                    strokeLinecap="round" 
                  />
                </svg>
                <span className="absolute text-[15px] font-black text-[#1C1C1E]">{overallProgress}%</span>
              </div>
            </div>
            
            <div className="mt-6 flex items-center gap-2 text-[13px] font-medium text-gray-500">
              <span className="text-lg">⭐</span>
              <p>Keep going! You&apos;re doing great.</p>
            </div>
          </Card>
        </section>

        {/* Security & Actions Section */}
        <section className="px-6 space-y-3">
          <ActionButton 
            icon={<ShieldCheck size={20} className="text-[#34C759]" />} 
            label="Security & Privacy" 
            onClick={() => router.push('/settings')} 
          />
          <ActionButton 
            icon={<LogOut size={20} className="text-[#FF3B30]" />} 
            label="Sign Out" 
            onClick={() => setShowLogoutConfirm(true)} 
            variant="danger"
          />
        </section>
      </div>

      <SignOutModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}

function StatCard({ icon, value, label, color, bg }) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-[24px] p-4 flex flex-col items-center text-center shadow-sm border border-white/60">
      <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center mb-3`}>
        {icon}
      </div>
      <span className="text-[18px] font-black text-[#1C1C1E] leading-none">{value}</span>
      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1 leading-tight">
        {label.split(' ').map((word, i) => <div key={i}>{word}</div>)}
      </span>
    </div>
  );
}

function VaultItem({ item }) {
  const router = useRouter();
  const iconName = getIconName(item.slug, item.agency);
  const theme = getIconTheme(item.slug, item.agency, iconName);
  
  return (
    <button 
      onClick={() => router.push(`/guides/${item.slug}`)}
      className="w-full bg-white/80 backdrop-blur-md rounded-[24px] p-4 flex items-center justify-between shadow-sm border border-white/60 active:scale-[0.98] transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center`} style={{ background: theme.gradient }}>
           <GuideIcon slug={item.slug} agency={item.agency} size={24} className="drop-shadow-sm" />
        </div>
        <div className="text-left">
          <h4 className="text-[15px] font-bold text-[#1C1C1E] leading-tight">{item.title}</h4>
          <p className="text-[12px] font-medium text-gray-400 mt-0.5 uppercase tracking-tight">
            Added on {new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>
      <ChevronRight size={18} className="text-gray-300 group-active:text-[#0038A8] transition-colors" />
    </button>
  );
}

function ActionButton({ icon, label, onClick, variant = "default" }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center justify-between p-4 rounded-[24px] backdrop-blur-md border shadow-sm active:scale-[0.98] transition-all group ${
        variant === 'danger' 
          ? 'bg-[#FF3B30]/5 border-[#FF3B30]/10 text-[#FF3B30]' 
          : 'bg-white/80 border-white/60 text-[#1C1C1E]'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-[15px] font-bold">{label}</span>
      </div>
      <ChevronRight size={18} className={`${variant === 'danger' ? 'text-[#FF3B30]/30' : 'text-gray-300'} group-active:translate-x-1 transition-transform`} />
    </button>
  );
}
