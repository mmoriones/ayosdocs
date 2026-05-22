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
    sky: "bg-ctp-sky-800/5 text-ctp-sky-800 border-ctp-sky-800/20",
    teal: "bg-ctp-teal/5 text-ctp-teal border-ctp-teal/20",
    green: "bg-ctp-green/5 text-ctp-green border-ctp-green/20",
    yellow: "bg-ctp-yellow/5 text-ctp-yellow border-ctp-yellow/20",
    red: "bg-ctp-red/5 text-ctp-red border-ctp-red/20",
    mauve: "bg-ctp-mauve/5 text-ctp-mauve border-ctp-mauve/20",
    slate: "bg-ctp-surface0/30 text-ctp-subtext1 border-ctp-surface1",
    surface: "bg-ctp-surface0 text-ctp-subtext1 border-ctp-surface1",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[9px] font-bold uppercase tracking-widest ${rounded ? 'rounded-full' : 'rounded'} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={10} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
