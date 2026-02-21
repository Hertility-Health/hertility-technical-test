import { Request, Response } from "express";
import {
  enrichResults,
  fetchResults,
  filterResults,
} from "../services/results";
import { HormoneQueryParams, HormoneRanges } from "../services/types";

type ResultsRequest = Request<
  Record<string, never>,
  unknown,
  unknown,
  HormoneQueryParams
>;

const parseQueryParams = (params: ResultsRequest) => {
  return params.query;
};

export const resultsHandler = async (req: ResultsRequest, res: Response) => {
  let queryParams = parseQueryParams(req);

  const ranges: HormoneRanges = req.app.locals.hormoneRanges; // check undefined

  let results = await fetchResults();

  let enrichedResults = enrichResults(results, ranges); // find better naming

  let responses = filterResults(enrichedResults, queryParams);

  res.send(responses);
};
