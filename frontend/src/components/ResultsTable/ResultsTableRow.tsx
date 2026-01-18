import { flexRender, Row } from '@tanstack/react-table';
import { ProcessedResult } from '../../types';
import { ResultsHormoneDetailsRow } from './ResultsHormoneDetailsRow';

interface ResultsTableRowProps {
  row: Row<ProcessedResult>;
  columnsLength: number;
}

export const ResultsTableRow = ({ row, columnsLength }: ResultsTableRowProps) => {
  return (
    <>
      <tr className="border-b border-slate-100 hover:bg-slate-50" role="row">
        {row.getVisibleCells().map((cell) => (
          <td
            key={cell.id}
            className="px-6 py-4 text-center text-sm font-medium text-slate-700"
            role="cell"
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </td>
        ))}
      </tr>
      {row.getIsExpanded() && (
        <ResultsHormoneDetailsRow hormoneResults={row.original.hormoneResults} colSpan={columnsLength} />
      )}
    </>
  );
};