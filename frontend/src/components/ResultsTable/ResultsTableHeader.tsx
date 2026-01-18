import { flexRender, HeaderGroup } from '@tanstack/react-table';
import { ProcessedResult } from '../../types';

interface ResultsTableHeaderProps {
  headerGroups: HeaderGroup<ProcessedResult>[];
}

export const ResultsTableHeader = ({ headerGroups }: ResultsTableHeaderProps) => {
  return (
    <thead className="bg-slate-50">
      {headerGroups.map((headerGroup) => (
        <tr key={headerGroup.id}>
          {headerGroup.headers.map((header) => (
            <th
              key={header.id}
              scope="col"
              className="px-6 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-600"
            >
              {header.isPlaceholder
                ? null
                : flexRender(header.column.columnDef.header, header.getContext())}
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );
};