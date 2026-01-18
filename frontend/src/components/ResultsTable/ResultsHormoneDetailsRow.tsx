import { AlertTriangle, FileSearch } from 'lucide-react';
import { ProcessedHormoneResult } from '../../types';
import { getHormoneStatus, HormoneStatus, statusStyles } from '../../utils/hormone-status';
import { ResultsHormoneRangePlot } from './ResultsHormoneRangePlot';

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
              const status = getHormoneStatus(hormone.value, hormone.isInRange);
              const styles = statusStyles[status];
              const hasData = status !== HormoneStatus.NO_DATA;

              return (
                <div 
                  key={hormone.code} 
                  className={`rounded-lg border p-4 ${styles.container}`}
                >
                  <div className="mb-3 flex items-start justify-between">
                    <div className="text-sm font-semibold text-slate-900">{hormone.code}</div>

                    {status === HormoneStatus.OUT_OF_RANGE && (
                      <div className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${styles.badge}`}>
                        <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                        Needs attention
                      </div>
                    )}

                    {status === HormoneStatus.IN_RANGE && (
                      <div className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-semibold ${styles.badge}`}>
                        Healthy
                      </div>
                    )}
                  </div>

                  {hasData ? (
                    <>
                      <div className="mb-3 flex flex-row items-center justify-start gap-2">
                        <div className="text-2xl font-semibold text-slate-900">{hormone.value}</div>
                        <div className="mt-1 text-xs font-medium text-slate-500">{hormone.units}</div>
                      </div>

                      {hormone.range && (
                        <div className="space-y-2 border-t border-slate-200 pt-3">
                          <div className="text-xs font-semibold uppercase tracking-wide text-slate-900">
                            Expected range
                          </div>
                          <div className="text-sm font-medium text-slate-500">
                            {hormone.range.min} - {hormone.range.max} {hormone.units}
                          </div>
                          <ResultsHormoneRangePlot
                            value={hormone.value}
                            range={hormone.range}
                            status={status}
                          />
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="py-2 text-sm text-slate-400 italic">No data recorded yet.</div>
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