import { classNames } from '../../utils/helpers';

export default function Card({
  children,
  className = '',
  hover = true,
  padding = true,
  onClick,
  ...props
}) {
  return (
    <div
      className={classNames(
        'mh-card',
        hover && 'hover:mh-shadow-lg',
        onClick && 'cursor-pointer',
        padding && 'p-5',
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
