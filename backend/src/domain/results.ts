import { Results, HormoneResults } from "../services/results"

export type HormoneStatus = 'IN_RANGE' | 'HIGHER' | 'LOWER'

export type ResultsDto = Results & {
    hormoneResults: (HormoneResults & { status: HormoneStatus })[]
    status: 'IN_RANGE' | 'NOT_IN_RANGE'
}

export const RESULTS_STATUS: Record<'IN_RANGE' | 'NOT_IN_RANGE', 'IN_RANGE' | 'NOT_IN_RANGE'> = {
    IN_RANGE: 'IN_RANGE',
    NOT_IN_RANGE: 'NOT_IN_RANGE'
}

export const HORMONE_STATUS: Record<HormoneStatus, HormoneStatus> = {
    IN_RANGE: 'IN_RANGE',
    HIGHER: 'HIGHER',
    LOWER: 'LOWER'
}
