import React from 'react';

/**
 * Specialized Page Header for public informational pages (About, Support, FAQs, etc.).
 * Features a center-aligned design to provide a more readable, focused layout
 * for long-form content and informational sections.
 * 
 * @param {Object} props
 * @param {import('lucide-react').LucideIcon} props.icon - The icon to display at the top.
 * @param {string} props.title - The main heading text.
 * @param {string} props.description - The sub-heading text.
 * @param {React.ReactNode} [props.actions] - Optional center-aligned content under description.
 * @param {string} [props.className] - Additional CSS classes for the outer container.
 * @param {string} [props.iconBoxClassName] - Additional CSS classes for the icon container.
 * @param {string} [props.iconClassName] - Additional CSS classes for the icon.
 */
const PublicPageHeader = ({ 
  icon: Icon, 
  title, 
  description, 
  actions,
  className = "",
  iconClassName = "text-ctp-sky-800/40"
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="max-w-5xl mx-auto px-6 lg:px-10 pb-6 lg:pb-6 flex flex-col items-center text-center">
        {Icon && (
          <div className="mb-4">
            <Icon className={iconClassName} size={32} strokeWidth={1.5} />
          </div>
        )}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-ctp-text tracking-tight uppercase">
            {title}
          </h1>
          <p className="text-ctp-subtext1 text-sm md:text-base font-medium max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 shrink-0 mt-6">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPageHeader;
