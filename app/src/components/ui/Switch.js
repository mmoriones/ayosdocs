'use client';

/**
 * Reusable Switch/Toggle component.
 *
 * @param {Object} props
 * @param {boolean} props.checked - Current toggle state.
 * @param {Function} props.onChange - Callback when toggled.
 * @param {boolean} [props.disabled=false]
 * @param {string} [props.label] - Optional label text.
 * @param {string} [props.description] - Optional description text.
 * @param {string} [props.className='']
 */
export default function Switch({
  checked = false,
  onChange,
  disabled = false,
  label,
  description,
  className = '',
}) {
  return (
    <label className={`flex items-center gap-3 cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}>
      <button
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange?.(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ctp-sky-800/20 ${
          checked ? 'bg-ctp-sky-800' : 'bg-ctp-surface1'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transform ring-0 transition-transform duration-200 ease-in-out ${
            checked ? 'translate-x-4' : 'translate-x-0'
          }`}
        />
      </button>
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <span className="text-sm font-semibold text-ctp-text">{label}</span>
          )}
          {description && (
            <span className="text-ui-micro font-medium text-ctp-subtext0">{description}</span>
          )}
        </div>
      )}
    </label>
  );
}
