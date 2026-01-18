import { Table } from '@tanstack/react-table';
import { Inbox } from 'lucide-react';
import { ProcessedResult } from '../../types';
import { ResultsTableHeader } from './ResultsTableHeader';
import { ResultsTableRow } from './ResultsTableRow';

interface ResultsTableProps {
  table: Table<ProcessedResult>;
  columnsLength: number;
}

export const ResultsTable = ({ table, columnsLength }: ResultsTableProps) => {
  return (
    <section className="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="w-full overflow-x-auto">
        <table className="min-w-full table-fixed divide-y divide-slate-200">
          <ResultsTableHeader headerGroups={table.getHeaderGroups()} />
          <tbody className="divide-y divide-slate-100">
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columnsLength} className="px-6 py-16 text-center text-slate-500">
                  <div className="flex flex-col items-center gap-3">
                      <Inbox className="h-10 w-10 text-slate-300" aria-hidden="true" />
                    <p className="text-sm font-medium">No results found</p>
                  </div>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <ResultsTableRow key={row.id} row={row} columnsLength={columnsLength} />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};