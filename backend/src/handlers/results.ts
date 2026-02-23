import { Request, Response } from "express";
import { fetchNormalRanges, fetchResults } from "../services/results";

export const resultsHandler = async (_req: Request, res: Response) => {
    const results = await fetchResults();

    res.send(results);
};

export const normalRangesHandler = async (_req: Request, res: Response) => {
    const normalRanges = await fetchNormalRanges();
    
    res.send(normalRanges);
}