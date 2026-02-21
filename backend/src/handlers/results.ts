import { Request, Response } from "express";
import {
  enrichResults,
  fetchResults,
  filterResults,
} from "../services/results";
import { HormoneQueryParams, HormoneRanges } from "../services/types";

type AppLocals = { hormoneRanges: HormoneRanges };
type ResultsRequest = Request<
  Record<string, never>,
  unknown,
  unknown,
  HormoneQueryParams
>;

const parseQueryParams = (query: HormoneQueryParams): HormoneQueryParams =>
  query;

export const resultsHandler = async (req: ResultsRequest, res: Response) => {
  let queryParams = parseQueryParams(req.query);
  const { hormoneRanges } = req.app.locals as AppLocals;

  let results = await fetchResults();

  let enrichedResults = enrichResults(results, hormoneRanges); // find better naming

  let responses = filterResults(enrichedResults, queryParams);

  res.send(responses);
};
