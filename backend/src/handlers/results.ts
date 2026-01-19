import { Request, Response } from "express";
import { fetchResults } from "../services/results";

export const resultsHandler = (_req: Request, res: Response) => {
    const results = fetchResults();

    res.send(results);
};
