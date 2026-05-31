'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Share2, 
  Sparkles,
  List,
  CheckSquare,
  AlertCircle,
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
  Check,
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
  ShieldCheck,
  Truck,
  Users,
  Wallet,
  Loader2,
  Scan,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast, useWorkspace } from '@/context';
import { GuideIcon } from '@/lib/guideIcons';
import { Banner, Tooltip, Button, Badge, TimelineStep } from '@/components/ui';
import Adsense from '@/components/Adsense';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { toggleFavoriteAction, updateProgressAction } from '@/app/actions/user';
import { useAuthUI } from '@/components/Providers';

// --- Inlined from components/ui/Tabs.js ---
function TabPanel({ active, children, className = '' }) {
  if (!active) return null;
  return (
    <div className={`animate-in fade-in duration-200 ${className}`}>
      {children}
    </div>
  );
}
// --- End of TabPanel ---

// --- Sub-components ---

const IconMap = {
  IdCard, Receipt, Mail, User, FileText, Building2, CreditCard, 
  Globe, GraduationCap, HeartPulse, House, Landmark, MapPin, 
  Passport: FileText, Plane, Police: ShieldCheck, Scale, ShieldCheck, Truck, Users, Wallet,
  Sparkles
};

const RequirementsSection = ({ requirements }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-[22px] font-black text-[#1C1C1E] tracking-tight px-1">What you need</h2>
      <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-[32px] overflow-hidden shadow-sm">
        {requirements.map((req, i) => {
          const IconComponent = IconMap[req.icon] || Sparkles;
          return (
            <div key={i} className={`flex items-center gap-4 p-5 ${i !== requirements.length - 1 ? 'border-b border-gray-100/50' : ''}`}>
              <div className="w-12 h-12 bg-ios-gradient rounded-2xl flex items-center justify-center border border-white/20 shadow-sm shrink-0">
                 <IconComponent className="text-[#0038A8]" size={24} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[16px] font-black text-[#1C1C1E] leading-tight">{req.title}</h4>
                <p className="text-[13px] font-medium text-gray-400 mt-1 leading-snug">{req.description}</p>
              </div>
              <ChevronRight className="text-gray-300 shrink-0" size={20} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

const FeesSection = ({ fees }) => {
  if (!fees || fees.length === 0) return null;

  return (
    <div className="space-y-6">
      <h2 className="text-[22px] font-black text-[#1C1C1E] tracking-tight px-1">Fee Breakdown</h2>
      <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-[32px] overflow-hidden shadow-sm">
        {fees.map((fee, i) => (
          <div key={i} className={`flex items-center justify-between p-5 ${i !== fees.length - 1 ? 'border-b border-gray-100/50' : ''}`}>
            <span className={`text-[15px] ${fee.label.toLowerCase() === 'total' ? 'font-black text-[#1C1C1E]' : 'font-medium text-gray-500'}`}>
              {fee.label}
            </span>
            <span className={`text-[16px] font-black ${fee.label.toLowerCase() === 'total' ? 'text-[#0038A8]' : 'text-[#1C1C1E]'}`}>
              {fee.amount.replace(/\*\*/g, '')}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const TrackerStep = ({ step, index, isLast, isNext, onToggle, isSaving }) => {
  const isCompleted = step.completed;
  const isLocked = !isCompleted && !isNext;

  return (
    <TimelineStep
      indicator={index + 1}
      isCompleted={isCompleted}
      isCurrent={isNext}
      isLocked={isLocked}
      isLast={isLast}
      className="pb-10"
    >
      <div 
        className={`flex justify-between items-start mb-2 ${isNext && !isSaving ? 'cursor-pointer' : ''}`}
        onClick={() => isNext && !isSaving && onToggle(index)}
      >
        <h4 className={`text-[17px] font-black leading-tight ${isCompleted ? 'text-gray-400 line-through' : 'text-[#1C1C1E]'}`}>
          {step.title}
        </h4>
        {isCompleted ? (
          <Badge variant="green" className="bg-emerald-50 text-emerald-600 border-emerald-100">Completed</Badge>
        ) : isNext ? (
          <Badge variant="sky" className="bg-blue-50 text-blue-600 border-blue-100">In Progress</Badge>
        ) : (
          <Badge variant="gray" icon={Lock} className="text-gray-400">Locked</Badge>
        )}
      </div>
      
      <p className="text-[14px] font-medium text-gray-500 leading-relaxed mb-6">
        {step.description}
      </p>

      {isNext && (
        <div className="space-y-3">
          <Button 
            onClick={() => onToggle(index)}
            isLoading={isSaving}
            className="w-full h-12 rounded-2xl bg-[#0038A8] hover:bg-[#002B82] text-white text-[15px] font-black shadow-lg shadow-[#0038A8]/20 active:scale-95 transition-all"
          >
            Mark as Complete
          </Button>
          <button className="w-full flex items-center justify-between px-2 text-[14px] font-bold text-gray-400 hover:text-[#0038A8] transition-colors">
              <span>View Details</span>
              <ChevronRight size={16} />
          </button>
        </div>
      )}
      
      {(isCompleted || isLocked) && (
          <button className="flex items-center gap-2 text-[14px] font-bold text-[#0038A8]/60 hover:text-[#0038A8] transition-colors">
            View Details <ChevronRight size={14} />
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {related.map(g => (
        <Link
          key={g.slug}
          href={`/guides/${g.slug}`}
          className="hover-lift active:scale-[0.98] flex items-center gap-4 p-5 rounded-[28px] bg-white/60 backdrop-blur-md border border-white/40 hover:border-[#0038A8]/20 group shadow-sm transition-all"
        >
          <div className="w-12 h-12 shrink-0 bg-white rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform border border-white/50 shadow-sm">
            <GuideIcon 
              slug={g.slug} 
              agency={g.agency} 
              size={28}
            />
          </div>
          <div className="min-w-0">
            <span className="text-[#1C1C1E] text-[15px] font-black group-hover:text-[#0038A8] transition-colors line-clamp-1 tracking-tight">
              {g.shortTitle || g.title}
            </span>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider truncate mt-0.5">
              {g.agency}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
};

/**
 * Consolidated Layout component for the Guide Page.
 * Implements the new high-fidelity mobile-first design with a top-level switcher.
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

  // --- Scroll & Tab Management ---

  // 1. Continuous scroll tracking for Guide tab to prevent loss on unmount
  useEffect(() => {
    if (activeTab !== 'guide') return;

    const handleScroll = () => {
      if (isInternalScrollRef.current) return;
      guideScrollPosRef.current = window.scrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeTab]);

  // 2. Tab transition management
  useEffect(() => {
    if (activeTab !== 'guide') {
      // Reset scroll to top for Content and Tracker tabs
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else {
      // Restore position when returning to Guide
      isInternalScrollRef.current = true;
      window.scrollTo({ top: guideScrollPosRef.current, behavior: 'instant' });
      
      // Brief delay before allowing tracking again to avoid capturing the restoration as user scroll
      const timer = setTimeout(() => {
        isInternalScrollRef.current = false;
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [activeTab]);

  // 3. Auto-scroll TOC to active item when tab is opened
  useEffect(() => {
    if (activeTab === 'content' && activeId) {
      const timer = setTimeout(() => {
        const activeItem = document.getElementById(`toc-item-${activeId}`);
        if (activeItem) {
          activeItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300); // Wait for tab animation to finish
      return () => clearTimeout(timer);
    }
  }, [activeTab, activeId]);

  // --- Data Fetching & Mutations ---

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
        showToast({
          type: 'warning',
          title: 'Verification Required',
          message: 'Please verify your email to favorite guides.'
        });
        return;
      }
      const result = await toggleFavoriteAction(slug);
      if (!result.success) throw new Error(result.message);
      return result;
    },
    onSuccess: (data) => {
      if (!data) return;
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
      showToast({
        type: 'success',
        title: data.isFavorite ? 'Added to Favorites' : 'Removed from Favorites',
        message: data.message
      });
    }
  });

  const [localSteps, setLocalSteps] = useState(checklistSteps);

  const saveMutation = useMutation({
    mutationFn: async ({ indices }) => {
      return await updateProgressAction(slug, indices);
    },
    onSuccess: (data, { nextSteps }) => {
      setLocalSteps(nextSteps);
      setSavingIndex(null);
      queryClient.invalidateQueries({ queryKey: ['progress', slug] });
      queryClient.invalidateQueries({ queryKey: ['user-data'] });
    },
    onError: () => {
      setSavingIndex(null);
      showToast({
        type: 'error',
        title: 'Sync Failed',
        message: 'Could not save progress. Please try again.'
      });
    }
  });

  // Sync server data to local state ONLY if user is not currently active
  useEffect(() => {
    // DON'T sync if a save is in progress or the user just interacted
    if (!progressData?.completedTasks || saveMutation.isPending || savingIndex !== null) return;
    
    const isUserInactive = Date.now() - lastInteractionRef.current > 3000;
    if (!isUserInactive) return;

    const completedIndices = progressData.completedTasks.split(',').filter(Boolean).map(Number);
    const nextSteps = checklistSteps.map((step, i) => ({
      ...step,
      completed: completedIndices.includes(i)
    }));

    // Only update if actually different to prevent unnecessary renders
    const currentLocalIndices = localSteps
      .map((s, i) => s.completed ? i : null)
      .filter(i => i !== null)
      .join(',');

    if (progressData.completedTasks !== currentLocalIndices) {
      // Use a timeout to satisfy the 'setState-in-effect' rule while maintaining sync
      const timer = setTimeout(() => {
        setLocalSteps(nextSteps);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [progressData, checklistSteps, saveMutation.isPending, localSteps, savingIndex]);

  const handleStepToggle = (index) => {
    if (!isLoggedIn) {
      openAuthModal();
      return;
    }
    
    // Update interaction time immediately to block server sync
    lastInteractionRef.current = Date.now();

    const nextSteps = localSteps.map((s, i) => 
      i === index ? { ...s, completed: !s.completed } : s
    );
    
    const indices = nextSteps
      .map((s, i) => s.completed ? i : null)
      .filter(i => i !== null)
      .join(',');
    
    // If verified, fire mutation and wait for success to update UI
    if (isVerified) {
      setSavingIndex(index);
      saveMutation.mutate({ indices, index, nextSteps });
    } else {
      // For unverified/manual mode, update immediately
      setLocalSteps(nextSteps);
    }
  };

  const completedCount = localSteps.filter(s => s.completed).length;
  const progressPercent = localSteps.length ? Math.round((completedCount / localSteps.length) * 100) : 0;
  
  // Calculate next step index, but ANCHOR it to the current saving index if in flight
  const nextStepIndex = savingIndex !== null 
    ? savingIndex 
    : localSteps.findIndex(s => !s.completed);

  // --- Effects ---

  useEffect(() => {
    if (slug) setActiveGuideSlug(slug);
    if (activeTab !== 'guide') return; // Only observe when on guide tab

    const handleObserver = (entries) => {
      // Don't update during programmatic scroll restoration
      if (isInternalScrollRef.current) return;

      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "-20% 0px -70% 0px", // Better pinpointing for the active section
    });

    const timer = setTimeout(() => {
      headings.forEach((h) => {
        const el = document.getElementById(h.id);
        if (el) observer.current.observe(el);
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      observer.current?.disconnect();
    };
  }, [headings, slug, setActiveGuideSlug, activeTab]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${title} | AyosDocs`,
        text: `Check out this government guide: ${title}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast({ type: 'success', title: 'Link Copied', message: 'URL copied to clipboard.' });
    }
  };

  // --- Sub-components (Internal for Consolidation) ---
  // Moved outside to fix ESLint errors

  return (
    <div className="min-h-screen bg-ios-gradient pb-32">
      {/* High-Fidelity Fixed Navigation */}
      <nav className="sticky top-[var(--header-offset,4rem)] lg:top-16 z-40 bg-white/70 backdrop-blur-xl border-b border-white/40 px-6 py-4 flex items-center gap-4 transition-[top] duration-500 ease-in-out">
        <button onClick={() => router.back()} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform shrink-0">
          <ChevronLeft size={24} className="text-[#1C1C1E]" strokeWidth={2.5} />
        </button>
        
        <div className="flex-1 flex bg-[#E5E5EA]/50 rounded-[18px] p-1 gap-1 max-w-[400px] mx-auto border border-white/20">
          <button 
            onClick={() => setActiveTab('guide')} 
            className={`flex-1 rounded-[14px] px-2 py-1.5 lowercase first-letter:uppercase text-[13px] font-black transition-all duration-300 ${activeTab === 'guide' ? 'bg-white text-[#0038A8] shadow-[0_2px_10px_rgba(0,0,0,0.06)]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'}`}
          >
            Guide
          </button>
          <button 
            onClick={() => setActiveTab('content')} 
            className={`flex-1 rounded-[14px] px-2 py-1.5 lowercase first-letter:uppercase text-[13px] font-black transition-all duration-300 ${activeTab === 'content' ? 'bg-white text-[#0038A8] shadow-[0_2px_10px_rgba(0,0,0,0.06)]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'}`}
          >
            Content
          </button>
          <button 
            onClick={() => setActiveTab('tracker')} 
            className={`flex-1 rounded-[14px] px-2 py-1.5 lowercase first-letter:uppercase text-[13px] font-black transition-all duration-300 ${activeTab === 'tracker' ? 'bg-white text-[#0038A8] shadow-[0_2px_10px_rgba(0,0,0,0.06)]' : 'text-[#8E8E93] hover:text-[#1C1C1E]'}`}
          >
            Tracker
          </button>
        </div>

        {/* Action buttons removed from here to declutter sticky nav */}
        <div className="w-10 h-10 hidden sm:block" /> 
      </nav>

      <div className="max-w-[800px] mx-auto pt-8 px-6 space-y-10">
        
        <TabPanel active={activeTab === 'guide'} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
           {/* Guide Header */}
           <header className="flex justify-between items-start gap-6">
              <div className="space-y-4 flex-1">
                <div className="space-y-1">
                   <div className="flex items-center justify-between gap-4">
                     <p className="text-[14px] font-black text-[#0038A8] uppercase tracking-wider">{category || 'Civil Clearance'}</p>
                     <div className="flex items-center gap-2">
                       <button onClick={() => favoriteMutation.mutate()} className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform ${isFavorite ? 'bg-[#FFD700]/10' : 'bg-white'}`}>
                         <Heart size={22} className={isFavorite ? 'text-[#FFD700]' : 'text-[#1C1C1E]'} fill={isFavorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
                       </button>
                       <button onClick={handleShare} className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm active:scale-90 transition-transform">
                         <MoreHorizontal size={22} className="text-[#1C1C1E]" strokeWidth={2.5} />
                       </button>
                     </div>
                   </div>
                   <h1 className="text-[34px] font-black text-[#1C1C1E] leading-tight tracking-tight">{title}</h1>
                </div>
                <p className="text-[16px] font-medium text-gray-500 leading-relaxed max-w-[480px]">
                   {description || `An ${title} is a document issued by the ${agency} for employment, travel, or other legal purposes.`}
                </p>
              </div>
              <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-[32px] p-5 shadow-sm text-center min-w-[120px] shrink-0">
                 <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mx-auto mb-3">
                   <GuideIcon slug={slug} agency={agency} size={48} />
                 </div>
                 <p className="text-[14px] font-black text-[#1C1C1E]">{agency}</p>
                 <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mt-1">Agency</p>
              </div>
           </header>

           {/* Stats Grid */}
           <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-[28px] p-4 shadow-sm flex items-center gap-3">
                 <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#0038A8]">
                    <Clock size={20} />
                 </div>
                 <div>
                    <p className="text-[14px] font-black text-[#1C1C1E] leading-none">{readTime}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Processing</p>
                 </div>
              </div>
              <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-[28px] p-4 shadow-sm flex items-center gap-3">
                 <div className="w-10 h-10 bg-yellow-50 rounded-full flex items-center justify-center text-[#FFB800]">
                    <Coins size={20} />
                 </div>
                 <div>
                    <p className="text-[14px] font-black text-[#1C1C1E] leading-none">{costRange}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Est. Cost</p>
                 </div>
              </div>
              <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-[28px] p-4 shadow-sm flex items-center gap-3">
                 <div className="w-10 h-10 bg-purple-50 rounded-full flex items-center justify-center text-[#9333EA]">
                    <BarChart3 size={20} />
                 </div>
                 <div>
                    <p className="text-[14px] font-black text-[#1C1C1E] leading-none">{difficulty}</p>
                    <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Difficulty</p>
                 </div>
              </div>
           </div>

           <RequirementsSection requirements={requirements} />

           <FeesSection fees={fees} />

           {/* About Section */}
           <section className="space-y-6">
              <h2 className="text-[22px] font-black text-[#1C1C1E] tracking-tight px-1">About this guide</h2>
              <div className="bg-white/40 backdrop-blur-md border border-white/30 rounded-[32px] p-8 md:p-10 shadow-sm prose prose-ctp max-w-none">
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

        <TabPanel active={activeTab === 'tracker'} className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
           <header className="space-y-6">
              <div className="flex justify-between items-start">
                 <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h2 className="text-[28px] font-black text-[#1C1C1E] tracking-tight">{title} Tracker</h2>
                      {isLoggedIn && (
                        <div className="flex items-center gap-1.5 mt-1">
                          {!isVerified ? (
                            <Badge variant="yellow" icon={AlertCircle} className="px-2 py-0.5 text-[10px]">Pending</Badge>
                          ) : saveMutation.isPending ? (
                            <Badge variant="sky" icon={Loader2} className="px-2 py-0.5 text-[10px] text-[#0038A8]">Saving...</Badge>
                          ) : (
                            <Badge variant="green" icon={ShieldCheck} className="px-2 py-0.5 text-[10px]">Saved</Badge>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-[15px] font-medium text-gray-400">
                      {completedCount} of {localSteps.length} steps completed ({progressPercent}% Complete)
                    </p>
                 </div>
                 <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-white/40 shrink-0">
                   <GuideIcon slug={slug} agency={agency} size={36} />
                 </div>
              </div>

              {isLoggedIn && !isVerified && (
                <div className="bg-amber-50 border border-amber-100 rounded-[20px] p-4 flex items-center gap-4 animate-in slide-in-from-top-2">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                    <AlertCircle size={20} />
                  </div>
                  <div>
                    <p className="text-[14px] font-black text-amber-900 leading-tight">Sync Restricted</p>
                    <p className="text-[12px] font-medium text-amber-700/80 mt-0.5">Please verify your email to save your progress permanently.</p>
                  </div>
                </div>
              )}

              <div className="h-4 bg-gray-100/50 rounded-full border border-white/40 overflow-hidden shadow-inner p-1">
                 <div className="h-full bg-[#0038A8] rounded-full shadow-[0_0_12px_rgba(0,56,168,0.4)] transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }} />
              </div>
           </header>

           <div className="pt-4 pb-20">
              {localSteps.map((step, i) => (
                <TrackerStep 
                  key={i} 
                  step={step} 
                  index={i} 
                  isLast={i === localSteps.length - 1} 
                  localSteps={localSteps}
                  onToggle={handleStepToggle}
                  isNext={i === nextStepIndex}
                  isSaving={saveMutation.isPending && i === savingIndex}
                />
              ))}

              {!isLoggedIn && (
                <div className="mt-10 bg-white/60 backdrop-blur-md border border-white/40 rounded-[32px] p-8 text-center space-y-6 shadow-sm">
                  <div className="w-16 h-16 bg-ios-gradient rounded-full flex items-center justify-center mx-auto text-[#0038A8] shadow-sm">
                    <UserPlus size={32} />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-[18px] font-black text-[#1C1C1E]">Unlock Progress Tracking</h3>
                    <p className="text-[14px] font-medium text-gray-500 max-w-[280px] mx-auto leading-relaxed">
                      Create an account to save your checklist progress across all your devices.
                    </p>
                  </div>
                  <Button 
                    onClick={openAuthModal}
                    className="w-full h-14 rounded-2xl bg-[#0038A8] hover:bg-[#002B82] text-white text-[16px] font-black shadow-lg shadow-[#0038A8]/20 transition-all active:scale-[0.98]"
                  >
                    Get Started for Free
                  </Button>
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest flex items-center justify-center gap-2">
                    <ShieldCheck size={12} className="text-emerald-500" />
                    Identity Sync Verified
                  </p>
                </div>
              )}
           </div>
        </TabPanel>

        <TabPanel active={activeTab === 'content'} className="animate-in fade-in slide-in-from-bottom-4 duration-700">
           <div className="bg-white/60 backdrop-blur-md border border-white/40 rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8 px-2">
                <h2 className="text-[22px] font-black text-[#1C1C1E] tracking-tight">Table of Contents</h2>
                <span className="text-[12px] font-bold text-gray-400 uppercase tracking-widest bg-gray-100/50 px-3 py-1 rounded-full">
                  {headings.length} Sections
                </span>
              </div>
              <div className="space-y-3">
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
                      className={`w-full flex items-center justify-between p-5 rounded-2xl transition-all duration-300 group
                        ${isActive 
                          ? 'bg-[#0038A8] text-white shadow-[0_8px_20px_rgba(0,56,168,0.2)] scale-[1.02]' 
                          : 'bg-white/40 hover:bg-white text-[#1C1C1E] border border-white/20 hover:border-[#0038A8]/10'
                        }
                      `}
                    >
                      <div className="flex items-center gap-5">
                         <span className={`text-[13px] font-black w-6 h-6 rounded-full flex items-center justify-center transition-colors
                           ${isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}
                         `}>
                           {i + 1}
                         </span>
                         <span className="text-[16px] font-black tracking-tight text-left leading-tight">
                           {h.text}
                         </span>
                      </div>
                      <div className={`transition-all duration-300 ${isActive ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-40'}`}>
                        <ArrowRight size={18} strokeWidth={3} />
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
