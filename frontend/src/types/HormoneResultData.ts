export type HormoneResultData = {
  code: string;
  units: string;
  value: number;
  range?: 'ABOVE' | 'BELOW' | 'NORMAL';
}