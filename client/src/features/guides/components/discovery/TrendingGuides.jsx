import {
  TrendingUp,
  ArrowRight,
  Clock,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getGuideIcon } from '../../../../utils/guideIcons';
import { guidesMap } from '../../../../utils/loadGuides';

// Selected popular guides to display on home
const popularSlugs = [
  'passport-appointment',
  'nbi-clearance',
  'sss-registration',
  'psa-birth-certificate',
  'national-id'
]; // Display 5 for a single row on desktop

const TrendingGuides = () => {
  const navigate = useNavigate();

  const handleSelection = (slug) => {
    navigate(`/guides/${slug}`);
  };

  const trendingGuides = popularSlugs
    .map(slug => guidesMap[slug])
    .filter(Boolean);

  return (
    <div className="w-full">
      {/* GRID CONTAINER */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {trendingGuides.map((guide) => {
          const icon = getGuideIcon(guide.slug, guide.agency);

          return (
            <div
              key={guide.slug}
              onClick={() => handleSelection(guide.slug)}
              className="
                group relative flex flex-col p-6 rounded-[2.5rem] 
                bg-ctp-base border border-ctp-surface0 soft-shadow
                hover:border-ctp-sapphire/30 hover:-translate-y-2
                transition-all duration-500 cursor-pointer overflow-hidden
              "
            >
              
              {/* TOP-LEFT ICON */}
              <div className="w-14 h-14 rounded-2xl bg-ctp-mantle flex items-center justify-center p-3 mb-6 group-hover:scale-110 transition-transform shrink-0 border border-ctp-surface0">
                {icon ? (
                  <img 
                    src={icon} 
                    alt={guide.title} 
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <TrendingUp className="text-ctp-sapphire" size={28} />
                )}
              </div>

              {/* TITLE & DESC */}
              <div className="space-y-2 mb-6">
                <h3 className="text-[20px] font-black text-ctp-text group-hover:text-ctp-sapphire transition-colors leading-tight line-clamp-2 min-h-[3rem] tracking-tight">
                  {guide.title}
                </h3>
                <p className="text-[14px] text-ctp-subtext1 font-medium leading-relaxed line-clamp-2 opacity-80">
                  {guide.description || "Step-by-step requirements and procedures."}
                </p>
              </div>

              {/* METADATA & ARROW (Bottom Row) */}
              <div className="mt-auto flex items-center justify-between pt-5 border-t border-ctp-surface0/50">
                <div className="flex items-center gap-2 text-[12px] font-black text-ctp-subtext0 uppercase tracking-widest">
                  <Clock size={16} className="text-ctp-sapphire" />
                  <span>{guide.estimatedTime || "1-3 days"}</span>
                </div>
                
                <div className="w-10 h-10 rounded-xl bg-ctp-mantle flex items-center justify-center text-ctp-sapphire group-hover:bg-ctp-sapphire group-hover:text-ctp-base transition-all transform group-hover:rotate-[-45deg] shadow-sm border border-ctp-surface0">
                  <ArrowRight size={18} strokeWidth={3} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TrendingGuides;
