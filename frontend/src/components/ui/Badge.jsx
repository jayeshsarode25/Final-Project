const colorMap = {
  default: { bg: 'var(--bg-badge)', text: 'var(--text-secondary)' },
  success: { bg: 'var(--success-light)', text: 'var(--success)' },
  warning: { bg: 'var(--warning-light)', text: 'var(--warning)' },
  error:   { bg: 'var(--error-light)',   text: 'var(--error)' },
  info:    { bg: 'var(--accent-subtle)', text: 'var(--accent)' },
};

export default function Badge({ children, color = 'default', className = '' }) {
  const c = colorMap[color] || colorMap.default;

  return (
    <span
      className={`mh-badge ${className}`}
      style={{ backgroundColor: c.bg, color: c.text }}
    >
      {children}
    </span>
  );
}
