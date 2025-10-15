import React from 'react';
import { HormoneRangeRuleViolation } from "../models/hormoneRange";
import RangeViolationLine from './RangeViolationLine';

interface RangeViolationsModalProps {
  violations: HormoneRangeRuleViolation[];
  onClose: () => void;
}

export default function RangeViolationsModal({ violations, onClose }: RangeViolationsModalProps) {
  const handleModalClose = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault();

    onClose();
  }

  return (
    <div className="modal-wrapper" onClick={handleModalClose}>
      <div className="modal-container" onClick={e => e.stopPropagation()}>
        <div className="modal-header-container">
          <h2>Out of Range Results</h2>
          <span>&#x2715;</span>
        </div>
        <table className="table">
          <tbody>
            {violations.map(violation => 
              <RangeViolationLine 
                violationType={violation.violationType} 
                violationValue={violation.result.value} 
                min={violation.rule.min} 
                max={violation.rule.max} 
                hormoneCode={violation.result.code} 
                units={violation.result.units} 
              />
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}