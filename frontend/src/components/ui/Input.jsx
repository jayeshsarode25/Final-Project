import { classNames } from '../../utils/helpers';

export default function Input({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium mb-1.5 mh-text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 mh-text-tertiary pointer-events-none">
            {icon}
          </span>
        )}
        <input
          id={id}
          className={classNames(
            'mh-input w-full px-4 py-2.5 text-sm',
            icon && 'pl-10',
            error && '!border-[var(--error)]',
            className
          )}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1 text-xs" style={{ color: 'var(--error)' }}>{error}</p>
      )}
    </div>
  );
}
