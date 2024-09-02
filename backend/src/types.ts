export interface HormoneRange {
  min: number;
  max: number;
}

export interface Hormone {
  [key: string]: HormoneRange;
}

export interface HormoneResults {
    code: string;
    units: string;
    value: number;
}

export interface Results {
	id: number;
    userId: number;
    hormoneResults: Array<HormoneResults>;
    status?: string
}