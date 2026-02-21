import { Results } from '../types';
import { AnomalyPopover, HormoneResultsPopover } from './Popover';
import { Badge } from './Badge';

type ResultsTableProps = {
  results: Array<Results>;
};

export default function ResultsTable({ results }: ResultsTableProps) {
  return (
    <div className="">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="relative min-w-full divide-y divide-gray-300 dark:divide-white/15 border-[0.5px] border-collapse rounded-sm">
              <thead className="border-b border-gray-200">
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pr-3 pl-4 text-center text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Result id
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 "
                  >
                    User id
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 "
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 "
                  >
                    Anomalies
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900 "
                  >
                    Hormone results
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white 0">
                {results.map((result) => (
                  <tr key={result.id}>
                    <td className="py-2 pr-3  text-sm whitespace-nowrap sm:pl-0 text-center pl-2 ">
                      <div className="font-medium pl-4 ">{result.id}</div>
                    </td>
                    <td className=" py-2 text-sm whitespace-nowrap pl-4 ">{result.userId}</td>
                    <td className=" py-2 text-sm whitespace-nowrap  pl-4">
                      <Badge
                        label={result.inRange ? 'In Range' : 'Out of range'}
                        className={
                          result.inRange
                            ? 'w-24 justify-center bg-green-700 text-white inset-ring-green-600/20'
                            : 'w-24 justify-center bg-red-500 text-white inset-ring-red-600/20'
                        }
                      />
                    </td>
                    <td className=" py-2 text-sm whitespace-nowrap pl-4 ">
                      {!result.inRange ? (
                        <AnomalyPopover anomalies={result.anomalies} />
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-2 text-sm whitespace-nowrap pl-4">
                      <HormoneResultsPopover hormoneResults={result.hormoneResults} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
