import { classNames } from '../../utils/helpers';

const variants = {
  primary:   'mh-btn',
  secondary: 'mh-bg-tertiary mh-text-primary hover:opacity-80',
  outline:   'mh-btn-outline',
  ghost:     'bg-transparent mh-text-secondary hover:opacity-70',
  danger:    'text-white hover:opacity-90',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon,
  ...props
}) {
  return (
    <button
      className={classNames(
        'inline-flex items-center justify-center gap-2 font-semibold rounded-xl cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.97] transition-all',
        variant === 'danger' && 'bg-[var(--error)]',
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : icon ? (
        <span className="flex-shrink-0">{icon}</span>
      ) : null}
      {children}
    </button>
  );
}
