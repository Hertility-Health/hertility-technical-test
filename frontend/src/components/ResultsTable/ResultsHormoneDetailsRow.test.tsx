import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { ProcessedHormoneResult } from "../../types";
import { ResultsHormoneDetailsRow } from "./ResultsHormoneDetailsRow";

vi.mock("./ResultsHormoneRangePlot", () => ({
  ResultsHormoneRangePlot: ({
    value,
    range,
    status,
  }: {
    value: number;
    range: { min: number; max: number };
    status: string;
  }) => (
    <div data-testid="hormone-range-plot">
      Plot: {value} in range {range.min}-{range.max} ({status})
    </div>
  ),
}));

const createHormoneResult = (
  overrides?: Partial<ProcessedHormoneResult>,
): ProcessedHormoneResult => ({
  code: "TSH",
  units: "mIU/L",
  value: 2.5,
  isInRange: true,
  range: { min: 0.5, max: 5.0 },
  ...overrides,
});

describe("ResultsHormoneDetailsRow", () => {
  it("should render with hormone data", () => {
    const hormoneResults = [createHormoneResult()];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Detailed Hormone Analysis")).toBeInTheDocument();
    expect(screen.getByText("TSH")).toBeInTheDocument();
  });

  it("should apply correct colspan to the table cell", () => {
    const hormoneResults = [createHormoneResult()];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={5} />
        </tbody>
      </table>,
    );

    const td = screen.getByText("Detailed Hormone Analysis").closest("td");
    expect(td).toHaveAttribute("colSpan", "5");
  });

  it("should display hormone value and units for IN_RANGE status", () => {
    const hormoneResults = [createHormoneResult({ code: "E2", value: 50, units: "pg/mL" })];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    expect(screen.getByText("E2")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("pg/mL")).toBeInTheDocument();
    expect(screen.getByText("Healthy")).toBeInTheDocument();
  });

  it("should display 'Needs attention' badge for OUT_OF_RANGE status", () => {
    const hormoneResults = [createHormoneResult({ value: 10, isInRange: false })];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Needs attention")).toBeInTheDocument();
    expect(screen.queryByText("Healthy")).not.toBeInTheDocument();
  });

  it("should display 'No data recorded yet' for NO_DATA status", () => {
    const hormoneResults = [createHormoneResult({ value: 0 })];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    expect(screen.getByText("No data recorded yet.")).toBeInTheDocument();
    expect(screen.queryByText("Healthy")).not.toBeInTheDocument();
    expect(screen.queryByText("Needs attention")).not.toBeInTheDocument();
  });

  it("should not display value section when status is NO_DATA", () => {
    const hormoneResults = [createHormoneResult({ value: 0 })];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    expect(screen.getByText("TSH")).toBeInTheDocument();
    expect(screen.queryByText("mIU/L")).not.toBeInTheDocument();
    expect(screen.queryByText("Expected range")).not.toBeInTheDocument();
  });

  it("should display expected range when range data is available", () => {
    const hormoneResults = [
      createHormoneResult({
        value: 2.5,
        range: { min: 0.5, max: 5.0 },
        units: "mIU/L",
      }),
    ];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Expected range")).toBeInTheDocument();
    expect(screen.getByText("0.5 - 5 mIU/L")).toBeInTheDocument();
  });

  it("should render hormone range plot when data exists", () => {
    const hormoneResults = [createHormoneResult({ value: 2.5, range: { min: 0.5, max: 5.0 } })];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    expect(screen.getByTestId("hormone-range-plot")).toBeInTheDocument();
    expect(screen.getByText(/Plot: 2.5 in range 0.5-5/)).toBeInTheDocument();
  });

  it("should not render range plot when status is NO_DATA", () => {
    const hormoneResults = [createHormoneResult({ value: 0 })];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    expect(screen.queryByTestId("hormone-range-plot")).not.toBeInTheDocument();
  });

  it("should render multiple hormone results", () => {
    const hormoneResults = [
      createHormoneResult({ code: "TSH", value: 2.5 }),
      createHormoneResult({ code: "E2", value: 50, units: "pg/mL" }),
      createHormoneResult({ code: "LH", value: 8, units: "mIU/L" }),
    ];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    expect(screen.getByText("TSH")).toBeInTheDocument();
    expect(screen.getByText("E2")).toBeInTheDocument();
    expect(screen.getByText("LH")).toBeInTheDocument();
  });

  it("should apply correct styling for IN_RANGE status", () => {
    const hormoneResults = [createHormoneResult({ isInRange: true })];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    const hormoneCode = screen.getByText("TSH");
    const hormoneCard = hormoneCode.parentElement?.parentElement;
    expect(hormoneCard).toHaveClass("border-green-200", "bg-green-50");
  });

  it("should apply correct styling for OUT_OF_RANGE status", () => {
    const hormoneResults = [createHormoneResult({ isInRange: false })];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    const hormoneCode = screen.getByText("TSH");
    const hormoneCard = hormoneCode.parentElement?.parentElement;
    expect(hormoneCard).toHaveClass("border-orange-200", "bg-orange-50");
  });

  it("should apply correct styling for NO_DATA status", () => {
    const hormoneResults = [createHormoneResult({ value: 0 })];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    const hormoneCode = screen.getByText("TSH");
    const hormoneCard = hormoneCode.parentElement?.parentElement;
    expect(hormoneCard).toHaveClass("border-slate-200", "bg-slate-50");
  });

  it("should handle hormone without range data", () => {
    const hormoneResults = [createHormoneResult({ value: 2.5, range: null, isInRange: null })];

    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    expect(screen.getByText("TSH")).toBeInTheDocument();
    expect(screen.getByText("2.5")).toBeInTheDocument();
    expect(screen.queryByText("Expected range")).not.toBeInTheDocument();
    expect(screen.queryByTestId("hormone-range-plot")).not.toBeInTheDocument();
  });

  it("should display AlertTriangle icon for OUT_OF_RANGE status", () => {
    const hormoneResults = [createHormoneResult({ isInRange: false })];

    const { container } = render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={hormoneResults} colSpan={3} />
        </tbody>
      </table>,
    );

    const alertIcon = container.querySelector('[aria-hidden="true"]');
    expect(alertIcon).toBeInTheDocument();
  });

  it("should handle empty hormone results array", () => {
    render(
      <table>
        <tbody>
          <ResultsHormoneDetailsRow hormoneResults={[]} colSpan={3} />
        </tbody>
      </table>,
    );

    expect(screen.getByText("Detailed Hormone Analysis")).toBeInTheDocument();
    expect(screen.queryByText("TSH")).not.toBeInTheDocument();
  });
});
