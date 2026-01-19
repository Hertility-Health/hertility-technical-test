import { HormoneCode, HormoneResults } from "../consts/hormones";

export const getHormoneValue = (
  hormoneResults: HormoneResults[],
  code: HormoneCode
) => {
  return hormoneResults.find((h) => h.code === code)?.value ?? "—";
};
