import { HormoneResults } from "./hormones";

export interface Results {
  id: number;
  userId: number;
  hormoneResults: HormoneResults[];
}
