import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { PageControls } from "./PageControls";

const createMockPagination = () => ({
  limit: 10,
  total: 100,
  page: 1,
  totalPages: 10,
});

describe("PageControls", () => {
  it("should render all sections", () => {
    const onLimitChange = vi.fn();
    const onStatusFilterChange = vi.fn();

    render(
      <PageControls
        pagination={createMockPagination()}
        onLimitChange={onLimitChange}
        resultsCount={10}
        statusFilter={undefined}
        onStatusFilterChange={onStatusFilterChange}
      />,
    );

    expect(screen.getByLabelText("Results per page")).toBeInTheDocument();
    expect(screen.getByLabelText("Filter by Status:")).toBeInTheDocument();
    expect(screen.getByText(/Showing/)).toBeInTheDocument();
  });

  it("should display correct results count text", () => {
    const onLimitChange = vi.fn();
    const onStatusFilterChange = vi.fn();

    render(
      <PageControls
        pagination={createMockPagination()}
        onLimitChange={onLimitChange}
        resultsCount={10}
        statusFilter={undefined}
        onStatusFilterChange={onStatusFilterChange}
      />,
    );

    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 10 of 100 results");
  });

  it("should display all limit options", () => {
    const onLimitChange = vi.fn();
    const onStatusFilterChange = vi.fn();

    render(
      <PageControls
        pagination={createMockPagination()}
        onLimitChange={onLimitChange}
        resultsCount={10}
        statusFilter={undefined}
        onStatusFilterChange={onStatusFilterChange}
      />,
    );

    const limitSelect = screen.getByLabelText("Results per page");
    const options = Array.from(limitSelect.querySelectorAll("option"));

    expect(options).toHaveLength(4);
    expect(options.map((o) => o.textContent)).toEqual(["5", "10", "20", "50"]);
  });

  it("should show current limit as selected", () => {
    const onLimitChange = vi.fn();
    const onStatusFilterChange = vi.fn();

    render(
      <PageControls
        pagination={{ ...createMockPagination(), limit: 20 }}
        onLimitChange={onLimitChange}
        resultsCount={20}
        statusFilter={undefined}
        onStatusFilterChange={onStatusFilterChange}
      />,
    );

    const limitSelect = screen.getByLabelText("Results per page") as HTMLSelectElement;
    expect(limitSelect.value).toBe("20");
  });

  it("should call onLimitChange when limit is changed", async () => {
    const user = userEvent.setup();
    const onLimitChange = vi.fn();
    const onStatusFilterChange = vi.fn();

    render(
      <PageControls
        pagination={createMockPagination()}
        onLimitChange={onLimitChange}
        resultsCount={10}
        statusFilter={undefined}
        onStatusFilterChange={onStatusFilterChange}
      />,
    );

    const limitSelect = screen.getByLabelText("Results per page");
    await user.selectOptions(limitSelect, "20");

    expect(onLimitChange).toHaveBeenCalledWith(20);
    expect(onLimitChange).toHaveBeenCalledTimes(1);
  });

  it("should pass statusFilter to StatusFilter component", () => {
    const onLimitChange = vi.fn();
    const onStatusFilterChange = vi.fn();

    render(
      <PageControls
        pagination={createMockPagination()}
        onLimitChange={onLimitChange}
        resultsCount={10}
        statusFilter={true}
        onStatusFilterChange={onStatusFilterChange}
      />,
    );

    const statusSelect = screen.getByLabelText("Filter by Status:") as HTMLSelectElement;
    expect(statusSelect.value).toBe("1");
  });

  it("should call onStatusFilterChange when status filter changes", async () => {
    const user = userEvent.setup();
    const onLimitChange = vi.fn();
    const onStatusFilterChange = vi.fn();

    render(
      <PageControls
        pagination={createMockPagination()}
        onLimitChange={onLimitChange}
        resultsCount={10}
        statusFilter={undefined}
        onStatusFilterChange={onStatusFilterChange}
      />,
    );

    const statusSelect = screen.getByLabelText("Filter by Status:");
    await user.selectOptions(statusSelect, "1");

    expect(onStatusFilterChange).toHaveBeenCalledWith(true);
    expect(onStatusFilterChange).toHaveBeenCalledTimes(1);
  });

  it("should handle different results counts", () => {
    const onLimitChange = vi.fn();
    const onStatusFilterChange = vi.fn();

    const { rerender } = render(
      <PageControls
        pagination={createMockPagination()}
        onLimitChange={onLimitChange}
        resultsCount={5}
        statusFilter={undefined}
        onStatusFilterChange={onStatusFilterChange}
      />,
    );

    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 5 of 100 results");

    rerender(
      <PageControls
        pagination={createMockPagination()}
        onLimitChange={onLimitChange}
        resultsCount={50}
        statusFilter={undefined}
        onStatusFilterChange={onStatusFilterChange}
      />,
    );

    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 50 of 100 results");
  });

  it("should handle different total counts", () => {
    const onLimitChange = vi.fn();
    const onStatusFilterChange = vi.fn();

    render(
      <PageControls
        pagination={{ ...createMockPagination(), total: 250 }}
        onLimitChange={onLimitChange}
        resultsCount={10}
        statusFilter={undefined}
        onStatusFilterChange={onStatusFilterChange}
      />,
    );

    expect(screen.getByText("250")).toBeInTheDocument();
    expect(screen.getByText(/Showing/)).toHaveTextContent("Showing 10 of 250 results");
  });

  it("should allow changing both limit and status filter independently", async () => {
    const user = userEvent.setup();
    const onLimitChange = vi.fn();
    const onStatusFilterChange = vi.fn();

    render(
      <PageControls
        pagination={createMockPagination()}
        onLimitChange={onLimitChange}
        resultsCount={10}
        statusFilter={undefined}
        onStatusFilterChange={onStatusFilterChange}
      />,
    );

    const limitSelect = screen.getByLabelText("Results per page");
    await user.selectOptions(limitSelect, "50");
    expect(onLimitChange).toHaveBeenCalledWith(50);

    const statusSelect = screen.getByLabelText("Filter by Status:");
    await user.selectOptions(statusSelect, "0");
    expect(onStatusFilterChange).toHaveBeenCalledWith(false);

    expect(onLimitChange).toHaveBeenCalledTimes(1);
    expect(onStatusFilterChange).toHaveBeenCalledTimes(1);
  });
});
