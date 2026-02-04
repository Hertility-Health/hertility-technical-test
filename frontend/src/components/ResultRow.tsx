import { FC, useState } from "react";
import { Results } from "../types/Results";

interface ResultRowProps {
    result: Results
}

const prettyPrintStatus = (status: string | undefined) => {
  switch (status) {
    case "IN_RANGE":
      return "In Range";
    case "NOT_IN_RANGE":
      return "Not In Range";
    default:
      return "Unknown";
  }
}

interface ExpandButtonProps {
    isExpanded: boolean
    onExpandedChanged: () => void
}

const ExpandButton: FC<ExpandButtonProps> = ({isExpanded, onExpandedChanged}) => {
    return <div style={styles.expand} onClick={onExpandedChanged}>{isExpanded ? "\u23f6" : "\u23f7"}</div>
}

export const ResultRow: FC<ResultRowProps> = ({result}) => {
    const [isExpanded, setIsExpanded] = useState<boolean>(false)

    return (<div className="resultsItem" key={result.id}>
        <div className="topRow">
            <p>{result.id}</p>
            <p>{result.userId}</p>
            <p>{prettyPrintStatus(result.status)}</p>
            <ExpandButton isExpanded={isExpanded} onExpandedChanged={() => setIsExpanded(!isExpanded)} />
            </div>
        {isExpanded && 
            <div style={styles.details}>
                {result.status === "IN_RANGE" && <>{"\u2705 All hormone test results in range"}</>}
                {result.status === "NOT_IN_RANGE" && result.hormoneResults.filter(h => h.status === "NOT_IN_RANGE").map(h => 
                <div>
                    {`\u26a0\ufe0f ${h.code} out of range (${h.value} ${h.units})`}
                </div>)}
            </div>
        }
    </div>)
}

const styles = {
    expand: {
        padding: 10,
        cursor: 'pointer'
    },
    details: {
        width: '100%',
        display: 'flex',
        alignItems: 'start',
        flexDirection: 'column' as const,
        marginLeft: 20,
        padding: 10
    }
}