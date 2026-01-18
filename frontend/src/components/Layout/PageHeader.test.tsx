import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageHeader } from "./PageHeader";

describe("PageHeader", () => {
  it("should render the header text", () => {
    render(<PageHeader />);

    expect(screen.getByText("Hertility Admin Dashboard")).toBeInTheDocument();
  });

  it("should render as header element", () => {
    const { container } = render(<PageHeader />);

    const header = container.querySelector("header");
    expect(header).toBeInTheDocument();
  });

  it("should have correct styling classes", () => {
    const { container } = render(<PageHeader />);

    const header = container.querySelector("header");
    expect(header).toHaveClass("flex", "flex-col", "items-center", "text-center");
  });

  it("should render heading as h1", () => {
    render(<PageHeader />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent("Hertility Admin Dashboard");
  });

  it("should apply correct text size classes to heading", () => {
    render(<PageHeader />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveClass("text-2xl", "sm:text-3xl", "font-semibold");
  });
});
