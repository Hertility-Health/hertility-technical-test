import { Request, Response } from "express";
import { fetchResults } from "../services/results";

export const resultsHandler = async (_req: Request, res: Response) => {
    const results = await fetchResults();

    res.send(results);
};
