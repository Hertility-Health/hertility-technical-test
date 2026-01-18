import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LoadingSpinner } from "./LoadingSpinner";

describe("LoadingSpinner", () => {
  it("should render loading text", () => {
    render(<LoadingSpinner />);

    expect(screen.getByText("Loading results...")).toBeInTheDocument();
  });

  it("should have accessible status role", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toBeInTheDocument();
  });

  it("should have accessible label", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByLabelText("Loading");
    expect(spinner).toBeInTheDocument();
  });

  it("should apply animation classes to spinner", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass("animate-spin");
  });

  it("should apply border styling for spinner visual", () => {
    render(<LoadingSpinner />);

    const spinner = screen.getByRole("status");
    expect(spinner).toHaveClass(
      "rounded-full",
      "border-4",
      "border-slate-300",
      "border-t-slate-600",
    );
  });

  it("should render in a container with proper styling", () => {
    const { container } = render(<LoadingSpinner />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("rounded-lg", "border", "bg-white", "shadow-sm");
  });

  it("should center content", () => {
    const { container } = render(<LoadingSpinner />);

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass("text-center");
  });
});
