'use client';

export default function Checkbox({ id, checked = false, onCheckedChange, className = '', ...props }) {
  return (
    <input
      type="checkbox"
      id={id}
      checked={checked}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      className={`w-4 h-4 rounded border-ctp-surface1 text-ctp-sky-800 focus:ring-ctp-sky-800/20 focus:ring-2 bg-ctp-base ${className}`}
      {...props}
    />
  );
}
