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
  iconClassName = "text-[#007AFF]/20"
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="max-w-5xl mx-auto px-6 lg:px-10 pb-6 lg:pb-6 flex flex-col items-center text-center">
        {Icon && (
          <div className="mb-6 w-16 h-16 rounded-[20px] bg-white shadow-sm border border-gray-100 flex items-center justify-center">
            <Icon className="text-[#007AFF]" size={32} strokeWidth={2} />
          </div>
        )}
        <div className="space-y-2">
          <h1 className="text-[34px] md:text-[48px] font-bold text-[#1C1C1E] tracking-tight leading-tight">
            {title}
          </h1>
          <p className="text-gray-500 text-[17px] md:text-[19px] font-medium max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 shrink-0 mt-8">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPageHeader;
