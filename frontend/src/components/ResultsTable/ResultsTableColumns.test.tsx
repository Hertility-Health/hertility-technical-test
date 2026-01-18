import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ProcessedResult } from "../../types";
import { getColumns } from "./ResultsTableColumns";

const createMockRow = (data: ProcessedResult, isExpanded: boolean = false): any => ({
  original: data,
  getIsExpanded: () => isExpanded,
  getToggleExpandedHandler: () => () => {},
});

const createMockCell = (value: any, row: any, columnId: string): any => ({
  getValue: () => value,
  getContext: () => ({ row, getValue: () => value }),
  column: {
    columnDef: getColumns().find(
      (col) => col.id === columnId || ("accessorKey" in col && col.accessorKey === columnId),
    ),
  },
});

const mockResult: ProcessedResult = {
  id: 123,
  userId: 456,
  status: "IN RANGE",
  hormoneResults: [],
};

describe("ResultsTableColumns", () => {
  it("should return an array of column definitions", () => {
    const columns = getColumns();
    expect(Array.isArray(columns)).toBe(true);
    expect(columns.length).toBe(4);
  });

  it("should have expander column as first column", () => {
    const columns = getColumns();
    expect(columns[0].id).toBe("expander");
  });

  it("should have correct column identifiers", () => {
    const columns = getColumns();

    expect(columns[0].id).toBe("expander");
    const col1 = columns[1];
    expect("accessorKey" in col1 && col1.accessorKey).toBe("id");
    const col2 = columns[2];
    expect("accessorKey" in col2 && col2.accessorKey).toBe("userId");
    const col3 = columns[3];
    expect("accessorKey" in col3 && col3.accessorKey).toBe("status");
  });

  it("should render expand button when row is collapsed", () => {
    const columns = getColumns();
    const expanderColumn = columns[0];
    const mockRow = createMockRow(mockResult, false);

    render(
      <table>
        <tbody>
          <tr>
            <td>
              {expanderColumn.cell && typeof expanderColumn.cell === "function"
                ? expanderColumn.cell({ row: mockRow } as any)
                : null}
            </td>
          </tr>
        </tbody>
      </table>,
    );

    const button = screen.getByRole("button", { name: "Expand row" });
    expect(button).toBeInTheDocument();
  });

  it("should render collapse button when row is expanded", () => {
    const columns = getColumns();
    const expanderColumn = columns[0];
    const mockRow = createMockRow(mockResult, true);

    render(
      <table>
        <tbody>
          <tr>
            <td>
              {expanderColumn.cell && typeof expanderColumn.cell === "function"
                ? expanderColumn.cell({ row: mockRow } as any)
                : null}
            </td>
          </tr>
        </tbody>
      </table>,
    );

    const button = screen.getByRole("button", { name: "Collapse row" });
    expect(button).toBeInTheDocument();
  });

  it("should render ID column with correct value", () => {
    const columns = getColumns();
    const idColumn = columns[1];
    const mockRow = createMockRow(mockResult, false);
    const mockCellInfo = createMockCell(123, mockRow, "id");

    render(
      <table>
        <tbody>
          <tr>
            <td>
              {idColumn.cell && typeof idColumn.cell === "function"
                ? idColumn.cell(mockCellInfo)
                : null}
            </td>
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.getByText("123")).toBeInTheDocument();
  });

  it("should render User ID column with correct value", () => {
    const columns = getColumns();
    const userIdColumn = columns[2];
    const mockRow = createMockRow(mockResult, false);
    const mockCellInfo = createMockCell(456, mockRow, "userId");

    render(
      <table>
        <tbody>
          <tr>
            <td>
              {userIdColumn.cell && typeof userIdColumn.cell === "function"
                ? userIdColumn.cell(mockCellInfo)
                : null}
            </td>
          </tr>
        </tbody>
      </table>,
    );

    expect(screen.getByText("456")).toBeInTheDocument();
  });

  it("should render IN RANGE status with green styling", () => {
    const columns = getColumns();
    const statusColumn = columns[3];
    const mockRow = createMockRow(mockResult, false);
    const mockCellInfo = createMockCell("IN RANGE", mockRow, "status");

    render(
      <table>
        <tbody>
          <tr>
            <td>
              {statusColumn.cell && typeof statusColumn.cell === "function"
                ? statusColumn.cell(mockCellInfo)
                : null}
            </td>
          </tr>
        </tbody>
      </table>,
    );

    const badge = screen.getByText("IN RANGE");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-emerald-50", "text-emerald-700");
  });

  it("should render NOT IN RANGE status with red styling", () => {
    const columns = getColumns();
    const statusColumn = columns[3];
    const notInRangeResult = { ...mockResult, status: "NOT IN RANGE" as const };
    const mockRow = createMockRow(notInRangeResult, false);
    const mockCellInfo = createMockCell("NOT IN RANGE", mockRow, "status");

    render(
      <table>
        <tbody>
          <tr>
            <td>
              {statusColumn.cell && typeof statusColumn.cell === "function"
                ? statusColumn.cell(mockCellInfo)
                : null}
            </td>
          </tr>
        </tbody>
      </table>,
    );

    const badge = screen.getByText("NOT IN RANGE");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-rose-50", "text-rose-700");
  });

  it("should have correct header names", () => {
    const columns = getColumns();

    expect(columns[1].header).toBe("Result ID");
    expect(columns[2].header).toBe("User ID");
    expect(columns[3].header).toBe("Status");
  });

  it("should render expander header as empty div", () => {
    const columns = getColumns();
    const expanderColumn = columns[0];

    const { container } = render(
      <table>
        <thead>
          <tr>
            <th>
              {expanderColumn.header && typeof expanderColumn.header === "function"
                ? expanderColumn.header({} as any)
                : null}
            </th>
          </tr>
        </thead>
      </table>,
    );

    const emptyDiv = container.querySelector(".w-8");
    expect(emptyDiv).toBeInTheDocument();
  });

  it("should apply font-semibold to ID values", () => {
    const columns = getColumns();
    const idColumn = columns[1];
    const mockRow = createMockRow(mockResult, false);
    const mockCellInfo = createMockCell(123, mockRow, "id");

    render(
      <table>
        <tbody>
          <tr>
            <td>
              {idColumn.cell && typeof idColumn.cell === "function"
                ? idColumn.cell(mockCellInfo)
                : null}
            </td>
          </tr>
        </tbody>
      </table>,
    );

    const idElement = screen.getByText("123");
    expect(idElement).toHaveClass("font-semibold", "text-slate-900");
  });

  it("should apply font-semibold to User ID values", () => {
    const columns = getColumns();
    const userIdColumn = columns[2];
    const mockRow = createMockRow(mockResult, false);
    const mockCellInfo = createMockCell(456, mockRow, "userId");

    render(
      <table>
        <tbody>
          <tr>
            <td>
              {userIdColumn.cell && typeof userIdColumn.cell === "function"
                ? userIdColumn.cell(mockCellInfo)
                : null}
            </td>
          </tr>
        </tbody>
      </table>,
    );

    const userIdElement = screen.getByText("456");
    expect(userIdElement).toHaveClass("font-semibold", "text-slate-900");
  });
});
