import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { StatusFilter } from "./StatusFilter";

describe("StatusFilter", () => {
  it("should render with label and select element", () => {
    const onChange = vi.fn();
    render(<StatusFilter value={undefined} onChange={onChange} />);

    expect(screen.getByLabelText("Filter by Status:")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should display all three options", () => {
    const onChange = vi.fn();
    render(<StatusFilter value={undefined} onChange={onChange} />);

    const select = screen.getByRole("combobox");
    const options = Array.from(select.querySelectorAll("option"));

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("All Results");
    expect(options[1]).toHaveTextContent("In Range");
    expect(options[2]).toHaveTextContent("Not In Range");
  });

  it("should show 'All Results' when value is undefined", () => {
    const onChange = vi.fn();
    render(<StatusFilter value={undefined} onChange={onChange} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("");
  });

  it("should show 'In Range' when value is true", () => {
    const onChange = vi.fn();
    render(<StatusFilter value={true} onChange={onChange} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("1");
  });

  it("should show 'Not In Range' when value is false", () => {
    const onChange = vi.fn();
    render(<StatusFilter value={false} onChange={onChange} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("0");
  });

  it("should call onChange with undefined when 'All Results' is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StatusFilter value={true} onChange={onChange} />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "");

    expect(onChange).toHaveBeenCalledWith(undefined);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should call onChange with true when 'In Range' is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StatusFilter value={undefined} onChange={onChange} />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "1");

    expect(onChange).toHaveBeenCalledWith(true);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should call onChange with false when 'Not In Range' is selected", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<StatusFilter value={undefined} onChange={onChange} />);

    const select = screen.getByRole("combobox");
    await user.selectOptions(select, "0");

    expect(onChange).toHaveBeenCalledWith(false);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("should be a controlled component", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const { rerender } = render(<StatusFilter value={undefined} onChange={onChange} />);

    const select = screen.getByRole("combobox") as HTMLSelectElement;
    expect(select.value).toBe("");

    await user.selectOptions(select, "1");
    expect(onChange).toHaveBeenCalledWith(true);

    rerender(<StatusFilter value={true} onChange={onChange} />);
    expect(select.value).toBe("1");

    await user.selectOptions(select, "0");
    expect(onChange).toHaveBeenCalledWith(false);

    rerender(<StatusFilter value={false} onChange={onChange} />);
    expect(select.value).toBe("0");
  });
});
