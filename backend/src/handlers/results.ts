import { Request, Response } from "express";
import { fetchResults } from "../services/results.service";

export const resultsHandler = async (_req: Request, res: Response) => {
    const results = await fetchResults(); // put all business logic in service layer

    res.send(results);
};
