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
  iconClassName = "text-[#0038A8]"
}) => {
  return (
    <div className={`w-full pt-12 lg:pt-16 ${className}`}>
      <div className="max-w-5xl mx-auto px-6 lg:px-10 pb-8 lg:pb-12 flex flex-col items-center text-center">
        {Icon && (
          <div className="mb-8 w-20 h-20 rounded-[24px] lg:rounded-[28px] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.04)] border border-white/60 flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-tr from-[#0038A8]/5 to-transparent opacity-50" />
            <Icon className={`${iconClassName} relative z-10 group-hover:scale-110 transition-transform duration-500`} size={36} strokeWidth={2.5} />
          </div>
        )}
        <div className="space-y-3">
          <h1 className="text-[34px] md:text-[48px] font-bold text-[#1C1C1E] tracking-tight leading-[1.1]">
            {title}
          </h1>
          <p className="text-gray-500 text-[16px] md:text-[18px] font-medium max-w-xl mx-auto leading-relaxed">
            {description}
          </p>
        </div>

        {actions && (
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 shrink-0 mt-8 lg:mt-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicPageHeader;
