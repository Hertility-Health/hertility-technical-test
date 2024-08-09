interface HormoneResult {
    hormone: string;
    units: string;
    value: number;
}

interface Report {
    id: string;
    firstName: string;
    lastName: string;
    results: HormoneResult[];
}

const reports: Array<Report> = [
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
]

export function fetchReport(reportId: string) {
    return reports.find(report => report.id === reportId);
}