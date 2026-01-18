import { NextFunction, Request, Response } from "express";
import { getPaginationParams } from "../helpers/pagination";
import { fetchProcessedResults } from "../services/results";

export async function resultsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const paginationOptions = getPaginationParams(req.query);
    const results = await fetchProcessedResults(paginationOptions);
    res.json(results);
  } catch (error) {
    next(error);
  }
}
