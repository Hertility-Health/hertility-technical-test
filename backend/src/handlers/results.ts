import { Request, Response } from "express";
import { fetchResults } from "../services/results";
import { calculateStatus } from "../utils/hormoneCalculations";

export const resultsHandler = async (_req: Request, res: Response) => {
    const results = await fetchResults();

    const resultsWithStatus = results.map(result => {
        const { status, explanations } = calculateStatus(result.hormoneResults);
        return {
            ...result,
            status,
            explanations
        };
    });
    res.send(resultsWithStatus);
};
