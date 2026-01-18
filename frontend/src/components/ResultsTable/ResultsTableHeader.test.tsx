import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProcessedResult } from "../../types";
import { ResultsTableHeader } from "./ResultsTableHeader";

const mockData: ProcessedResult[] = [
  {
    id: 1,
    userId: 101,
    status: "IN RANGE",
    hormoneResults: [],
  },
];

const createColumns = (): ColumnDef<ProcessedResult>[] => [
  {
    id: "expander",
    header: () => <div className="w-8"></div>,
  },
  {
    accessorKey: "id",
    header: "Result ID",
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

const HeaderWrapper = ({ columns }: { columns: ColumnDef<ProcessedResult>[] }) => {
  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <table>
      <ResultsTableHeader headerGroups={table.getHeaderGroups()} />
    </table>
  );
};

describe("ResultsTableHeader", () => {
  it("should render thead element", () => {
    const columns = createColumns();
    const { container } = render(<HeaderWrapper columns={columns} />);

    const thead = container.querySelector("thead");
    expect(thead).toBeInTheDocument();
  });

  it("should render all column headers", () => {
    const columns = createColumns();
    render(<HeaderWrapper columns={columns} />);

    expect(screen.getByText("Result ID")).toBeInTheDocument();
    expect(screen.getByText("User ID")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();
  });

  it("should render correct number of header cells", () => {
    const columns = createColumns();
    const { container } = render(<HeaderWrapper columns={columns} />);

    const headerCells = container.querySelectorAll("th");
    expect(headerCells).toHaveLength(4);
  });

  it("should apply correct styling to thead", () => {
    const columns = createColumns();
    const { container } = render(<HeaderWrapper columns={columns} />);

    const thead = container.querySelector("thead");
    expect(thead).toHaveClass("bg-slate-50");
  });

  it("should apply correct styling to th elements", () => {
    const columns = createColumns();
    const { container } = render(<HeaderWrapper columns={columns} />);

    const headerCell = screen.getByText("Result ID").closest("th");
    expect(headerCell).toHaveClass("px-6", "py-3", "text-center", "uppercase", "font-semibold");
  });

  it("should set scope attribute for accessibility", () => {
    const columns = createColumns();
    const { container } = render(<HeaderWrapper columns={columns} />);

    const headerCells = container.querySelectorAll("th");
    headerCells.forEach((cell) => {
      expect(cell).toHaveAttribute("scope", "col");
    });
  });

  it("should handle placeholder headers", () => {
    const columnsWithPlaceholder: ColumnDef<ProcessedResult>[] = [
      {
        id: "placeholder",
        header: "This should not render",
      },
    ];

    const { container } = render(<HeaderWrapper columns={columnsWithPlaceholder} />);

    const headerCells = container.querySelectorAll("th");
    expect(headerCells.length).toBeGreaterThan(0);
  });

  it("should render custom header component from expander column", () => {
    const columns = createColumns();
    const { container } = render(<HeaderWrapper columns={columns} />);

    const emptyDiv = container.querySelector(".w-8");
    expect(emptyDiv).toBeInTheDocument();
  });

  it("should render headers in correct order", () => {
    const columns = createColumns();
    const { container } = render(<HeaderWrapper columns={columns} />);

    const headerCells = Array.from(container.querySelectorAll("th"));
    const headerTexts = headerCells.map((cell) => cell.textContent);

    expect(headerTexts[1]).toBe("Result ID");
    expect(headerTexts[2]).toBe("User ID");
    expect(headerTexts[3]).toBe("Status");
  });

  it("should handle multiple header groups", () => {
    const columns = createColumns();
    const { container } = render(<HeaderWrapper columns={columns} />);

    const rows = container.querySelectorAll("thead tr");
    expect(rows.length).toBeGreaterThan(0);
  });

  it("should render header with string value", () => {
    const simpleColumns: ColumnDef<ProcessedResult>[] = [
      {
        accessorKey: "id",
        header: "Simple Header",
      },
    ];

    render(<HeaderWrapper columns={simpleColumns} />);

    expect(screen.getByText("Simple Header")).toBeInTheDocument();
  });

  it("should apply uppercase transformation to text", () => {
    const columns = createColumns();
    const { container } = render(<HeaderWrapper columns={columns} />);

    const headerCell = screen.getByText("Result ID").closest("th");
    expect(headerCell).toHaveClass("uppercase");
  });

  it("should center align header text", () => {
    const columns = createColumns();
    const { container } = render(<HeaderWrapper columns={columns} />);

    const headerCell = screen.getByText("Result ID").closest("th");
    expect(headerCell).toHaveClass("text-center");
  });
});
