import express from "express";
import { normalRangesHandler, resultsHandler } from "../handlers/results";

export const resultsRouter = express.Router();

resultsRouter.get("", resultsHandler);

export const normalRangesRouter = express.Router();

normalRangesRouter.get("", normalRangesHandler);