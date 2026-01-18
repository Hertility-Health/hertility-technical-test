type PaginationProps = {
  pagination: { page: number; totalPages: number };
  onPageChange: (page: number) => void;
};

export function Pagination({ pagination, onPageChange }: PaginationProps) {
  const { page, totalPages } = pagination;

  const btnBase = 'h-9 rounded-lg px-4 text-sm font-semibold transition shadow-sm';
  const btnIdle = 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:shadow';
  const btnDisabled = 'disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <nav className="flex items-center justify-center gap-3" aria-label="Pagination">
      <button
        className={`${btnBase} ${btnIdle} ${btnDisabled}`}
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
      >
        Previous
      </button>

      <span className="text-sm font-medium text-slate-700">
        Page <span className="text-slate-900">{page}</span> of{' '}
        <span className="text-slate-900">{totalPages}</span>
      </span>

      <button
        className={`${btnBase} ${btnIdle} ${btnDisabled}`}
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
      >
        Next
      </button>
    </nav>
  );
}