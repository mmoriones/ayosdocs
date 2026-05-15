/**
 * AdSense Component
 * Handles the display of AdSense banners or placeholders based on the environment configuration.
 * 
 * @param {Object} props
 * @param {'skyscraper' | 'sidebar' | 'article'} props.variant - The layout variant of the ad.
 * @returns {JSX.Element | null}
 */
const Adsense = ({ variant = 'sidebar' }) => {
  const isEnabled = process.env.NEXT_PUBLIC_ADSENSE_ENABLED === 'true';

  if (!isEnabled) return null;

  const renderPlaceholder = () => {
    switch (variant) {
      case 'skyscraper':
        return (
          <div className="p-4 border border-ctp-surface0 rounded-xl shadow-sm bg-ctp-mantle">
            <p className="text-[14px] text-ctp-subtext0 mb-2 text-center uppercase font-bold tracking-widest">
              Sponsored Ads
            </p>
            <div className="h-[400px] w-full border-2 border-dashed flex flex-col items-center justify-center rounded-lg text-ctp-subtext1 p-4 bg-ctp-base border-ctp-surface0">
              <p className="text-[18px] font-semibold">AdSense Skyscraper</p>
              <p className="text-[14px] text-center mt-2">(High-visibility placement for manual review)</p>
            </div>
          </div>
        );

      case 'article':
        return (
          <div className="my-8 p-6 border-2 border-dashed rounded-2xl text-center text-[14px] bg-ctp-mantle border-ctp-surface0 text-ctp-subtext0">
            <p className="font-bold uppercase tracking-widest mb-2 opacity-50">Advertisement</p>
            <div className="h-24 flex items-center justify-center font-medium">
              Horizontal AdSense Placeholder
            </div>
          </div>
        );

      case 'sidebar':
      default:
        return (
          <div className="p-4 border border-ctp-surface0 rounded-xl shadow-sm bg-ctp-mantle">
            <p className="text-[14px] mb-2 text-center uppercase font-bold tracking-widest text-ctp-subtext0">
              Sponsored Ads
            </p>
            <div className="space-y-4">
              <div className="h-64 w-full border border-dashed rounded-lg flex items-center justify-center text-[14px] bg-ctp-base border-ctp-surface0 text-ctp-subtext1">
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
