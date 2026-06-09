/**
 * Standardized Card component for containers and sections.
 * 
 * @param {Object} props
 * @param {'base' | 'mantle' | 'crust'} [props.background='base']
 * @param {string} [props.title]
 * @param {React.ReactNode} [props.headerAction]
 * @param {React.ReactNode} [props.footer]
 * @param {boolean} [props.noPadding=false]
 * @param {boolean} [props.interactive=false] - Whether to apply hover effects.
 */
export default function Card({
  children,
  background = 'base',
  title,
  headerAction,
  footer,
  noPadding = false,
  interactive = false,
  className = '',
  headerClassName = '',
  footerClassName = '',
  overflow = 'hidden',
  ...props
}) {
  const backgrounds = {
    base: 'bg-white',
    mantle: 'bg-gray-50/50',
    crust: 'bg-[#F2F2F7]'
  };
  const bgStyles = backgrounds[background] || backgrounds.base;
  const overflowClass = overflow === 'hidden' ? 'overflow-hidden' : 'overflow-visible';
  const interactiveStyles = (interactive || props.onClick) 
    ? 'cursor-pointer hover:border-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] border-white/50 relative after:absolute after:inset-0 after:bg-black/5 after:opacity-0 after:transition-opacity active:after:opacity-100 after:pointer-events-none' 
    : 'border-white/50 shadow-[0_4px_20px_rgba(0,0,0,0.02)]';
  
  return (
    <div 
      className={`rounded-[28px] lg:rounded-[32px] border ${overflowClass} ${bgStyles} ${interactiveStyles} ${className}`}
      {...props}
    >
      {title && (
        <div className={`px-6 py-5 border-b border-gray-100 flex items-center justify-between ${headerClassName}`}>
          <h2 className="text-[17px] font-bold tracking-tight text-[#1C1C1E]">{title}</h2>
          {headerAction && <div className="animate-in fade-in duration-300">{headerAction}</div>}
        </div>
      )}

      {noPadding ? children : (
        <div className="p-5 md:p-6">
          {children}
        </div>
      )}

      {footer && (
        <div className={`px-6 py-4 bg-gray-50/30 border-t border-gray-100 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
