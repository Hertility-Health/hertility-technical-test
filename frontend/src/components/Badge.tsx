import clsx from 'clsx';

export function Badge({ label, className }: { label: string; className?: string }) {
  return (
    <span
      className={clsx(
        className,
        'inline-flex items-center rounded-md  px-2 py-1 text-xs font-medium',
      )}
    >
      {label}
    </span>
  );
}
