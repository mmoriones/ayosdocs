'use client';

export default function Label({ children, htmlFor, className = '', ...props }) {
  return (
    <label htmlFor={htmlFor} className={className} {...props}>
      {children}
    </label>
  );
}
