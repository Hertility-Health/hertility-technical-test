import { Request, Response } from "express";
import { getResultsWithStatus } from "../services/results";

export const resultsHandler = async (_req: Request, res: Response) => {
    const resultsWithStatus = await getResultsWithStatus();
    res.send(resultsWithStatus);
};
