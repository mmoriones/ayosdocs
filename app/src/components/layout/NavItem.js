'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
        isActive
          ? 'bg-ctp-sky-800/10 text-ctp-sky-800 font-semibold'
          : 'text-ctp-subtext1 hover:bg-ctp-mantle hover:text-ctp-text'
      }`}
    >
      <div className={`shrink-0 ${isActive ? 'text-ctp-sky-800' : 'text-ctp-subtext0 group-hover:text-ctp-text'}`}>
        <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
      </div>
      {!collapsed && (
        <span className={`text-sm truncate transition-all duration-300 whitespace-nowrap ${
          collapsed ? 'opacity-0 w-0' : 'opacity-100 w-auto'
        }`}>
          {label}
        </span>
      )}
    </Link>
  );
}
