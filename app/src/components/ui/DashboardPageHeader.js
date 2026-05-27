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
  className = "",
  iconBoxClassName = "bg-ctp-sky-800/10 border-ctp-sky-800/20",
  iconClassName = "text-ctp-sky-800"
}) => {
  return (
    <div className={`bg-ctp-mantle/50 border-b border-ctp-surface1 ${className}`}>
      <div className="max-w-[1600px] mx-auto px-6 lg:px-10 py-6 lg:py-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 flex-1">
          {Icon && (
            <div className={`p-4 rounded-2xl shrink-0 border shadow-sm ${iconBoxClassName}`}>
              <Icon className={iconClassName} size={24} />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-ctp-text tracking-tight uppercase">
              {title}
            </h1>
            <p className="text-ctp-subtext1 text-sm font-medium mt-1">
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
