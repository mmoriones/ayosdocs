/**
 * AdSense Component
 * Handles the display of AdSense banners or placeholders based on the environment configuration.
 * 
 * @param {Object} props
 * @param {'skyscraper' | 'sidebar' | 'article'} props.variant - The layout variant of the ad.
 * @returns {JSX.Element | null}
 */
const Adsense = ({ variant = 'sidebar' }) => {
  const isEnabled = import.meta.env.VITE_ADSENSE_ENABLED === 'true';

  // If ads are disabled in the environment, we hide the component entirely.
  // This allows toggling across deployments without code changes.
  if (!isEnabled) return null;

  const renderPlaceholder = () => {
    switch (variant) {
      case 'skyscraper':
        return (
          <div className="p-4 border border-slate-200 rounded-xl shadow-sm bg-white">
            <p className="text-[10px] text-gray-400 mb-2 text-center uppercase font-bold tracking-widest">
              Sponsored Ads
            </p>
            <div className="h-[400px] w-full border-2 border-dashed flex flex-col items-center justify-center rounded-lg text-gray-400 p-4 bg-slate-50 border-slate-200">
              <p className="text-sm font-semibold">AdSense Skyscraper</p>
              <p className="text-[10px] text-center mt-2">(High-visibility placement for manual review)</p>
            </div>
          </div>
        );

      case 'article':
        return (
          <div className="my-8 p-6 border-2 border-dashed rounded-2xl text-center text-xs bg-white border-slate-200 text-gray-400">
            <p className="font-bold uppercase tracking-widest mb-2 opacity-50">Advertisement</p>
            <div className="h-24 flex items-center justify-center font-medium">
              Horizontal AdSense Placeholder
            </div>
          </div>
        );

      case 'sidebar':
      default:
        return (
          <div className="p-4 border border-slate-200 rounded-xl shadow-sm bg-white">
            <p className="text-[10px] mb-2 text-center uppercase font-bold tracking-widest text-gray-400">
              Sponsored Ads
            </p>
            <div className="space-y-4">
              <div className="h-64 w-full border border-dashed rounded-lg flex items-center justify-center text-xs bg-slate-50 border-slate-200 text-gray-400">
                [ADSENSE PLACEHOLDER]
              </div>
            </div>
          </div>
        );
    }
  };

  return renderPlaceholder();
};

export default Adsense;
