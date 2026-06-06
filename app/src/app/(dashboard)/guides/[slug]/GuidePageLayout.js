'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Share2, 
  Sparkles,
  ChevronLeft,
  MoreHorizontal,
  Heart,
  Clock,
  Coins,
  BarChart3,
  FileText,
  Building2,
  CreditCard,
  IdCard,
  Receipt,
  Mail,
  User,
  Lock,
  ChevronRight,
  ArrowRight,
  Globe,
  GraduationCap,
  HeartPulse,
  House,
  Landmark,
  MapPin,
  Plane,
  Scale,
  AlertCircle,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
  Loader2,
  UserPlus,
  X,
  Scan,
  Check
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast, useWorkspace } from '@/context';
import { GuideIcon } from '@/lib/guideIcons';
import { Banner, Button, Badge, TimelineStep } from '@/components/ui';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toggleFavoriteAction, updateProgressAction } from '@/app/actions/user';
import { useAuthUI } from '@/components/Providers';
import { getIconTheme, THEMES } from '@/lib/assetStyles';

// --- Sub-components ---

const IconMap = {
  IdCard, Receipt, Mail, User, FileText, Building2, CreditCard, 
  Globe, GraduationCap, HeartPulse, House, Landmark, MapPin, 
  Passport: FileText, Plane, Police: ShieldCheck, Scale, ShieldCheck, Truck, Users, Wallet,
  Sparkles
};

function TabPanel({ active, children, className = '' }) {
  if (!active) return null;
  return (
    <div className={`animate-in fade-in duration-500 ${className}`}>
      {children}
    </div>
  );
}

