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
  iconBoxClassName = "bg-[#0038A8]/10 border-[#0038A8]/10",
  iconClassName = "text-[#0038A8]"
}) => {
  if (isCentered) {
    return (
      <div className={`relative overflow-hidden ${className}`}>
        <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-16 lg:py-20 flex flex-col items-center text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-black text-[#1C1C1E] tracking-tighter leading-tight">
            {title}
          </h1>
          <p className="text-gray-400 text-sm md:text-lg font-bold mt-4 max-w-xl">
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
    <div className={`bg-white border-b border-gray-100 ${className}`}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-6 lg:py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6 flex-1 text-center md:text-left">
          {Icon && (
            <div className={`p-6 rounded-[28px] lg:rounded-[32px] shrink-0 border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.03)] ${iconBoxClassName}`}>
              <Icon className={iconClassName} size={32} strokeWidth={2} />
            </div>
          )}
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#1C1C1E] tracking-tight">
              {title}
            </h1>
            <p className="text-gray-400 text-[15px] lg:text-lg font-medium mt-1.5">
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
