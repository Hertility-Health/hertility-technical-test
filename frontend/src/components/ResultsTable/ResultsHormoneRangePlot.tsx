import * as Plot from "@observablehq/plot";
import { useEffect, useRef } from "react";
import { ProcessedHormoneResult } from "../../types";
import { HormoneStatusType, statusStyles } from "../../utils/hormone-status";

type ResultsHormoneRangePlotProps = {
  value: ProcessedHormoneResult["value"];
  range: ProcessedHormoneResult["range"];
  status: HormoneStatusType;
};

export const ResultsHormoneRangePlot = ({
  value,
  range,
  status,
}: ResultsHormoneRangePlotProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current || !range) {
      return;
    }

    const hasValue = value !== null && value !== undefined;
    const color = statusStyles[status].color;

    const minDomain = Math.min(range.min, hasValue ? value : range.min);
    const maxDomain = Math.max(range.max, hasValue ? value : range.max);
    const span = maxDomain - minDomain || 1;
    const pad = span * 0.1;

    const plot = Plot.plot({
      height: 60,
      marginTop: 6,
      marginBottom: 6,
      marginLeft: 0,
      marginRight: 0,
      x: {
        domain: [minDomain - pad, maxDomain + pad],
        nice: true,
        label: null,
        axis: "bottom",
        ticks: 4,
      },
      y: { axis: null },
      marks: [
        Plot.barX([{ label: "range", min: range.min, max: range.max }], {
          y: "label",
          x1: "min",
          x2: "max",
          rx: 6,
          inset: 8,
          fill: color,
          fillOpacity: 0.2,
          stroke: color,
          strokeOpacity: 0.4,
        }),
        hasValue
          ? Plot.dot([{ label: "range", value }], {
              y: "label",
              x: "value",
              r: 5.5,
              fill: color,
              stroke: "white",
              strokeWidth: 1,
            })
          : null,
        Plot.ruleX([range.min, range.max], {
          stroke: "#cbd5f5",
          strokeOpacity: 0.5,
        }),
      ].filter(Boolean),
    });

    ref.current.replaceChildren(plot);

    return () => plot.remove();
  }, [value, range, status]);

  if (!range) {
    return null;
  }

  return <div ref={ref} aria-hidden="true" />;
};
