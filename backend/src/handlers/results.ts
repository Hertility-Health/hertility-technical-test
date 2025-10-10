import { Request, Response } from "express";
import { checkAllDeterminationsDetailedView } from "../services/determinations";
import { fetchResults } from "../services/results";

export const resultsHandler = async (_req: Request, res: Response) => {
    const results = await fetchResults();

    res.send(results);
};

export const detailedViewHandler = async (_req: Request, res: Response) => {
    if(_req.body.constructor === Object && Object.keys(_req.body).length === 0) {
        console.log('No body found, unable to get detailed view');
        res.send([])
    }else{
        const results = await checkAllDeterminationsDetailedView(_req.body);
        // res.json(results);
        res.send(results);
    }
    
    
};

