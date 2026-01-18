import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProcessedResult } from "../../types";
import { ResultsTable } from "./ResultsTable";

vi.mock("./ResultsTableHeader", () => ({
  ResultsTableHeader: () => (
    <thead data-testid="table-header">
      <tr>
        <th>Mocked Header</th>
      </tr>
    </thead>
  ),
}));

vi.mock("./ResultsTableRow", () => ({
  ResultsTableRow: ({ row }: any) => (
    <tr data-testid={`table-row-${row.id}`}>
      <td>Row {row.original.id}</td>
    </tr>
  ),
}));

const mockData: ProcessedResult[] = [
  {
    id: 1,
    userId: 101,
    status: "IN RANGE",
    hormoneResults: [],
  },
  {
    id: 2,
    userId: 102,
    status: "NOT IN RANGE",
    hormoneResults: [],
  },
];

const createColumns = (): ColumnDef<ProcessedResult>[] => [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "userId",
    header: "User ID",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
];

const TableWrapper = ({
  data,
  columns,
}: {
  data: ProcessedResult[];
  columns: ColumnDef<ProcessedResult>[];
}) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return <ResultsTable table={table} columnsLength={columns.length} />;
};

describe("ResultsTable", () => {
  it("should render table with data", () => {
    const columns = createColumns();

    render(<TableWrapper data={mockData} columns={columns} />);

    expect(screen.getByTestId("table-header")).toBeInTheDocument();
    expect(screen.getByTestId("table-row-0")).toBeInTheDocument();
    expect(screen.getByTestId("table-row-1")).toBeInTheDocument();
  });

  it("should render multiple rows", () => {
    const columns = createColumns();

    render(<TableWrapper data={mockData} columns={columns} />);

    expect(screen.getByText("Row 1")).toBeInTheDocument();
    expect(screen.getByText("Row 2")).toBeInTheDocument();
  });

  it("should render empty state when no data", () => {
    const columns = createColumns();

    render(<TableWrapper data={[]} columns={columns} />);

    expect(screen.getByText("No results found")).toBeInTheDocument();
  });

  it("should display Inbox icon in empty state", () => {
    const columns = createColumns();

    const { container } = render(<TableWrapper data={[]} columns={columns} />);

    const icon = container.querySelector('[aria-hidden="true"]');
    expect(icon).toBeInTheDocument();
  });

  it("should span empty state across all columns", () => {
    const columns = createColumns();

    render(<TableWrapper data={[]} columns={columns} />);

    const emptyCell = screen.getByText("No results found").closest("td") as HTMLTableCellElement;
    expect(emptyCell).toHaveAttribute("colSpan", columns.length.toString());
  });

  it("should not render empty state when data exists", () => {
    const columns = createColumns();

    render(<TableWrapper data={mockData} columns={columns} />);

    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
  });

  it("should apply correct styling classes", () => {
    const columns = createColumns();

    const { container } = render(<TableWrapper data={mockData} columns={columns} />);

    const section = container.querySelector("section");
    expect(section).toHaveClass("rounded-lg", "border", "bg-white");

    const table = container.querySelector("table");
    expect(table).toHaveClass("min-w-full", "table-fixed");
  });

  it("should render table in scrollable container", () => {
    const columns = createColumns();

    const { container } = render(<TableWrapper data={mockData} columns={columns} />);

    const scrollContainer = container.querySelector(".overflow-x-auto");
    expect(scrollContainer).toBeInTheDocument();
  });

  it("should pass correct props to ResultsTableHeader", () => {
    const columns = createColumns();

    render(<TableWrapper data={mockData} columns={columns} />);

    expect(screen.getByTestId("table-header")).toBeInTheDocument();
  });

  it("should pass correct props to ResultsTableRow", () => {
    const columns = createColumns();

    render(<TableWrapper data={mockData} columns={columns} />);

    expect(screen.getByTestId("table-row-0")).toBeInTheDocument();
    expect(screen.getByTestId("table-row-1")).toBeInTheDocument();
  });

  it("should handle single row", () => {
    const columns = createColumns();
    const singleRow = [mockData[0]];

    render(<TableWrapper data={singleRow} columns={columns} />);

    expect(screen.getByTestId("table-row-0")).toBeInTheDocument();
    expect(screen.queryByTestId("table-row-1")).not.toBeInTheDocument();
  });

  it("should render with correct columnsLength prop", () => {
    const columns = createColumns();

    render(<TableWrapper data={[]} columns={columns} />);

    const emptyCell = screen.getByText("No results found").closest("td") as HTMLTableCellElement;
    expect(emptyCell.colSpan).toBe(3);
  });
});
