import { Request, Response } from "express";
import { fetchResults } from "../services/results";
import { calculateStatus } from "../services/results";

export const resultsHandler = async (_req: Request, res: Response) => {
    try{
        const results =await fetchResults();
        const resultWithStatus=results.map((result)=>({
            ...result,
            status:calculateStatus(result),
        }));
        res.send(resultWithStatus);
    }catch(error){
        console.error(error);
        res.status(500).send({message: "Something went wrong"});
    }
};
