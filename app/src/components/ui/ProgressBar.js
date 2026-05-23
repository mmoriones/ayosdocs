/**
 * Reusable ProgressBar component for tracking completion.
 *
 * @param {Object} props
 * @param {number} props.value - Current progress value (0-100).
 * @param {string} [props.size='md'] - 'sm' | 'md' | 'lg'
 * @param {'sky' | 'green' | 'teal' | 'yellow'} [props.color='sky'] - Color variant.
 * @param {boolean} [props.showLabel=false] - Show percentage text.
 * @param {string} [props.className=''] - Additional CSS classes.
 */
export default function ProgressBar({
  value = 0,
  size = 'md',
  color = 'sky',
  showLabel = false,
  className = '',
}) {
  const clampedValue = Math.min(100, Math.max(0, value));

  const sizes = {
    xs: 'h-0.5',
    sm: 'h-1',
    md: 'h-1.5',
    lg: 'h-2.5',
  };

  const colors = {
    sky: 'bg-ctp-sky-800',
    green: 'bg-ctp-green',
    teal: 'bg-ctp-teal',
    yellow: 'bg-ctp-yellow',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`flex-1 bg-ctp-surface0 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${sizes[size]} ${colors[color]} rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(32,159,181,0.2)]`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[9px] font-bold text-ctp-subtext1 uppercase tracking-[0.15em] shrink-0">
          {Math.round(clampedValue)}%
        </span>
      )}
    </div>
  );
}
