import React from 'react';

/**
 * Reusable Page Header component for the top of main discovery pages.
 * Matches the design used in Guides, Bundles, and Offices pages.
 * 
 * @param {Object} props
 * @param {import('lucide-react').LucideIcon} props.icon - The icon to display in the left box.
 * @param {string} props.title - The main heading text.
 * @param {string} props.description - The sub-heading text.
 * @param {React.ReactNode} [props.actions] - Optional right-side content (stats, badges, etc.).
 * @param {string} [props.className] - Additional CSS classes for the outer container.
 * @param {string} [props.iconBoxClassName] - Additional CSS classes for the icon container.
 * @param {string} [props.iconClassName] - Additional CSS classes for the icon.
 */
const DashboardPageHeader = ({ 
  icon: Icon, 
  title, 
  description, 
  actions,
  isCentered = false,
  className = "",
  iconBoxClassName = "bg-ctp-sky-800/10 border-ctp-sky-800/20",
  iconClassName = "text-ctp-sky-800"
}) => {
  if (isCentered) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-16 lg:py-20 flex flex-col items-center text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-ctp-text tracking-tighter leading-tight">
            {title}
          </h1>
          <p className="text-ctp-subtext1 text-sm md:text-lg font-bold mt-4 max-w-xl opacity-60 uppercase tracking-[0.2em]">
            {description}
          </p>

          {actions && (
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-10">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-ctp-mantle/50 border-b border-ctp-surface1 ${className}`}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-6 lg:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 flex-1">
          {Icon && (
            <div className={`p-5 rounded-3xl shrink-0 border shadow-sm ${iconBoxClassName}`}>
              <Icon className={iconClassName} size={28} />
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-ctp-text tracking-tight">
              {title}
            </h1>
            <p className="text-ctp-subtext1 text-base font-medium mt-1.5 opacity-80">
              {description}
            </p>
          </div>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-4 md:gap-6 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPageHeader;
