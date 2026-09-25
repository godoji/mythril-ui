import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { FileDropzone } from "./file-dropzone.js";

describe("FileDropzone", () => {
  it("accepts native selection and a dropped file", async () => {
    const user = userEvent.setup();
    const onFiles = vi.fn();
    const { container } = render(
      <FileDropzone label="Product image" onFiles={onFiles} />,
    );
    const input = screen.getByLabelText("Product image");
    const picker = vi.spyOn(input, "click");
    await user.click(screen.getByRole("button", { name: "Choose file" }));
    expect(picker).toHaveBeenCalledOnce();
    const file = new File(["picture"], "wine.png", { type: "image/png" });
    await user.upload(input, file);
    expect(onFiles).toHaveBeenCalledWith([file]);
    const dropzone = container.firstElementChild;
    expect(dropzone).not.toBeNull();
    fireEvent.drop(dropzone as Element, { dataTransfer: { files: [file] } });
    expect(onFiles).toHaveBeenCalledTimes(2);
  });
});
