import express from "express";
import { resultsHandler, detailedViewHandler } from "../handlers/results";

export const resultsRouter = express.Router();

resultsRouter.get("", resultsHandler);
resultsRouter.post("", detailedViewHandler)
