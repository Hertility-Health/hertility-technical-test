import { FileSearch, OctagonAlert } from 'lucide-react';
import { ProcessedHormoneResult } from '../../types';

interface HormoneDetailsRowProps {
  hormoneResults: ProcessedHormoneResult[];
  colSpan: number;
}

export const ResultsHormoneDetailsRow = ({ hormoneResults, colSpan }: HormoneDetailsRowProps) => {
  return (
    <tr className="bg-slate-50">
      <td colSpan={colSpan} className="px-6 py-6">
        <div className="space-y-5">
          <div className="flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-slate-400" aria-hidden="true" />
            <h3 className="text-base font-semibold text-slate-900">Detailed Hormone Analysis</h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {hormoneResults.map((hormone) => {
              console.log(hormone);
              const isOutOfRange = hormone.isInRange === false && hormone.value !== null;
              const hasData = !!hormone.value;

              return (
                <div
                  key={hormone.code}
                  className={`rounded-lg border p-4 ${
                    isOutOfRange
                      ? 'border-orange-200 bg-orange-50'
                      : hasData
                      ? 'border-green-200 bg-green-50'
                      : 'border-slate-100 bg-slate-50'
                  }`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="text-sm font-semibold text-slate-900">{hormone.code}</div>
                    {isOutOfRange && (
                      <div className="inline-flex items-center text-orange-800 gap-1.5 rounded-md bg-orange-200 border-orange-200 px-2 py-1 text-xs font-bold">
                        <OctagonAlert className="h-3.5 w-3.5" aria-hidden="true" />
                        Out of Range
                      </div>
                    )}
                  </div>

                  {hasData ? (
                    <>
                      <div className="mb-3">
                        <div className="text-2xl font-semibold text-slate-900">{hormone.value}</div>
                        <div className="mt-1 text-xs font-medium text-slate-500">{hormone.units}</div>
                      </div>

                      {hormone.range && (
                        <div className="border-t border-slate-200 pt-3">
                          <div className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            Normal Range
                          </div>
                          <div className="text-sm font-medium text-slate-700">
                            {hormone.range.min} - {hormone.range.max}
                          </div>
                        </div>
                      )}


                    </>
                  ) : (
                    <div className="py-2 text-sm text-slate-400 italic">No data available</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </td>
    </tr>
  );
};