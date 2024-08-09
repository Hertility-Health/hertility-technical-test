"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reportRouter = void 0;
const express_1 = __importDefault(require("express"));
const report_1 = require("../services/report");
exports.reportRouter = express_1.default.Router();
exports.reportRouter.get("/:id", (req, res) => {
    const reportId = req.params.id;
    const report = (0, report_1.fetchReport)(reportId);
    if (!report) {
        res.status(404).send("Report not found");
        return;
    }
    res.send(report);
});
//# sourceMappingURL=report.js.map