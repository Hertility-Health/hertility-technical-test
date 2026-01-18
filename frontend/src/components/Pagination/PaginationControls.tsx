import { PaginationMeta } from '../../types';
import { calculatePaginationRange } from '../../utils/pagination';

interface PaginationControlsProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export const PaginationControls = ({ pagination, onPageChange }: PaginationControlsProps) => {
  const { startPage, endPage } = calculatePaginationRange(pagination.page, pagination.totalPages);
  const buttons = [];

  const btnBase = 'min-w-[2.5rem] h-9 rounded-lg text-sm font-semibold transition shadow-sm';
  const btnIdle = 'border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 hover:shadow';
  const btnActive = 'border border-slate-900 bg-slate-900 text-white shadow';
  const ellipsis = 'px-2 text-slate-400';

  if (startPage > 1) {
    buttons.push(
      <button key={1} onClick={() => onPageChange(1)} className={`${btnBase} ${btnIdle}`}>
        1
      </button>
    );
    if (startPage > 2) {
      buttons.push(
        <span key="ellipsis-start" className={ellipsis}>
          •••
        </span>
      );
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const isCurrent = pagination.page === i;
    buttons.push(
      <button
        key={i}
        onClick={() => onPageChange(i)}
        aria-current={isCurrent ? 'page' : undefined}
        className={`${btnBase} ${isCurrent ? btnActive : btnIdle}`}
      >
        {i}
      </button>
    );
  }

  if (endPage < pagination.totalPages) {
    if (endPage < pagination.totalPages - 1) {
      buttons.push(
        <span key="ellipsis-end" className={ellipsis}>
          •••
        </span>
      );
    }
    buttons.push(
      <button
        key={pagination.totalPages}
        onClick={() => onPageChange(pagination.totalPages)}
        className={`${btnBase} ${btnIdle}`}
      >
        {pagination.totalPages}
      </button>
    );
  }

  return <>{buttons}</>;
};