'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Sidebar navigation link.
 * 
 * @param {Object} props
 * @param {string} props.href
 * @param {import('lucide-react').LucideIcon} props.icon
 * @param {string} props.label
 * @param {boolean} props.collapsed
 * @param {boolean} [props.active]
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
        <span className="text-sm truncate">{label}</span>
      )}
    </Link>
  );
}
