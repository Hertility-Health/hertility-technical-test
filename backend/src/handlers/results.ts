import { Request, Response } from "express";
import { getResultsWithStatus } from "../services/resultsService";

export const resultsHandler = async (_req: Request, res: Response) => {
    const results = await getResultsWithStatus();

    res.send(results);
};
