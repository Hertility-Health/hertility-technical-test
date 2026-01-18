import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { PaginationMeta } from "../../types";
import { PaginationControls } from "./PaginationControls";

const createMockPagination = (overrides?: Partial<PaginationMeta>): PaginationMeta => ({
  page: 1,
  limit: 10,
  total: 100,
  totalPages: 10,
  ...overrides,
});

describe("PaginationControls", () => {
  it("should render page buttons", () => {
    const pagination = createMockPagination();
    const onPageChange = vi.fn();

    render(<PaginationControls pagination={pagination} onPageChange={onPageChange} />);

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
  });

  it("should highlight current page", () => {
    const pagination = createMockPagination({ page: 3 });
    const onPageChange = vi.fn();

    render(<PaginationControls pagination={pagination} onPageChange={onPageChange} />);

    const currentButton = screen.getByRole("button", { name: "3" });
    expect(currentButton).toHaveAttribute("aria-current", "page");
    expect(currentButton).toHaveClass("bg-slate-900");
  });

  it("should call onPageChange when a page button is clicked", async () => {
    const user = userEvent.setup();
    const pagination = createMockPagination();
    const onPageChange = vi.fn();

    render(<PaginationControls pagination={pagination} onPageChange={onPageChange} />);

    const page3Button = screen.getByRole("button", { name: "3" });
    await user.click(page3Button);

    expect(onPageChange).toHaveBeenCalledWith(3);
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it("should show ellipsis when there are many pages", () => {
    const pagination = createMockPagination({ page: 5, totalPages: 20 });
    const onPageChange = vi.fn();

    render(<PaginationControls pagination={pagination} onPageChange={onPageChange} />);

    const ellipses = screen.getAllByText("•••");
    expect(ellipses.length).toBeGreaterThan(0);
  });

  it("should show first and last page with ellipsis for middle pages", () => {
    const pagination = createMockPagination({ page: 10, totalPages: 20 });
    const onPageChange = vi.fn();

    render(<PaginationControls pagination={pagination} onPageChange={onPageChange} />);

    // Should show page 1
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    // Should show page 20
    expect(screen.getByRole("button", { name: "20" })).toBeInTheDocument();
    // Should show ellipses
    expect(screen.getAllByText("•••")).toHaveLength(2);
  });

  it("should not show ellipsis when on first few pages", () => {
    const pagination = createMockPagination({ page: 2, totalPages: 10 });
    const onPageChange = vi.fn();

    render(<PaginationControls pagination={pagination} onPageChange={onPageChange} />);

    // Should show pages 1-5
    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5" })).toBeInTheDocument();
    // Should only have one ellipsis at the end (if any)
    const ellipses = screen.queryAllByText("•••");
    expect(ellipses.length).toBeLessThanOrEqual(1);
  });

  it("should handle single page scenario", () => {
    const pagination = createMockPagination({ page: 1, totalPages: 1 });
    const onPageChange = vi.fn();

    render(<PaginationControls pagination={pagination} onPageChange={onPageChange} />);

    const buttons = screen.getAllByRole("button");
    expect(buttons).toHaveLength(1);
    expect(buttons[0]).toHaveTextContent("1");
    expect(screen.queryByText("•••")).not.toBeInTheDocument();
  });

  it("should handle small number of pages without ellipsis", () => {
    const pagination = createMockPagination({ page: 2, totalPages: 3 });
    const onPageChange = vi.fn();

    render(<PaginationControls pagination={pagination} onPageChange={onPageChange} />);

    expect(screen.getByRole("button", { name: "1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3" })).toBeInTheDocument();
    expect(screen.queryByText("•••")).not.toBeInTheDocument();
  });

  it("should show correct range on last pages", () => {
    const pagination = createMockPagination({ page: 10, totalPages: 10 });
    const onPageChange = vi.fn();

    render(<PaginationControls pagination={pagination} onPageChange={onPageChange} />);

    // Should show last 5 pages (6-10)
    expect(screen.getByRole("button", { name: "6" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "10" })).toBeInTheDocument();
  });

  it("should allow clicking on first page from middle", async () => {
    const user = userEvent.setup();
    const pagination = createMockPagination({ page: 10, totalPages: 20 });
    const onPageChange = vi.fn();

    render(<PaginationControls pagination={pagination} onPageChange={onPageChange} />);

    const page1Button = screen.getByRole("button", { name: "1" });
    await user.click(page1Button);

    expect(onPageChange).toHaveBeenCalledWith(1);
  });

  it("should allow clicking on last page from middle", async () => {
    const user = userEvent.setup();
    const pagination = createMockPagination({ page: 10, totalPages: 20 });
    const onPageChange = vi.fn();

    render(<PaginationControls pagination={pagination} onPageChange={onPageChange} />);

    const page20Button = screen.getByRole("button", { name: "20" });
    await user.click(page20Button);

    expect(onPageChange).toHaveBeenCalledWith(20);
  });
});