const RequirementsSection = ({ requirements, theme }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end px-1">
        <h2 className="text-[20px] lg:text-[24px] font-bold text-[#1C1C1E] tracking-tight">What you need</h2>
        <span className="text-[12px] font-bold text-gray-300 uppercase tracking-widest">{requirements.length} Items</span>
      </div>
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        {requirements.map((req, i) => {
          const IconComponent = IconMap[req.icon] || Sparkles;
          return (
            <div key={i} className={`flex items-center gap-5 p-5 transition-colors hover:bg-black/[0.01] ${i !== requirements.length - 1 ? 'border-b border-gray-100/40' : ''}`}>
              <div 
                className="w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 border border-white/50 shadow-sm relative overflow-hidden"
                style={{ background: theme.gradient }}
              >
                 <IconComponent className="text-[#0038A8] relative z-10 drop-shadow-sm" size={26} />
                 <div className="absolute inset-0 bg-white/20 opacity-30" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[16px] font-bold text-[#1C1C1E] leading-tight">{req.title}</h4>
                <p className="text-[13px] font-medium text-gray-400 mt-1 leading-snug">{req.description}</p>
              </div>
              <ChevronRight className="text-gray-200 shrink-0" size={18} strokeWidth={3} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FeesSection = ({ fees, theme }) => {
  if (!fees || fees.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-[20px] lg:text-[24px] font-bold text-[#1C1C1E] tracking-tight px-1">Fee Breakdown</h2>
      <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[32px] overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        {fees.map((fee, i) => (
          <div key={i} className={`flex items-center justify-between p-5 ${i !== fees.length - 1 ? 'border-b border-gray-100/40' : ''}`}>
            <span className={`text-[15px] ${fee.label.toLowerCase() === 'total' ? 'font-bold text-[#1C1C1E]' : 'font-medium text-gray-500'}`}>
              {fee.label}
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-[16px] font-bold ${fee.label.toLowerCase() === 'total' ? 'text-[#0038A8]' : 'text-[#1C1C1E]'}`}>
                {fee.amount.replace(/\*\*/g, '')}
              </span>
              {fee.label.toLowerCase() === 'total' && (
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: theme.ring }} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrackerStep = ({ step, index, isLast, isNext, onToggle, isSaving, theme, isLoggedIn }) => {
  const isCompleted = step.completed;
  const isLocked = !isCompleted && !isNext;

  return (
    <TimelineStep
      indicator={index + 1}
      isCompleted={isCompleted}
      isCurrent={isNext}
      isLocked={isLocked}
      isLast={isLast}
      themeColor={theme.ring}
      className="pb-12"
    >
      <div 
        className={`flex justify-between items-start mb-3 ${isNext && !isSaving ? 'cursor-pointer' : ''}`}
        onClick={() => isNext && !isSaving && onToggle(index)}
      >
        <h4 className={`text-[17px] font-bold leading-tight tracking-tight ${isCompleted ? 'text-gray-300 line-through' : 'text-[#1C1C1E]'}`}>
          {step.title}
        </h4>
        {isCompleted ? (
          <Badge variant="green" className="bg-[#34C759]/10 text-[#34C759] border-[#34C759]/20 px-3">Completed</Badge>
        ) : (isNext && isLoggedIn) ? (
          <Badge variant="sky" className="bg-[#0038A8]/5 text-[#0038A8] border-[#0038A8]/10 px-3">In Progress</Badge>
        ) : !isNext ? (
          <Badge variant="gray" icon={Lock} className="text-gray-300 border-gray-100 px-3">Locked</Badge>
        ) : null}
      </div>
      
      <p className="text-[14px] font-medium text-gray-500 leading-relaxed mb-8">
        {step.description}
      </p>

      {isNext && (
        <div className="space-y-4">
          <Button 
            onClick={() => onToggle(index)}
            isLoading={isSaving}
            style={{ background: 'linear-gradient(to top, #0038A8 0%, #0059E0 100%)' }}
            className="w-full h-14 rounded-2xl text-white text-[15px] font-bold shadow-lg shadow-[#0038A8]/20 active:scale-[0.98] transition-all border-none"
          >
            {isLoggedIn ? 'Mark Step as Complete' : 'Save my progress'}
          </Button>
          <button className="w-full flex items-center justify-between px-3 text-[13px] font-bold text-gray-400 hover:text-[#0038A8] active:scale-95 transition-all uppercase tracking-wider">
              <span>Detailed Instructions</span>
              <ChevronRight size={14} strokeWidth={3} />
          </button>
        </div>
      )}
      
      {(isCompleted || isLocked) && (
          <button className="flex items-center gap-2 text-[13px] font-bold text-[#0038A8]/60 hover:text-[#0038A8] active:scale-95 transition-all uppercase tracking-wider">
            View Instructions <ChevronRight size={14} strokeWidth={3} />
          </button>
      )}
    </TimelineStep>
  );
};

const RelatedGuides = ({ currentSlug, category, allGuides, relatedGuideSlugs = [] }) => {
  const related = useMemo(() => {
    const explicitRelated = (relatedGuideSlugs || [])
      .map(slug => allGuides.find(g => g.slug === slug))
      .filter(Boolean);

    const categoryRelated = allGuides
      .filter(g => (g.category === category || !category) && g.slug !== currentSlug && !(relatedGuideSlugs || []).includes(g.slug))
      .slice(0, 4 - explicitRelated.length);

    return [...explicitRelated, ...categoryRelated].slice(0, 4);
  }, [currentSlug, category, allGuides, relatedGuideSlugs]);

  if (related.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-[20px] lg:text-[24px] font-bold text-[#1C1C1E] tracking-tight px-1">Related Guides</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
        {related.map(g => {
          const theme = getIconTheme(g.slug, g.agency);
          return (
            <Link
              key={g.slug}
              href={`/guides/${g.slug}`}
              className="hover-lift active:scale-[0.98] flex items-center gap-5 p-5 rounded-[28px] bg-white shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white/60 hover:border-[#0038A8]/20 group transition-all"
            >
              <div 
                className="w-14 h-14 rounded-[20px] flex items-center justify-center shrink-0 shadow-sm border border-white/50 relative overflow-hidden"
                style={{ background: theme.gradient }}
              >
                <GuideIcon slug={g.slug} agency={g.agency} size={30} className="relative z-10 drop-shadow-sm" />
                <div className="absolute inset-0 bg-white/20 opacity-30" />
              </div>
              <div className="min-w-0">
                <span className="text-[#1C1C1E] text-[16px] font-bold group-hover:text-[#0038A8] transition-colors line-clamp-1 tracking-tight">
                  {g.shortTitle || g.title}
                </span>
                <p className="text-[12px] font-bold text-gray-400 uppercase tracking-tight truncate mt-0.5">
                  {g.agency}
                </p>
              </div>
              <ChevronRight className="ml-auto text-gray-200 group-hover:text-[#0038A8]/40 transition-colors" size={18} strokeWidth={3} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

/**
 * Consolidated Layout component for the Guide Page.
 */
const GuidePageLayout = ({
  title,
  description,
  lastUpdated,
  children,
  checklistSteps = [],
  requirements = [],
  fees = [],
  headings = [],
  slug,
  agency,
  category,
  difficulty = "Moderate",
  costRange = "Free",
  readTime = "1-3D",
  allGuides = [],
  relatedGuideSlugs = []
}) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('guide');
  const [activeId, setActiveId] = useState("");
  const { showToast } = useToast();
  const { setActiveGuideSlug } = useWorkspace();
  const { data: session, status } = useSession();
  const { openAuthModal } = useAuthUI();
  const isLoggedIn = status === 'authenticated';
  const isVerified = session?.user?.isVerified;
  const queryClient = useQueryClient();
  const observer = useRef(null);
  const lastInteractionRef = useRef(0);
  const guideScrollPosRef = useRef(0);
  const isInternalScrollRef = useRef(false);
  const [savingIndex, setSavingIndex] = useState(null);

  const theme = getIconTheme(slug, agency);

  // Tab transition management
  useEffect(() => {
    if (activeTab !== 'guide') {
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      isInternalScrollRef.current = true;
      window.scrollTo({ top: guideScrollPosRef.current, behavior: 'instant' });
      const timer = setTimeout(() => { isInternalScrollRef.current = false; }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // TOC Auto-scroll
  useEffect(() => {
    if (activeTab === 'content' && activeId) {
      const timer = setTimeout(() => {
        const activeItem = document.getElementById(`toc-item-${activeId}`);
        if (activeItem) activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [activeTab, activeId]);

  // Data Fetching
  const { data: userData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: isLoggedIn && isVerified,
  });

  const { data: progressData } = useQuery({
    queryKey: ['progress', slug],
    queryFn: async () => {
      const response = await axios.get(`/api/user/get-progress/${slug}`);
      return response.data;
    },
    enabled: isLoggedIn && isVerified && !!slug,
  });

  const fullProgress = userData?.savedProgress?.find(p => p.guideSlug === slug);
  const isFavorite = fullProgress?.isFavorite || false;

  const favoriteMutation = useMutation({
    mutationFn: async () => {
      if (!isLoggedIn) {
        openAuthModal();
        return;
      }
      if (!isVerified) {
        showToast({ type: 'warning', title: 'Verification Required', message: 'Please verify your email to favorite guides.' });
        return;
      }
      const result = await toggleFavoriteAction(slug);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
      showToast({ type: 'success', title: data.isFavorite ? 'Added to Favorites' : 'Removed from Favorites', message: data.message });
    }
  });

  const [localSteps, setLocalSteps] = useState(checklistSteps);

  const saveMutation = useMutation({
    mutationFn: async ({ indices }) => await updateProgressAction(slug, indices),
    onSuccess: (data, { nextSteps }) => {
      setLocalSteps(nextSteps);
      setSavingIndex(null);
      queryClient.invalidateQueries({ queryKey: ['progress', slug] });
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
    },
    onError: () => {
      setSavingIndex(null);
      showToast({ type: 'error', title: 'Sync Failed', message: 'Could not save progress. Please try again.' });
    }
  });

  // Sync server data
  useEffect(() => {
    if (!progressData?.completedTasks || saveMutation.isPending || savingIndex !== null) return;
    const isUserInactive = Date.now() - lastInteractionRef.current > 3000;
    if (!isUserInactive) return;

    const completedIndices = progressData.completedTasks.split(',').filter(Boolean).map(Number);
    const nextSteps = checklistSteps.map((step, i) => ({ ...step, completed: completedIndices.includes(i) }));
    
    const currentLocalIndices = localSteps.map((s, i) => s.completed ? i : null).filter(i => i !== null).join(',');
    if (progressData.completedTasks !== currentLocalIndices) {
      const timer = setTimeout(() => { setLocalSteps(nextSteps); }, 0);
      return () => clearTimeout(timer);
    }
  }, [progressData, checklistSteps, saveMutation.isPending, localSteps, savingIndex]);

  const handleStepToggle = (index) => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    lastInteractionRef.current = Date.now();
    const nextSteps = localSteps.map((s, i) => i === index ? { ...s, completed: !s.completed } : s);
    const indices = nextSteps.map((s, i) => s.completed ? i : null).filter(i => i !== null).join(',');
    
    if (isVerified) {
      setSavingIndex(index);
      saveMutation.mutate({ indices, index, nextSteps });
    } else {
      setLocalSteps(nextSteps);
    }
  };

  const completedCount = localSteps.filter(s => s.completed).length;
  const progressPercent = localSteps.length ? Math.round((completedCount / localSteps.length) * 100) : 0;
  const nextStepIndex = savingIndex !== null ? savingIndex : localSteps.findIndex(s => !s.completed);

  // Intersection Observer
  useEffect(() => {
    if (slug) setActiveGuideSlug(slug);
    if (activeTab !== 'guide') return;

    const handleObserver = (entries) => {
      if (isInternalScrollRef.current) return;
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveId(entry.target.id);
      });
    };

    observer.current = new IntersectionObserver(handleObserver, { rootMargin: "-20% 0px -70% 0px" });
    const timer = setTimeout(() => {
      headings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.current.observe(el);
      });
    }, 500);

    return () => { clearTimeout(timer); observer.current?.disconnect(); };
  }, [headings, slug, setActiveGuideSlug, activeTab]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: `${title} | AyosDocs`, text: `Check out this government guide: ${title}`, url: window.location.href }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast({ type: 'success', title: 'Link Copied', message: 'URL copied to clipboard.' });
    }
  };

  return (
    <div className="min-h-screen bg-ios-gradient pb-32 selection:bg-[#0038A8]/10">
      {/* High-Fidelity Fixed Navigation */}
      <nav className="sticky top-[var(--header-offset,4rem)] lg:top-16 z-40 bg-white/80 backdrop-blur-2xl border-b border-white/50 px-6 py-3 flex items-center gap-4 transition-[top] duration-500 ease-in-out shadow-sm shadow-black/[0.01]">
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-all shrink-0 border border-white/60 hover:bg-gray-50"
        >
          <ChevronLeft size={24} className="text-[#1C1C1E]" strokeWidth={2.5} />
        </button>
        
        <div className="flex-1 flex bg-black/[0.04] rounded-full p-1 gap-1 max-w-[320px] mx-auto border border-black/[0.02]">
          {['guide', 'content', 'tracker'].map((tab) => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)} 
              className={`flex-1 rounded-full py-2 text-[12px] font-bold transition-all duration-300 capitalize ${
                activeTab === tab 
                  ? 'bg-white text-[#0038A8] shadow-[0_2px_8px_rgba(0,0,0,0.06)]' 
                  : 'text-gray-500 hover:text-[#1C1C1E]'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Empty spacer to maintain tab centering */}
        <div className="w-10 h-10 hidden sm:block" /> 
      </nav>

      <div className="max-w-[800px] mx-auto pt-10 px-6 space-y-12">
        
        <TabPanel active={activeTab === 'guide'} className="space-y-10">
           {/* Compact Hero Header */}
           <header className="space-y-8">
              <div className="space-y-4">
                 <div className="flex items-center justify-between gap-4">
                    <p className="text-[14px] font-bold text-[#0038A8] uppercase tracking-[0.1em]">{category || 'Civil Clearance'}</p>
                    <div className="flex items-center gap-2">
                       {isLoggedIn && (
                         <button 
                           onClick={() => favoriteMutation.mutate()} 
                           className={`w-12 h-12 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-all border border-white/60 ${
                             isFavorite ? 'bg-[#FFD700]/10 border-[#FFD700]/20' : 'bg-white'
                           }`}
                         >
                           <Heart size={24} className={isFavorite ? 'text-[#FFD700]' : 'text-[#1C1C1E]'} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
                         </button>
                       )}
                       <button 
                        onClick={handleShare}
                        className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-all border border-white/60 hover:bg-gray-50"
                       >
                         <Share2 size={22} className="text-[#1C1C1E]" strokeWidth={2.5} />
                       </button>
                    </div>
                 </div>
                 <h1 className="text-[34px] lg:text-[42px] font-bold text-[#1C1C1E] leading-[1.1] tracking-tight">{title}</h1>
                 <p className="text-[16px] lg:text-[17px] font-medium text-gray-500 leading-relaxed max-w-[600px]">
                    {description || `Step-by-step guide for ${title} from ${agency}.`}
                 </p>
              </div>

              {/* Integrated Info Bar: Stats Only */}
              <div 
                className="rounded-[32px] py-4 px-6 lg:px-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] border border-white/60 flex items-center justify-center relative overflow-hidden group"
                style={{ background: theme.gradient }}
              >
                 {/* Compact Stats Row - Centered Vertical Stack */}
                 <div className="relative z-10 flex items-center gap-10 lg:gap-20 overflow-x-auto scrollbar-hide">
                    {[
                      { label: 'Time', value: readTime, icon: Clock, color: 'text-blue-600' },
                      { label: 'Cost', value: costRange, icon: Coins, color: 'text-amber-600' },
                      { label: 'Difficulty', value: difficulty, icon: BarChart3, color: 'text-purple-600' }
                    ].map((stat, i) => (
                      <div key={i} className="flex flex-col items-center gap-2 shrink-0">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/40 backdrop-blur-sm ${stat.color} border border-white/40 shadow-sm transition-transform group-hover:scale-110 duration-500`}>
                            <stat.icon size={14} strokeWidth={3} />
                         </div>
                         <div className="text-center">
                            <p className="text-[14px] font-bold text-[#1C1C1E] leading-none whitespace-nowrap">{stat.value}</p>
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.1em] opacity-80 mt-1">{stat.label}</p>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="absolute inset-0 bg-white/5 opacity-20 pointer-events-none" />
              </div>
           </header>

           <RequirementsSection requirements={requirements} theme={theme} />

           <FeesSection fees={fees} theme={theme} />

           {/* About Section */}
           <section className="space-y-6">
              <h2 className="text-[20px] lg:text-[24px] font-bold text-[#1C1C1E] tracking-tight px-1">About this guide</h2>
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-[32px] p-8 md:p-10 shadow-sm prose prose-ctp max-w-none">
                 {children}
              </div>
           </section>

           <RelatedGuides 
             currentSlug={slug} 
             category={category} 
             allGuides={allGuides} 
             relatedGuideSlugs={relatedGuideSlugs}
           />
        </TabPanel>

        <TabPanel active={activeTab === 'tracker'} className="space-y-12">
           <header className="space-y-8">
              <div className="flex justify-between items-start">
                 <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-[28px] lg:text-[34px] font-bold text-[#1C1C1E] tracking-tight">{title} Tracker</h2>
                      {isLoggedIn && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {!isVerified ? (
                            <Badge variant="yellow" icon={AlertCircle} className="px-3 py-1 text-[11px] bg-amber-50 text-amber-600 border-amber-100">Verification Pending</Badge>
                          ) : saveMutation.isPending ? (
                            <Badge variant="sky" icon={Loader2} className="px-3 py-1 text-[11px] text-[#0038A8] bg-blue-50 border-blue-100">Syncing...</Badge>
                          ) : (
                            <Badge variant="green" icon={Check} className="px-3 py-1 text-[11px] bg-emerald-50 text-emerald-600 border-emerald-100 uppercase tracking-widest">Progress Saved</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-[15px] lg:text-[16px] font-medium text-gray-400">
                      You have completed {completedCount} of {localSteps.length} steps ({progressPercent}% Complete)
                    </p>
                 </div>
                 <div 
                    className="w-16 h-16 rounded-[22px] flex items-center justify-center shrink-0 border border-white/50 shadow-sm relative overflow-hidden"
                    style={{ background: theme.gradient }}
                  >
                    <GuideIcon slug={slug} agency={agency} size={36} className="relative z-10 drop-shadow-md" />
                    <div className="absolute inset-0 bg-white/20 opacity-30" />
                  </div>
              </div>

              {isLoggedIn && !isVerified && (
                <div className="bg-[#FF9500]/5 border border-[#FF9500]/10 rounded-[24px] p-5 flex items-center gap-5 animate-in slide-in-from-top-2">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-[#FF9500] shadow-sm shrink-0">
                    <AlertCircle size={22} strokeWidth={2.5} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-[#1C1C1E] leading-tight">Sync is limited</p>
                    <p className="text-[13px] font-medium text-gray-500 mt-1">Please verify your email to ensure your progress is saved forever.</p>
                  </div>
                </div>
              )}

              <div className="h-4 bg-gray-100/50 rounded-full border border-white/60 overflow-hidden shadow-inner p-1 relative">
                 <div 
                    className="h-full rounded-full shadow-[0_0_12px_rgba(0,56,168,0.3)] transition-all duration-1000 ease-out" 
                    style={{ width: `${progressPercent}%`, backgroundColor: theme.ring }} 
                 />
              </div>
           </header>

           <div className="pt-4 pb-20">
              {localSteps.map((step, i) => (
                <TrackerStep 
                  key={i} 
                  step={step} 
                  index={i} 
                  isLast={i === localSteps.length - 1} 
                  onToggle={handleStepToggle}
                  isNext={i === nextStepIndex}
                  isSaving={saveMutation.isPending && i === savingIndex}
                  theme={theme}
                  isLoggedIn={isLoggedIn}
                />
              ))}

              {!isLoggedIn && (
                <div className="mt-10 bg-white/60 backdrop-blur-xl border border-white/60 rounded-[40px] p-10 text-center space-y-8 shadow-[0_8px_32px_rgba(0,0,0,0.03)] relative overflow-hidden">
                  <div className="relative z-10 flex flex-col items-center gap-6">
                    <div 
                      className="w-20 h-20 rounded-[28px] flex items-center justify-center mx-auto text-[#0038A8] shadow-sm border border-white/50"
                      style={{ background: theme.gradient }}
                    >
                      <UserPlus size={36} className="relative z-10 drop-shadow-sm" strokeWidth={2.5} />
                      <div className="absolute inset-0 bg-white/20 opacity-30" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-[22px] font-bold text-[#1C1C1E] tracking-tight">Unlock Tracker Mode</h3>
                      <p className="text-[16px] font-medium text-gray-400 max-w-[320px] mx-auto leading-relaxed">
                        Create an account to save your checklist progress across all your devices and never lose track.
                      </p>
                    </div>
                    <Button 
                      onClick={openAuthModal}
                      style={{ background: 'linear-gradient(to top, #0038A8 0%, #0059E0 100%)' }}
                      className="w-full h-14 rounded-2xl text-white text-[16px] font-bold shadow-lg shadow-[#0038A8]/20 transition-all active:scale-[0.98] border-none"
                    >
                      Sign up for Free
                    </Button>
                    <p className="text-[12px] font-bold text-gray-300 uppercase tracking-widest flex items-center justify-center gap-2">
                      <ShieldCheck size={14} className="text-[#34C759]" strokeWidth={3} />
                      Sync across all devices
                    </p>
                  </div>
                  {/* Subtle Background Accent */}
                  <div className="absolute -right-12 -bottom-12 w-48 h-48 opacity-[0.03] pointer-events-none rotate-12">
                    <Scan size={192} />
                  </div>
                </div>
              )}
           </div>
        </TabPanel>

        <TabPanel active={activeTab === 'content'}>
           <div className="bg-white/60 backdrop-blur-xl border border-white/60 rounded-[40px] p-8 lg:p-12 shadow-[0_8px_32px_rgba(0,0,0,0.03)]">
              <div className="flex flex-col gap-2 mb-10 text-center">
                <h2 className="text-[28px] font-bold text-[#1C1C1E] tracking-tight">Table of Contents</h2>
                <p className="text-[15px] font-medium text-gray-400">Quickly navigate to any section.</p>
              </div>
              <div className="space-y-4">
                {headings.map((h, i) => {
                  const isActive = activeId === h.id;
                  return (
                    <button
                      key={i}
                      id={`toc-item-${h.id}`}
                      onClick={() => {
                        setActiveTab('guide');
                        setTimeout(() => {
                          const el = document.getElementById(h.id);
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                      className={`w-full flex items-center justify-between p-5 rounded-[24px] transition-all duration-300 group
                        ${isActive 
                          ? 'bg-[#0038A8] text-white shadow-[0_12px_24px_rgba(0,56,168,0.15)] scale-[1.02] border-none' 
                          : 'bg-white/40 hover:bg-white text-[#1C1C1E] border border-white/60 hover:border-[#0038A8]/20 shadow-sm'
                        }
                      `}
                    >
                      <div className="flex items-center gap-5">
                         <span className={`text-[12px] font-black w-8 h-8 rounded-full flex items-center justify-center transition-colors shrink-0
                           ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}
                         `}>
                           {i + 1}
                         </span>
                         <span className="text-[17px] font-bold tracking-tight text-left leading-tight">
                           {h.text}
                         </span>
                      </div>
                      <div className={`transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-40'}`}>
                        <ArrowRight size={20} strokeWidth={3} />
                      </div>
                    </button>
                  );
                })}
              </div>
           </div>
        </TabPanel>

      </div>
    </div>
  );
};

export default GuidePageLayout;
