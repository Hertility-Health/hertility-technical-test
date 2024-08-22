import express from "express";
import { resultsHandler } from "../handlers/results";

export const resultsRouter = express.Router();

resultsRouter.get("", resultsHandler);
