import { HormoneResultData } from "./HormoneResultData";

export type ResultData = {
  id: number;
  userId: number;
  hormoneResults: Array<HormoneResultData>;
  normal?: boolean;
}
