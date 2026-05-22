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
 */
export default function Card({
  children,
  background = 'base',
  title,
  headerAction,
  footer,
  noPadding = false,
  className = '',
  headerClassName = '',
  footerClassName = '',
  overflow = 'hidden',
  ...props
}) {
  const bgStyles = background === 'mantle' ? 'bg-ctp-mantle' : 'bg-ctp-base';
  const overflowClass = overflow === 'hidden' ? 'overflow-hidden' : 'overflow-visible';
  
  return (
    <div 
      className={`rounded-2xl border border-ctp-surface1 shadow-sm ${overflowClass} ${bgStyles} ${className}`}
      {...props}
    >
      {title && (
        <div className={`px-6 py-4 border-b border-ctp-surface1 flex items-center justify-between ${headerClassName}`}>
          <h2 className="text-lg font-bold tracking-tight text-ctp-text">{title}</h2>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}

      <div className={noPadding ? '' : 'p-6 md:p-8'}>
        {children}
      </div>

      {footer && (
        <div className={`px-6 py-4 bg-ctp-mantle/30 border-t border-ctp-surface1 ${footerClassName}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
