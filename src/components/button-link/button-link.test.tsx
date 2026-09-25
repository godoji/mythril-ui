import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ButtonLink, buttonLinkProps } from "./button-link.js";

describe("ButtonLink", () => {
  it("keeps native link behavior and supports router link styling", async () => {
    const onClick = vi.fn((event: React.MouseEvent<HTMLAnchorElement>) => {
      event.preventDefault();
    });
    const user = userEvent.setup();
    render(
      <>
        <ButtonLink href="/orders" onClick={onClick}>
          Orders
        </ButtonLink>
        <a href="/products" {...buttonLinkProps({ variant: "ghost" })}>
          Products
        </a>
      </>,
    );
    const orders = screen.getByRole("link", { name: "Orders" });
    expect(orders).toHaveAttribute("href", "/orders");
    await user.click(orders);
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "data-variant",
      "ghost",
    );
  });
});
