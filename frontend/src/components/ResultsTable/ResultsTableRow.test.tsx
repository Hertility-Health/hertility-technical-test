import {
  ColumnDef,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ProcessedResult } from "../../types";
import { ResultsTableRow } from "./ResultsTableRow";

vi.mock("./ResultsHormoneDetailsRow", () => ({
  ResultsHormoneDetailsRow: ({
    hormoneResults,
    colSpan,
  }: {
    hormoneResults: unknown[];
    colSpan: number;
  }) => (
    <tr data-testid="hormone-details-row">
      <td colSpan={colSpan}>Hormone Details: {hormoneResults.length} hormones</td>
    </tr>
  ),
}));

const mockResult: ProcessedResult = {
  id: 1,
  userId: 101,
  status: "IN RANGE",
  hormoneResults: [
    {
      code: "TSH",
      units: "mIU/L",
      value: 2.5,
      isInRange: true,
      range: { min: 0.5, max: 5.0 },
    },
    {
      code: "E2",
      units: "pg/mL",
      value: 50,
      isInRange: true,
      range: { min: 20, max: 100 },
    },
  ],
};

const createTestColumns = (): ColumnDef<ProcessedResult>[] => [
  {
    id: "expander",
    header: "Expand",
    cell: ({ row }) => (
      <button
        onClick={row.getToggleExpandedHandler()}
        aria-label={row.getIsExpanded() ? "Collapse row" : "Expand row"}
      >
        {row.getIsExpanded() ? "▼" : "▶"}
      </button>
    ),
  },
  {
    accessorKey: "id",
    header: "ID",
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: (info) => info.getValue(),
  },
];

const TestWrapper = ({
  data,
  columns,
  initialExpanded = {},
}: {
  data: ProcessedResult[];
  columns: ColumnDef<ProcessedResult>[];
  initialExpanded?: Record<string, boolean>;
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    state: {
      expanded: initialExpanded,
    },
  });

  const row = table.getRowModel().rows[0];

  return (
    <table>
      <tbody>
        <ResultsTableRow row={row} columnsLength={columns.length} />
      </tbody>
    </table>
  );
};

describe("ResultsTableRow", () => {
  it("should render table cells with data", () => {
    const columns = createTestColumns();

    render(<TestWrapper data={[mockResult]} columns={columns} />);

    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("IN RANGE")).toBeInTheDocument();
  });

  it("should render expander button in collapsed state by default", () => {
    const columns = createTestColumns();

    render(<TestWrapper data={[mockResult]} columns={columns} />);

    const expandButton = screen.getByRole("button", { name: "Expand row" });
    expect(expandButton).toBeInTheDocument();
    expect(expandButton).toHaveTextContent("▶");
  });

  it("should not show hormone details row when collapsed", () => {
    const columns = createTestColumns();

    render(<TestWrapper data={[mockResult]} columns={columns} />);

    expect(screen.queryByTestId("hormone-details-row")).not.toBeInTheDocument();
  });

  it("should show hormone details row when expanded", () => {
    const columns = createTestColumns();

    render(<TestWrapper data={[mockResult]} columns={columns} initialExpanded={{ "0": true }} />);

    expect(screen.getByTestId("hormone-details-row")).toBeInTheDocument();
    expect(screen.getByText(/Hormone Details: 2 hormones/)).toBeInTheDocument();
  });

  it("should toggle expanded state when expander button is clicked", async () => {
    const user = userEvent.setup();
    const columns = createTestColumns();

    const { rerender } = render(<TestWrapper data={[mockResult]} columns={columns} />);

    expect(screen.queryByTestId("hormone-details-row")).not.toBeInTheDocument();

    const expandButton = screen.getByRole("button", { name: "Expand row" });
    await user.click(expandButton);

    rerender(<TestWrapper data={[mockResult]} columns={columns} initialExpanded={{ "0": true }} />);

    expect(screen.getByTestId("hormone-details-row")).toBeInTheDocument();
  });

  it("should show collapse button when expanded", () => {
    const columns = createTestColumns();

    render(<TestWrapper data={[mockResult]} columns={columns} initialExpanded={{ "0": true }} />);

    const collapseButton = screen.getByRole("button", { name: "Collapse row" });
    expect(collapseButton).toBeInTheDocument();
    expect(collapseButton).toHaveTextContent("▼");
  });

  it("should render correct number of cells", () => {
    const columns = createTestColumns();

    render(<TestWrapper data={[mockResult]} columns={columns} />);

    const cells = screen.getAllByRole("cell");
    expect(cells).toHaveLength(columns.length);
  });

  it("should pass hormone results to details row", () => {
    const columns = createTestColumns();

    render(<TestWrapper data={[mockResult]} columns={columns} initialExpanded={{ "0": true }} />);

    expect(screen.getByText(/2 hormones/)).toBeInTheDocument();
  });

  it("should pass correct colSpan to details row", () => {
    const columns = createTestColumns();

    render(<TestWrapper data={[mockResult]} columns={columns} initialExpanded={{ "0": true }} />);

    const detailsRow = screen.getByTestId("hormone-details-row");
    const td = detailsRow.querySelector("td");
    expect(td).toHaveAttribute("colSpan", columns.length.toString());
  });

  it("should apply hover styles to main row", () => {
    const columns = createTestColumns();

    render(<TestWrapper data={[mockResult]} columns={columns} />);

    const row = screen.getByRole("row");
    expect(row).toHaveClass("hover:bg-slate-50");
  });

  it("should handle result with different status", () => {
    const notInRangeResult: ProcessedResult = {
      ...mockResult,
      status: "NOT IN RANGE",
    };
    const columns = createTestColumns();

    render(<TestWrapper data={[notInRangeResult]} columns={columns} />);

    expect(screen.getByText("NOT IN RANGE")).toBeInTheDocument();
  });
});
