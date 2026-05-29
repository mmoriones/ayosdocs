/**
 * Reusable Badge component for status labels, categories, and small highlights.
 * 
 * @param {Object} props
 * @param {'sky' | 'teal' | 'green' | 'yellow' | 'red' | 'mauve' | 'slate' | 'surface'} props.variant - The color theme of the badge.
 * @param {React.ReactNode} props.children - The content of the badge.
 * @param {import('lucide-react').LucideIcon} [props.icon] - Optional icon.
 * @param {boolean} [props.rounded=false] - Whether to use full rounded corners.
 * @param {string} [props.className] - Additional CSS classes.
 */
export default function Badge({ 
  variant = 'sky', 
  children, 
  icon: Icon, 
  rounded = false,
  className = "" 
}) {
  const variants = {
    sky: "bg-[#0038A8]/10 text-[#0038A8] border-[#0038A8]/10",
    green: "bg-[#34C759]/10 text-[#34C759] border-[#34C759]/10",
    yellow: "bg-[#FFCC00]/10 text-[#FF9500] border-[#FFCC00]/10",
    red: "bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/10",
    purple: "bg-[#AF52DE]/10 text-[#AF52DE] border-[#AF52DE]/10",
    gray: "bg-gray-100 text-gray-500 border-gray-200",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 border text-[11px] font-bold ${rounded ? 'rounded-full' : 'rounded-[8px]'} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
