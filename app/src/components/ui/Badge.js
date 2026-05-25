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
    sky: "bg-ctp-sky-800/[0.08] text-ctp-sky-800 border-ctp-sky-800/20",
    teal: "bg-ctp-teal/[0.08] text-ctp-teal border-ctp-teal/20",
    green: "bg-ctp-green/[0.08] text-ctp-green border-ctp-green/20",
    yellow: "bg-ctp-yellow/[0.08] text-ctp-yellow border-ctp-yellow/20",
    red: "bg-ctp-red/[0.08] text-ctp-red border-ctp-red/20",
    mauve: "bg-ctp-mauve/[0.08] text-ctp-mauve border-ctp-mauve/20",
    slate: "bg-ctp-surface0/50 text-ctp-subtext1 border-ctp-surface1",
    surface: "bg-ctp-surface0 text-ctp-subtext1 border-ctp-surface1",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-ui-tiny font-bold uppercase tracking-ui-caps ${rounded ? 'rounded-full' : 'rounded-md'} ${variants[variant]} ${className}`}>
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}
