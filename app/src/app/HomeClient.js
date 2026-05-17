'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Hero from '@/features/guides/components/discovery/Hero';
import StartWithGoal from '@/features/guides/components/discovery/StartWithGoal';
import RecentExperiences from '@/features/guides/components/discovery/RecentExperiences';
import ChecklistCard from '@/features/guides/components/tracking/ChecklistCard';
import HolidayAlert from '@/components/HolidayAlert';
import WhySignUp from '@/features/guides/components/callouts/WhySignUp';
import Adsense from '@/components/Adsense';
import OnboardingBanner from '@/features/guides/components/discovery/OnboardingBanner';
import RecentlyUpdated from '@/features/guides/components/discovery/RecentlyUpdated';
import { useSession } from 'next-auth/react';
import { useAuthUI } from '@/components/Providers';
import { ArrowRight, MapPin, Clock, Sparkles, MessageSquare } from 'lucide-react';
import GuideCard from '@/features/guides/components/GuideCard';
import TrendingWidget from '@/features/guides/components/discovery/TrendingWidget';

export default function HomeClient({ allGuides }) {
  const [activeSlug, setActiveSlug] = useState('getting-started');
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const { openAuthModal } = useAuthUI();
  const router = useRouter();

  // Popular guides logic moved from TrendingGuides
  const popularSlugs = [
    'passport-appointment',
    'nbi-clearance',
    'sss-registration',
    'psa-birth-certificate',
    'national-id'
  ];

  const popularGuides = popularSlugs
    .map(slug => allGuides.find(g => g.slug === slug))
    .filter(Boolean);

  // Onboarding status usually comes from user profile in DB. 
  // For now, let's assume false if not logged in.
  const onboarded = session?.user?.onboarded ?? false;

  useEffect(() => {
    const lastSlug = localStorage.getItem("lastGuideSlug");
    if (lastSlug && lastSlug !== activeSlug) {
      setTimeout(() => setActiveSlug(lastSlug), 0);
    }
  }, [activeSlug]);

  const activeGuide = activeSlug !== 'getting-started' ? allGuides.find(g => g.slug === activeSlug) : null;

  return (
    <div className="bg-ctp-base font-sans text-ctp-text">
      <Hero guides={allGuides} />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-12 space-y-16">
        <section className="-mt-8 relative z-20">
          <HolidayAlert />
        </section>

        <section className="py-2 border-y border-ctp-surface1/50">
          <Adsense variant="article" />
        </section>

        <section className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 text-ctp-sky-800">
              <Sparkles size={18} />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Next Steps</span>
            </div>
            <h2 className="text-3xl lg:text-4xl font-bold text-ctp-text tracking-tight leading-tight">
              {isLoggedIn ? "Your Application Progress" : "Plan your government journey"}
            </h2>
            <p className="text-ctp-subtext1 font-medium max-w-xl mx-auto text-lg">
              Follow our guided workflows to complete your requirements efficiently.
            </p>
          </div>

          <div className="space-y-8">
            {activeGuide && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pl-4">
                  <div className="w-8 h-8 rounded-lg bg-ctp-sky-10 text-ctp-sky-800 flex items-center justify-center border border-ctp-surface1 shadow-sm">
                    <Clock size={16} />
                  </div>
                  <h3 className="text-xs font-bold text-ctp-subtext1 uppercase tracking-widest">Continue where you left off</h3>
                </div>
                <div className="shadow-sm rounded-2xl">
                  <ChecklistCard
                    title={activeGuide.title}
                    initialSteps={activeGuide.checklist?.map(task => ({ task }))}
                    slug={activeSlug}
                    agency={activeGuide.agency}
                    inGuidePage={false}
                    isModal={false}
                  />
                </div>
              </div>
            )}

            {!activeGuide && (
              <div className="bg-ctp-mantle rounded-2xl p-10 flex flex-col lg:flex-row items-center gap-10 relative overflow-hidden group border border-ctp-surface1 shadow-sm">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-ctp-sky-800/[0.03] -skew-x-12 translate-x-1/4 pointer-events-none" />
                
                <div className="w-16 h-16 rounded-2xl bg-ctp-sky-800 text-white flex items-center justify-center shadow-lg shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <ArrowRight size={28} strokeWidth={2.5} />
                </div>

                <div className="flex-1 text-center lg:text-left space-y-2">
                  <h3 className="text-2xl font-bold text-ctp-text tracking-tight leading-none">Start Tracking Your Progress</h3>
                  <p className="text-ctp-subtext1 text-lg font-medium leading-relaxed max-w-md mx-auto lg:mx-0">
                    Pick a guide and start checking off requirements to keep your application on schedule.
                  </p>
                </div>

                <button 
                  onClick={() => router.push('/guides')}
                  className="w-full lg:w-auto px-8 py-4 bg-ctp-sky-800 text-white rounded-xl font-bold hover:bg-ctp-sky-800/90 transition-all active:scale-95 shadow-md whitespace-nowrap text-sm uppercase tracking-widest"
                >
                  Browse All Guides
                </button>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between gap-4 pl-4 pr-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-ctp-sky-10 text-ctp-sky-800 flex items-center justify-center border border-ctp-surface1 shadow-sm">
                    <MapPin size={16} />
                  </div>
                  <h3 className="text-xs font-bold text-ctp-subtext1 uppercase tracking-widest">Choose a Life Event Goal</h3>
                </div>
                <button 
                  onClick={() => router.push('/bundles')}
                  className="group flex items-center gap-1.5 text-ctp-sky-800/80 font-bold hover:text-ctp-sky-800 transition-colors text-[10px] uppercase tracking-widest"
                >
                  <span>View all bundles</span>
                  <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
              <StartWithGoal />
            </div>

            {!onboarded && (
              <OnboardingBanner />
            )}
          </div>

          <div className="pt-6 border-t border-ctp-surface1/50">
            <Adsense variant="article" />
          </div>
        </section>

        <section className="space-y-8">
          <div className="flex justify-between items-end gap-4 border-b border-ctp-surface1 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-ctp-sky-800">
                <Sparkles size={24} />
                <h2 className="text-2xl font-bold text-ctp-text tracking-tight">Popular Guides</h2>
              </div>
              <p className="text-[11px] text-ctp-subtext1 font-bold uppercase tracking-wider pl-1">Quick access to our most requested guides.</p>
            </div>
            
            <button 
              onClick={() => router.push('/guides')}
              className="group flex items-center gap-1.5 text-ctp-sky-800/80 font-bold hover:text-ctp-sky-800 transition-colors text-xs uppercase tracking-wider mb-1"
            >
              <span>View all guides</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {popularGuides.map((guide, idx) => {
              const colors = ['orange', 'green', 'yellow', 'mauve', 'teal'];
              return (
                <TrendingWidget 
                  key={guide.slug} 
                  guide={guide} 
                  stats={{ views: `${(5.2 - idx * 0.8).toFixed(1)}k` }}
                  color={colors[idx % colors.length]}
                />
              );
            })}
          </div>
        </section>

        <section className="pt-12 border-t border-ctp-surface1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            <div className="space-y-6 flex flex-col">
              <div className="flex justify-between items-end gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-ctp-sky-800">
                    <MapPin size={20} />
                    <h3 className="text-xl font-bold text-ctp-text tracking-tight">Find an Office</h3>
                  </div>
                  <p className="text-[10px] text-ctp-sky-800 font-bold uppercase tracking-widest pl-1">Locate branches and wait times</p>
                </div>
              </div>

              <div className="bg-ctp-mantle rounded-2xl p-6 border border-ctp-surface1 space-y-6 overflow-hidden relative group flex-1 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="h-32 -mx-6 -mt-6 mb-6 bg-ctp-crust relative overflow-hidden flex items-center justify-center border-b border-ctp-surface1">
                    <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(var(--sky-800)_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative w-16 h-16 rounded-xl bg-ctp-base shadow-sm flex items-center justify-center text-ctp-sky-800 group-hover:scale-105 transition-transform border border-ctp-surface1">
                      <MapPin size={32} />
                    </div>
                  </div>

                  <p className="text-base text-ctp-subtext1 font-medium leading-relaxed">
                    Locate government branches near you and check community-reported wait times.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="City or Agency name..." 
                      className="w-full pl-5 pr-12 py-3.5 rounded-xl border border-ctp-surface1 text-base font-medium focus:ring-4 focus:ring-ctp-sky-800/10 focus:border-ctp-sky-800 transition-all bg-ctp-base text-ctp-text placeholder:text-ctp-subtext0"
                    />
                    <ArrowRight size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-ctp-subtext0" />
                  </div>
                  <button className="w-full py-3.5 bg-ctp-sky-10 text-ctp-sky-800 border border-ctp-surface1 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-ctp-sky-800/5 transition-all active:scale-[0.98]">
                    Search Offices
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-6 flex flex-col">
              <div className="flex justify-between items-end gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-ctp-green">
                    <Sparkles size={20} />
                    <h3 className="text-xl font-bold text-ctp-text tracking-tight">Latest Updates</h3>
                  </div>
                  <p className="text-[10px] text-ctp-green font-bold uppercase tracking-widest pl-1">New requirements and processes</p>
                </div>
              </div>
              <RecentlyUpdated className="flex-1" />
            </div>

            <div className="space-y-6 flex flex-col">
              <div className="flex justify-between items-end gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-ctp-yellow">
                    <MessageSquare size={20} />
                    <h3 className="text-xl font-bold text-ctp-text tracking-tight">Community Reports</h3>
                  </div>
                  <p className="text-[10px] text-ctp-yellow font-bold uppercase tracking-widest pl-1">Latest wait times and ratings</p>
                </div>
              </div>
              <RecentExperiences className="flex-1" />
            </div>
          </div>
        </section>

        <section className="pt-6">
          <WhySignUp onSignUp={openAuthModal} />
        </section>

        <section className="pt-8">
          <div className="bg-ctp-mantle rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-10 border border-ctp-surface1 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-ctp-sky-800/[0.01] pointer-events-none" />
            <div className="flex flex-col lg:flex-row items-center gap-8 text-center lg:text-left relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-ctp-base shadow-sm flex items-center justify-center text-ctp-sky-800 shrink-0 border border-ctp-surface1">
                <span className="text-3xl font-bold">AD</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-3xl lg:text-4xl font-bold text-ctp-text tracking-tight leading-none">Need more help?</h3>
                <p className="text-ctp-subtext1 font-medium text-lg max-w-xl">Join our community or contact support for personalized assistance.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
              <Link href="/contact" className="px-8 py-4 bg-ctp-sky-10 border border-ctp-surface1 rounded-xl text-ctp-sky-800 font-bold uppercase tracking-widest hover:bg-ctp-sky-800/5 transition-all active:scale-95 text-sm">
                Help Center
              </Link>
              <Link href="/contact" className="px-8 py-4 bg-ctp-sky-800 text-white rounded-xl font-bold uppercase tracking-widest hover:bg-ctp-sky-800/90 transition-all active:scale-95 shadow-md text-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </section>

        <section className="py-4 border-y border-ctp-surface1/50">
          <Adsense variant="article" />
        </section>
      </div>
    </div>
  );
}
