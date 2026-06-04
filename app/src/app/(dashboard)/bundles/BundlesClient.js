'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { 
  CheckSquare,
  ChevronRight
} from 'lucide-react';
import { Skeleton, Card } from '@/components/ui'
import { bundleStyles, bundleImages } from '@/lib/assetStyles';

// --- Inlined from components/ui/TrackingIndicator.js ---
const TrackingIndicator = ({ 
  variant = 'guide', 
  label, 
  pulse = false,
  className = "" 
}) => {
  const styles = {
    guide: {
      container: "bg-white/40 backdrop-blur-md text-[#34C759] border-white/60 shadow-sm",
      dot: "bg-[#34C759] shadow-[0_0_8px_rgba(52,199,89,0.5)]",
      text: "TRACKING"
    },
    bundle: {
      container: "bg-white/40 backdrop-blur-md text-[#0038A8] border-white/60 shadow-sm",
      dot: "bg-[#0038A8] shadow-[0_0_8px_rgba(0,56,168,0.4)]",
      text: "ACTIVE"
    }
  };

  const current = styles[variant] || styles.guide;

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-all ${current.container} ${className}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${current.dot} ${pulse ? 'animate-pulse' : ''}`} />
      <span className="text-[9px] font-black uppercase tracking-[0.1em] leading-none">
        {label || current.text}
      </span>
    </div>
  );
};
// --- End of TrackingIndicator ---

/**
 * BundlesClient Component
 * Redesigned discovery page for Life Events (Bundles).
 */
export default function BundlesClient({ initialBundles }) {
  const { data: session, status: authStatus } = useSession();
  const isLoggedIn = authStatus === 'authenticated';
  const isVerified = session?.user?.isVerified;

  // Fetch user data to check for tracked bundles
  const { data: userData } = useQuery({
    queryKey: ['user-data'],
    queryFn: async () => {
      const response = await axios.get('/api/user/all-data');
      return response.data;
    },
    enabled: isLoggedIn && isVerified,
  });

  return (
    <div className="min-h-screen bg-ios-gradient pb-32 font-sans selection:bg-[#0038A8]/10">
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 pt-12">
        {/* HIGH-FIDELITY HEADER */}
        <div className="mb-10 lg:mb-14">
          <h1 className="text-[34px] lg:text-[48px] font-bold text-[#1C1C1E] tracking-tight leading-none">
            Life Events
          </h1>
          <p className="text-[15px] lg:text-[17px] font-medium text-gray-500 mt-2">
            Bundled guides for your specific life milestones.
          </p>
        </div>

        {/* BUNDLES LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {initialBundles.map((bundle) => {
            const isTracking = userData?.trackedBundles?.some(b => b.bundleId === bundle.id);
            return <BundleCard key={bundle.id} bundle={bundle} isTracking={isTracking} />;
          })}
        </div>
      </div>
    </div>
  );
}

const BundleCard = ({ bundle, isTracking }) => {
  const router = useRouter();
  const totalGuides = bundle.flow.reduce((acc, step) => acc + step.guides.length, 0);
  const theme = bundleStyles[bundle.id] || bundleStyles['foundational-docs'];
  const imagePath = bundleImages[bundle.id] || bundleImages['foundational-docs'];

  return (
    <Card 
      interactive
      noPadding
      onClick={() => router.push(`/bundles/${bundle.id}`)}
      className="group bg-white/70 backdrop-blur-xl border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.04)] flex flex-row gap-5 lg:gap-8 items-center p-5 lg:p-6"
    >
      {/* 3D ILLUSTRATION CONTAINER */}
      <div 
        className="w-28 h-28 sm:w-32 sm:h-32 lg:w-44 lg:h-44 rounded-[24px] lg:rounded-[28px] flex items-center justify-center relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500 shadow-inner border border-white/40"
        style={{ 
          background: theme.gradient || theme.bg,
        }}
      >
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32">
          <Image 
            src={imagePath} 
            alt={bundle.title}
            fill
            className="object-contain drop-shadow-[-10px_12px_16px_rgba(0,0,0,0.12)] group-hover:rotate-3 transition-transform duration-500"
            sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 128px"
          />
        </div>
        
        {isTracking && (
          <div className="absolute top-2 right-2">
            <TrackingIndicator variant="bundle" pulse />
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col justify-center py-1 text-left min-w-0">
        <div className="mb-3 lg:mb-4 pr-8">
          <h3 className="text-lg lg:text-[22px] font-bold text-[#1C1C1E] mb-1 tracking-tight group-hover:text-[#0038A8] transition-colors truncate">
            {bundle.title.split(' / ')[0]}
          </h3>
          <p className="text-[13px] lg:text-[15px] text-gray-500 font-medium leading-relaxed line-clamp-2 mb-3 lg:mb-4">
            {bundle.description}
          </p>
          
          <div className="flex items-center gap-2 text-gray-400">
            <div className="bg-[#0038A8]/5 p-1 rounded-md">
              <CheckSquare size={14} className="text-[#0038A8]/60" />
            </div>
            <span className="text-[11px] lg:text-[12px] font-bold tracking-tight uppercase opacity-80">{totalGuides} Guides included</span>
          </div>
        </div>

        {/* NATIVE-LIKE ACTION INDICATOR */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6 lg:right-8 w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-300 group-active:bg-[#0038A8]/10 group-active:text-[#0038A8] transition-all">
          <ChevronRight size={20} strokeWidth={3} />
        </div>
      </div>

      {/* SUBTLE BACKGROUND DECOR */}
      <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#0038A8]/5 rounded-full blur-3xl group-hover:bg-[#0038A8]/10 transition-colors duration-700 hidden lg:block"></div>
    </Card>
  );
};

BundleCard.Skeleton = function BundleCardSkeleton() {
  return (
    <Card noPadding className="bg-white/70 backdrop-blur-xl border-white/60 shadow-sm flex flex-row gap-5 lg:gap-8 items-center p-5 lg:p-6">
      <Skeleton className="w-28 h-28 sm:w-32 sm:h-32 lg:w-44 lg:h-44 rounded-[24px] lg:rounded-[28px] shrink-0" />
      <div className="flex-1 space-y-3 lg:space-y-4 py-2 w-full">
        <Skeleton className="w-2/3 h-6 lg:h-7 rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="w-full h-3 lg:h-4 rounded-md" />
          <Skeleton className="w-5/6 h-3 lg:h-4 rounded-md" />
        </div>
        <Skeleton className="w-32 lg:w-40 h-4 lg:h-5 rounded-md mt-2 lg:mt-4" />
      </div>
    </Card>
  );
};
