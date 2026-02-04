import { Request, Response } from "express";
import { fetchResults, ResultStatus } from "../services/results";

export const resultsHandler = async (_req: Request, res: Response) => {
    const results = await fetchResults(_req.query?.status as ResultStatus | undefined);

    res.send(results);
};
