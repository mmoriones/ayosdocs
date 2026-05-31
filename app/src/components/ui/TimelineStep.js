import { Check } from 'lucide-react';

/**
 * TimelineStep Component
 * A reusable container for steps in a vertical timeline (Workflow/Tracker).
 * 
 * @param {Object} props
 * @param {number|string} props.indicator - The number or content to show in the circle.
 * @param {boolean} props.isCompleted - Whether the step is finished.
 * @param {boolean} props.isCurrent - Whether the step is the active one.
 * @param {boolean} props.isLocked - Whether the step is inaccessible.
 * @param {boolean} props.isLast - Whether this is the final step (removes bottom line).
 * @param {React.ReactNode} props.children - The content to render inside the card.
 * @param {string} [props.className] - Additional classes for the outer container.
 * @param {string} [props.cardClassName] - Additional classes for the card container.
 */
export default function TimelineStep({
  indicator,
  isCompleted,
  isCurrent,
  isLocked,
  isLast,
  children,
  className = "",
  cardClassName = ""
}) {
  return (
    <div className={`relative pl-12 pb-12 group ${className}`}>
      {/* DASHED VERTICAL LINE */}
      {!isLast && (
        <div className={`absolute left-[19px] top-10 bottom-0 w-0.5 border-l-2 border-dashed transition-colors duration-500
          ${isCompleted ? 'border-brand-blue' : 'border-ctp-surface1'}
        `} />
      )}
      
      {/* INDICATOR (NUMBER/CHECK) */}
      <div className={`absolute left-0 top-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 z-10 border-2
        ${isCompleted 
          ? 'bg-brand-blue border-brand-blue text-white shadow-lg shadow-brand-blue/20' : 
          isCurrent 
            ? 'bg-white border-brand-blue text-brand-blue shadow-md' : 
            'bg-ctp-surface0 text-ctp-subtext0 border-ctp-surface1'}
      `}>
        {isCompleted ? (
          <Check size={20} strokeWidth={4} />
        ) : (
          <span className="text-[15px] font-black">{indicator}</span>
        )}
      </div>

      {/* CARD CONTAINER */}
      <div className={`bg-white/70 backdrop-blur-md rounded-[28px] p-6 border transition-all duration-300
        ${isCurrent ? 'border-brand-blue/30 shadow-[0_8px_32px_rgba(0,56,168,0.06)]' : 'border-white/40 shadow-sm'}
        ${isLocked && !isCurrent ? 'opacity-60 grayscale select-none' : 'opacity-100'}
        ${cardClassName}
      `}>
        {children}
      </div>
    </div>
  );
}
