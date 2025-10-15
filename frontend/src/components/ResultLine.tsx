import { useState } from "react";
import { Results } from "../models/hormoneResult";
import { createPortal } from "react-dom";
import RangeViolationsModal from "./RangeViolationsModal";

interface ResultLineProps {
  result: Results;
}

export default function ResultLine({ result }: ResultLineProps) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <tr key={result.id}>
          <th scope="row">{result.id}</th>
          <td>{result.userId}</td>
          <td>
            {result.hormoneRangeViolations?.length > 0 ? "⚠ NOT IN RANGE" : "✔ IN RANGE"}
          </td>
          <td className="table-actions">
            {result.hormoneRangeViolations?.length > 0 && <span className="more-info" onClick={() => setShowModal(!showModal)}>?</span>}
          </td>
      </tr>
      {showModal && createPortal(<RangeViolationsModal violations={result.hormoneRangeViolations} onClose={() => setShowModal(false)} />, document.body)}
    </>
  )
}