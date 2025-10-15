interface RangeViolationLineProps {
  violationValue: number;
  violationType: "MIN" | "MAX";
  units: string;
  min: number;
  max: number;
  hormoneCode: string;
}

export default function RangeViolationLine({ violationValue, violationType, units, min, max, hormoneCode }: RangeViolationLineProps) {
  return (
    <tr>
      <td className="violation-cell">
        {violationType === "MIN" &&
          <div className="violation-cell-content">
            <span className="violation-value violation-highlight"><span>{violationValue}</span> <span className="violation-label">{units}</span></span>
            <span className="violation-label">Your</span>
            <span className="violation-label">value</span>
          </div>
        }
      </td>
      <td className="violation-cell">
        <div className="violation-cell-content">
          <span className="violation-value"><span>{min}</span> <span className="violation-label">{units}</span></span>
          <span className="violation-label">Ideal</span>
          <span className="violation-label">min.</span>
        </div>
      </td>
      <th scope="row" className="violation-cell">{hormoneCode}</th>
      <td className="violation-cell">
        <div className="violation-cell-content">
          <span className="violation-value"><span>{max}</span> <span className="violation-label">{units}</span></span>
          <span className="violation-label">Ideal</span>
          <span className="violation-label">max.</span>
        </div>
      </td>
      <td className="violation-cell">
        {violationType === "MAX" &&
          <div className="violation-cell-content">
            <span className="violation-value violation-highlight"><span>{violationValue}</span> <span className="violation-label">{units}</span></span>
            <span className="violation-label">Your</span>
            <span className="violation-label">value</span>
          </div>
        }
      </td>
    </tr>
  )
}