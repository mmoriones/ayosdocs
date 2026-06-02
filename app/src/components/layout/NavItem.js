'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Tooltip } from '@/components/ui';

/**
 * Responsive navigation link for the sidebar.
 * Automatically detects active state based on current pathname and
 * supports collapsed/expanded visual modes.
 * 
 * @param {Object} props
 * @param {string} props.href - Destination path.
 * @param {import('lucide-react').LucideIcon} props.icon - Icon to display.
 * @param {string} props.label - Text label (hidden in collapsed mode).
 * @param {boolean} props.collapsed - Whether the parent sidebar is collapsed.
 * @param {boolean} [props.active] - Forced active state (optional).
 * @param {Function} [props.onClick] - Click handler for mobile menu closing.
 */
export default function NavItem({ href, icon: Icon, label, collapsed, active, onClick }) {
  const pathname = usePathname();
  const isActive = active ?? (href === '/' ? pathname === '/' : pathname.startsWith(href));

  const content = (
    <Link
      href={href}
      onClick={onClick}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 group active:scale-[0.96] ${
        isActive
          ? 'bg-brand-blue/15 text-brand-blue shadow-sm shadow-brand-blue/5'
          : 'text-ctp-subtext1 hover:bg-brand-blue/8 hover:text-ctp-text'
      }`}
    >
      <div className={`shrink-0 transition-all duration-300 ${isActive ? 'text-brand-blue scale-110' : 'text-ctp-subtext0 group-hover:text-ctp-text'}`}>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      
      {!collapsed && (
        <span className={`text-sm tracking-tight transition-all duration-300 whitespace-nowrap ${
          isActive ? 'text-brand-blue font-bold' : 'font-medium'
        }`}>
          {label}
        </span>
      )}
    </Link>
  );

  if (collapsed) {
    return (
      <Tooltip content={label} position="right" delay={100}>
        {content}
      </Tooltip>
    );
  }

  return content;
}
