import { ColumnDef } from "@tanstack/react-table";
import { ChevronRight, ChevronUp } from "lucide-react";
import { ProcessedResult } from "../../types";

export const getColumns = (): ColumnDef<ProcessedResult>[] => [
  {
    id: "expander",
    header: () => <div className="w-8"></div>,
    cell: ({ row }) => (
      <button
        onClick={row.getToggleExpandedHandler()}
        className="mx-auto flex h-8 w-8 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900"
        aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
      >
        {row.getIsExpanded() ? (
          <ChevronUp className="h-5 w-5 rotate-180" aria-hidden="true" />
        ) : (
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        )}
      </button>
    ),
  },
  {
    accessorKey: "id",
    header: "Result ID",
    cell: (info) => (
      <span className="font-semibold text-slate-900">
        {info.getValue() as number}
      </span>
    ),
  },
  {
    accessorKey: "userId",
    header: "User ID",
    cell: (info) => (
      <span className="font-semibold text-slate-900">
        {info.getValue() as number}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as string;
      return (
        <span
          className={`mx-auto inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${
            status === "IN RANGE"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-rose-50 text-rose-700"
          }`}
        >
          {status}
        </span>
      );
    },
  },
];
