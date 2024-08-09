import express from "express";
import { fetchReport } from "../services/report";

export const reportRouter = express.Router();

reportRouter.get("/:id", (req, res) => {

    const reportId = req.params.id;

    const report = fetchReport(reportId);

    if (!report) {
        res.status(404).send("Report not found");
        return;
    }

    res.send(report);
});
