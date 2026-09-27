import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MessagesProvider } from "./messages.js";
import { Pagination } from "../pagination/pagination.js";
import { FileDropzone } from "../file-dropzone/file-dropzone.js";

describe("MessagesProvider", () => {
  it("inherits messages through nested providers", () => {
    render(
      <MessagesProvider messages={{ previous: "Vorige", next: "Volgende" }}>
        <MessagesProvider messages={{ chooseFile: "Bestand kiezen" }}>
          <Pagination
            label="Resultaten"
            page={2}
            hasNextPage
            onPageChange={() => {}}
          />
          <FileDropzone label="Afbeelding" onFiles={() => {}} />
        </MessagesProvider>
      </MessagesProvider>,
    );
    expect(screen.getByRole("button", { name: "Vorige" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Volgende" })).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Bestand kiezen" }),
    ).toBeEnabled();
  });
});
