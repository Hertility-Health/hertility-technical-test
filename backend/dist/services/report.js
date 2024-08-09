"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchReport = void 0;
const reports = [
    {
        id: "ABC123",
        firstName: "Jane",
        lastName: "Doe",
        results: [
            {
                hormone: "AMH",
                units: "ng/ml",
                value: 4.8
            },
            {
                hormone: "LH",
                units: "IU/mL",
                value: 7
            },
            {
                hormone: "PROL",
                units: "µg/L",
                value: 4.4
            }
        ]
    }
];
function fetchReport(reportId) {
    return reports.find(report => report.id === reportId);
}
exports.fetchReport = fetchReport;
//# sourceMappingURL=report.js.map