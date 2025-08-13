import { useState } from 'react';
import StatusPill from './StatusPill';
import Modal from './Modal/Modal';

import type { ResultRow, SortDir, SortKey } from '../types';

type Props = {
  rows: ResultRow[];          // includes backend-provided `reasons`
  sortKey: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
};

type AriaSort = 'none' | 'ascending' | 'descending';

export default function ResultsTable({ rows, sortKey, sortDir, onSort }: Props) {
  const [openRowId, setOpenRowId] = useState<number | null>(null);

  const ariaSortFor = (key: SortKey): AriaSort =>
    sortKey !== key ? 'none' : sortDir === 'asc' ? 'ascending' : 'descending';

  const activeRow = rows.find((r) => r.id === openRowId);
  const reasons = activeRow?.reasons ?? [];

  return (
    <>
      <div className='results'>
        <div className='resultsHeader'>
          <button
            className='thButton'
            onClick={() => onSort('id')}
            aria-sort={ariaSortFor('id')}
          >
            result id {sortKey === 'id' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button
            className='thButton'
            onClick={() => onSort('userId')}
            aria-sort={ariaSortFor('userId')}
          >
            user id {sortKey === 'userId' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </button>
          <button
            className='thButton'
            onClick={() => onSort('status')}
            aria-sort={ariaSortFor('status')}
          >
            status {sortKey === 'status' ? (sortDir === 'asc' ? '↑' : '↓') : ''}
          </button>
        </div>

        <div className='resultsList'>
          {rows.length === 0 ? (
            <div className='resultsEmpty'>No results for this filter.</div>
          ) : (
            rows.map((r) => (
              <div className='resultsItem' key={r.id}>
                <p>{r.id}</p>
                <p>{r.userId}</p>
                <p>
                  <StatusPill status={r.status} />
                  {r.status === 'NOT IN RANGE' && (
                    <button
                      style={{ marginLeft: 8 }}
                      onClick={() => setOpenRowId(r.id)}
                    >
                      Why?
                    </button>
                  )}
                </p>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        open={openRowId !== null}
        title={activeRow ? `Why result #${activeRow.id} is not in range` : 'Details'}
        onClose={() => setOpenRowId(null)}
      >
        {reasons.length > 0 ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {reasons.map((rr, i) => (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  padding: '4px 8px',
                  borderRadius: 8,
                  border: '1px solid #e5e7eb',
                  fontSize: 12,
                }}
              >
                {rr.hormone} {rr.direction} ({rr.value} – range {rr.range.min}–{rr.range.max})
              </span>
            ))}
          </div>
        ) : (
          <p>All measured hormones are within expected ranges.</p>
        )}
      </Modal>
    </>
  );
}