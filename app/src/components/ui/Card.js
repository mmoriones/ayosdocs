'use client';

/**
 * Standardized Card component for containers and sections.
 * 
 * @param {Object} props
 * @param {'base' | 'mantle'} [props.background='base']
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
    base: 'bg-ctp-base',
    mantle: 'bg-ctp-mantle/50',
    crust: 'bg-ctp-crust/50'
  };
  const bgStyles = backgrounds[background] || backgrounds.base;
  const overflowClass = overflow === 'hidden' ? 'overflow-hidden' : 'overflow-visible';
  const interactiveStyles = (interactive || props.onClick) 
    ? 'cursor-pointer hover:border-ctp-sky-800/30 hover:shadow-md hover:bg-ctp-mantle/50 transition-all active:scale-[0.99]' 
    : '';
  
  return (
    <div 
      className={`rounded-xl border border-ctp-surface1 shadow-sm transition-all ${overflowClass} ${bgStyles} ${interactiveStyles} ${className}`}
      {...props}
    >
      {title && (
        <div className={`px-6 py-4 border-b border-ctp-surface1 flex items-center justify-between bg-ctp-mantle/50 ${headerClassName}`}>
          <h2 className="text-sm font-bold tracking-tight text-ctp-text uppercase tracking-widest">{title}</h2>
          {headerAction && <div className="animate-in fade-in duration-300">{headerAction}</div>}
        </div>
      )}

      {noPadding ? children : (
        <div className="p-5 md:p-6">
          {children}
        </div>
      )}

      {footer && (
        <div className={`px-6 py-4 bg-ctp-mantle/50 border-t border-ctp-surface1 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
