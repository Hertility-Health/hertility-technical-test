import { Results } from "@/types";
import React from "react";

import { ChevronsUpDown } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type Props = {
  result: Results;
};

export default function Result({ result }: Props) {
  const [isOpen, setIsOpen] = React.useState(false);
  const hasOutOfRangeData = result.hormoneResults.some(
    (hormone) => !hormone.withinRange
  );
  const outOfRangeData = result.hormoneResults.filter(
    (hormone) => !hormone.withinRange
  );
  return (
    <div className="flex flex-col w-full ">
      <Collapsible open={isOpen}>
        <div className="flex items-center justify-between w-full bg-med p-4 rounded-md">
          <div className="flex-1 flex justify-between items-center gap-4 self-start uppercase">
            <p className="w-1/4">{result.id}</p>
            <p className="w-1/4">{result.userId}</p>
            <div className="w-2/4 flex justify-end">
              <p>{result.status}</p>
              {hasOutOfRangeData && (
                <CollapsibleTrigger asChild>
                  <button className="ml-1" onClick={() => setIsOpen(!isOpen)}>
                    <ChevronsUpDown className="h-4 w-4" />
                    <span className="sr-only">Toggle</span>
                  </button>
                </CollapsibleTrigger>
              )}
            </div>
          </div>
        </div>

        <CollapsibleContent>
          <div className="bg-white p-4 rounded-b-md">
            {outOfRangeData.map((data) => {
              return (
                <div>
                  <div className="flex gap-4 justify-between px-10">
                    <p>{data.code}</p>
                    <p>
                      {data.value} {data.units}
                      {}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
