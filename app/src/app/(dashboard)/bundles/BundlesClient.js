'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { 
  ArrowRight, 
  CheckSquare
} from 'lucide-react';
import { Skeleton } from '@/components/ui'
import { bundleStyles } from '@/lib/assetStyles';

// --- Inlined from components/ui/TrackingIndicator.js ---
const TrackingIndicator = ({ 
  variant = 'guide', 
  label, 
  pulse = false,
  className = "" 
}) => {
  const isBundle = variant === 'bundle';
  
  const styles = {
    guide: {
      container: "bg-ctp-green/[0.05] text-ctp-green border-ctp-green/10",
      dot: "bg-ctp-green shadow-[0_0_4px_rgba(166,227,161,0.5)]",
      text: "TRACKING"
    },
    bundle: {
      container: "bg-ctp-sky-800/[0.05] text-ctp-sky-800 border-ctp-sky-800/20",
      dot: "bg-ctp-sky-800 shadow-[0_0_4px_rgba(4,165,229,0.5)]",
      text: "ACTIVE"
    }
  };

  const current = styles[variant] || styles.guide;

  return (
    <div className={`inline-flex items-center gap-1.5 px-1.5 py-0.5 rounded border transition-all ${current.container} ${className}`}>
      <div className={`w-1 h-1 rounded-full ${current.dot} ${pulse ? 'animate-pulse' : ''}`} />
      <span className="text-ui-tiny font-bold uppercase tracking-[0.15em] leading-none">
        {label || current.text}
      </span>
    </div>
  );
};
// --- End of TrackingIndicator ---

/**
 * Mapping of Bundle IDs to their respective 3D illustrations.
 */
const bundleImages = {
  'first-job': '/assets/bundles/Job.webp',
  'ofw': '/assets/bundles/Ofw.webp',
  'wedding': '/assets/bundles/Marriage.webp',
  'business': '/assets/bundles/Business.webp',
  'travel-tourist': '/assets/bundles/Travel.webp',
  'senior-citizen': '/assets/bundles/SeniorCouple.webp',
  'pwd-benefits': '/assets/bundles/WheelChair.webp',
  'solo-parent': '/assets/bundles/SoloParent.webp',
  'foundational-docs': '/assets/bundles/GeneralIdentity.webp',
};

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
    <div className="min-h-screen bg-ios-gradient font-sans transition-colors duration-300">
      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 lg:px-10 py-6 sm:py-10">
        {/* HEADER */}
        <div className="mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-ctp-text">Life Events</h1>
        </div>

        {/* BUNDLES LIST */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
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
  const totalGuides = bundle.flow.reduce((acc, step) => acc + step.guides.length, 0);
  const theme = bundleStyles[bundle.id] || bundleStyles['foundational-docs'];
  const imagePath = bundleImages[bundle.id] || bundleImages['foundational-docs'];

  return (
    <Link 
      href={`/bundles/${bundle.id}`}
      className="group bg-ctp-mantle rounded-[24px] sm:rounded-[32px] p-4 sm:p-5 border border-ctp-surface1 shadow-sm hover:shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all duration-500 flex flex-row gap-4 sm:gap-6 items-center relative overflow-hidden"
    >
      {/* 3D ILLUSTRATION CONTAINER */}
      <div 
        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-[18px] sm:rounded-[24px] flex items-center justify-center relative overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500"
        style={{ 
          background: theme.gradient || theme.bg,
        }}
      >
        <div className="relative w-16 h-16 sm:w-24 sm:h-24 md:w-28 md:h-28">
          <Image 
            src={imagePath} 
            alt={bundle.title}
            fill
            className="object-contain drop-shadow-xl group-hover:rotate-3 transition-transform duration-500"
            sizes="(max-width: 640px) 64px, (max-width: 768px) 96px, 112px"
          />
        </div>
        
        {isTracking && (
          <div className="absolute top-2 right-2">
            <TrackingIndicator variant="bundle" pulse />
          </div>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 flex flex-col justify-center py-0.5 text-left min-w-0">
        <div className="mb-2 sm:mb-3">
          <h3 className="text-base sm:text-lg md:text-xl font-bold text-ctp-text mb-0.5 sm:mb-1 tracking-tight group-hover:text-brand-blue transition-colors truncate">
            {bundle.title}
          </h3>
          <p className="text-xs sm:text-sm text-ctp-subtext0 font-medium leading-relaxed line-clamp-2 mb-2 sm:mb-3">
            {bundle.description}
          </p>
          
          <div className="flex items-center gap-1.5 text-ctp-subtext0">
            <CheckSquare size={14} className="text-brand-blue/60" />
            <span className="text-[10px] sm:text-xs font-bold tracking-tight uppercase opacity-80">{totalGuides} Guides</span>
          </div>
        </div>

        <div className="mt-1 sm:mt-2 flex justify-end">
          <div className="inline-flex items-center justify-center gap-1.5 bg-brand-blue text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-bold text-[11px] sm:text-xs shadow-md shadow-brand-blue/10 group-hover:shadow-brand-blue/30 transition-all group-hover:translate-x-1">
            View Details
            <ArrowRight size={14} strokeWidth={3} />
          </div>
        </div>
      </div>

      {/* SUBTLE BACKGROUND DECOR */}
      <div className="absolute -bottom-6 -right-6 w-20 h-20 bg-brand-blue/5 rounded-full blur-2xl group-hover:bg-brand-blue/10 transition-colors duration-500 hidden md:block"></div>
    </Link>
  );
};

BundleCard.Skeleton = function BundleCardSkeleton() {
  return (
    <div className="bg-ctp-mantle rounded-[32px] p-6 border border-ctp-surface1 shadow-sm flex flex-col sm:flex-row gap-6 items-center">
      <Skeleton className="w-full sm:w-[180px] h-[180px] rounded-[24px]" />
      <div className="flex-1 space-y-4 py-2 w-full">
        <Skeleton className="w-2/3 h-7 rounded-lg" />
        <Skeleton className="w-full h-4 rounded-md" />
        <Skeleton className="w-5/6 h-4 rounded-md" />
        <Skeleton className="w-32 h-4 rounded-md mt-4" />
        <Skeleton className="w-40 h-12 rounded-2xl mt-6" />
      </div>
    </div>
  );
};
