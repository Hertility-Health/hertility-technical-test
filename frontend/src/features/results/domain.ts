export type HormoneResultsStatus = 'IN_RANGE' | 'HIGHER' | 'LOWER'

export interface HormoneResults {
    code: string;
    units: string;
    value: number;
    status: HormoneResultsStatus
}

export type ResultsStatus = 'IN_RANGE' | 'NOT_IN_RANGE'

export interface Results {
    id: number;
    userId: number;
    hormoneResults: Array<HormoneResults>;
    status: ResultsStatus
}

export const PRETTY_STATUS: Record<HormoneResultsStatus | ResultsStatus, string> = {
    'IN_RANGE': 'In range',
    'NOT_IN_RANGE': 'Not in range',
    'HIGHER': 'Higher than normal',
    'LOWER': 'Lower than normal'
}

export const ResultFilter = {
    All: 'ALL',
    InRange: 'IN_RANGE',
    NotInRange: 'NOT_IN_RANGE',
} as const;

export type ResultFilterType = typeof ResultFilter[keyof typeof ResultFilter];