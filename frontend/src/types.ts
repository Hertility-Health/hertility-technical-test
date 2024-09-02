export interface HormoneResults {
  code: string;
  units: string;
  value: number;
  withinRange: boolean;
}

export interface Results {
  id: number;
  userId: number;
  hormoneResults: Array<HormoneResults>;
  status: string;
}

export enum FilterOptions {
  notInRange = 'not_in_range',
  inRange = 'in_range',
  all = 'all'
}