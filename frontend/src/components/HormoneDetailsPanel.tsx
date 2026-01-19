import { HormoneDetail } from "../types";
import { HORMONE_NAMES } from "../constants/hormoneRanges";
import { DECIMAL_PRECISION } from "../constants/formatting";
import "./HormoneDetailsPanel.css";

interface HormoneDetailsPanelProps {
  hormoneDetails: HormoneDetail[];
}

export const HormoneDetailsPanel = ({
  hormoneDetails,
}: HormoneDetailsPanelProps) => {
  return (
    <div className="hormoneDetailsPanel">
      <h4 className="detailsTitle">
        <span aria-hidden="true">📊</span> Hormone Breakdown
      </h4>
      <div className="hormoneGrid" role="list">
        {hormoneDetails.map((detail) => {
          const fullName = HORMONE_NAMES[detail.code] || detail.code;
          const isOutOfRange = detail.status !== "IN RANGE";

          return (
            <div
              key={detail.code}
              className={`hormoneCard ${isOutOfRange ? "outOfRange" : "inRange"}`}
              role="listitem"
              aria-label={`${fullName}, ${detail.status === "IN RANGE" ? "in normal range" : detail.status.toLowerCase()}`}
            >
              <div className="hormoneHeader">
                <div className="hormoneCodeAndName">
                  <span className="hormoneCode">{detail.code}</span>
                  <span className="hormoneFullName">{fullName}</span>
                </div>
                <div className="hormoneStatusBadge">
                  {detail.status === "IN RANGE" && (
                    <span className="statusBadge success">
                      <span aria-hidden="true">✅</span> In Range
                    </span>
                  )}
                  {detail.status === "TOO LOW" && (
                    <span className="statusBadge warning">
                      <span aria-hidden="true">⚠️</span> Too Low
                    </span>
                  )}
                  {detail.status === "TOO HIGH" && (
                    <span className="statusBadge warning">
                      <span aria-hidden="true">⚠️</span> Too High
                    </span>
                  )}
                </div>
              </div>

              <div className="hormoneMetrics">
                <div className="metricRow">
                  <span className="metricLabel">Measured Value:</span>
                  <span className="metricValue">
                    <strong>{detail.value}</strong> {detail.units}
                  </span>
                </div>

                {detail.status !== "NO RANGE" && (
                  <div className="metricRow">
                    <span className="metricLabel">Normal Range:</span>
                    <span className="metricValue">
                      {detail.range.min} - {detail.range.max} {detail.units}
                    </span>
                  </div>
                )}
              </div>

              {isOutOfRange && detail.status !== "NO RANGE" && (
                <div className="alertMessage" role="alert">
                  {detail.status === "TOO LOW" &&
                    `Value is ${(detail.range.min - detail.value).toFixed(DECIMAL_PRECISION)} ${detail.units} below normal range`}
                  {detail.status === "TOO HIGH" &&
                    `Value is ${(detail.value - detail.range.max).toFixed(DECIMAL_PRECISION)} ${detail.units} above normal range`}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
