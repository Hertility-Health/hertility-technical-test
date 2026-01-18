import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Pagination } from "./Pagination";

describe("Pagination", () => {
  const createMockPagination = (overrides = {}) => ({
    page: 1,
    totalPages: 10,
    ...overrides,
  });

  it("should render pagination with current page info", () => {
    const onPageChange = vi.fn();
    const pagination = createMockPagination();

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    expect(screen.getByText(/Page/)).toHaveTextContent("Page 1 of 10");
  });

  it("should have accessible navigation label", () => {
    const onPageChange = vi.fn();
    const pagination = createMockPagination();

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    const nav = screen.getByRole("navigation", { name: "Pagination" });
    expect(nav).toBeInTheDocument();
  });

  it("should render Previous and Next buttons", () => {
    const onPageChange = vi.fn();
    const pagination = createMockPagination();

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    expect(screen.getByRole("button", { name: "Previous" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });

  it("should disable Previous button on first page", () => {
    const onPageChange = vi.fn();
    const pagination = createMockPagination({ page: 1 });

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole("button", { name: "Previous" });
    expect(prevButton).toBeDisabled();
  });

  it("should enable Previous button when not on first page", () => {
    const onPageChange = vi.fn();
    const pagination = createMockPagination({ page: 5 });

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole("button", { name: "Previous" });
    expect(prevButton).not.toBeDisabled();
  });

  it("should disable Next button on last page", () => {
    const onPageChange = vi.fn();
    const pagination = createMockPagination({ page: 10, totalPages: 10 });

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).toBeDisabled();
  });

  it("should enable Next button when not on last page", () => {
    const onPageChange = vi.fn();
    const pagination = createMockPagination({ page: 5 });

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole("button", { name: "Next" });
    expect(nextButton).not.toBeDisabled();
  });

  it("should call onPageChange with previous page when Previous clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const pagination = createMockPagination({ page: 5 });

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole("button", { name: "Previous" });
    await user.click(prevButton);

    expect(onPageChange).toHaveBeenCalledWith(4);
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it("should call onPageChange with next page when Next clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const pagination = createMockPagination({ page: 5 });

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    expect(onPageChange).toHaveBeenCalledWith(6);
    expect(onPageChange).toHaveBeenCalledTimes(1);
  });

  it("should not call onPageChange when Previous is disabled and clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const pagination = createMockPagination({ page: 1 });

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole("button", { name: "Previous" });
    await user.click(prevButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should not call onPageChange when Next is disabled and clicked", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const pagination = createMockPagination({ page: 10, totalPages: 10 });

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    const nextButton = screen.getByRole("button", { name: "Next" });
    await user.click(nextButton);

    expect(onPageChange).not.toHaveBeenCalled();
  });

  it("should display correct page when on middle page", () => {
    const onPageChange = vi.fn();
    const pagination = createMockPagination({ page: 5, totalPages: 10 });

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    expect(screen.getByText(/Page/)).toHaveTextContent("Page 5 of 10");
  });

  it("should handle single page scenario", () => {
    const onPageChange = vi.fn();
    const pagination = createMockPagination({ page: 1, totalPages: 1 });

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    expect(screen.getByText(/Page/)).toHaveTextContent("Page 1 of 1");
    expect(screen.getByRole("button", { name: "Previous" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next" })).toBeDisabled();
  });

  it("should apply correct styling classes to buttons", () => {
    const onPageChange = vi.fn();
    const pagination = createMockPagination();

    render(<Pagination pagination={pagination} onPageChange={onPageChange} />);

    const prevButton = screen.getByRole("button", { name: "Previous" });
    expect(prevButton).toHaveClass("rounded-lg", "shadow-sm");
  });
});
