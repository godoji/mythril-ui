import { computePosition } from "@floating-ui/react";
import { describe, expect, it, vi } from "vitest";
import { floatingMiddleware } from "./floating-position.js";

const rect = (x: number, y: number, width: number, height: number): DOMRect =>
  DOMRect.fromRect({ x, y, width, height });

describe("floating positioning", () => {
  it("flips within a custom boundary and returns to the preferred side when it has room", async () => {
    Object.defineProperties(document.documentElement, {
      clientWidth: { value: 1024, configurable: true },
      clientHeight: { value: 768, configurable: true },
    });
    const boundary = document.createElement("div");
    const reference = document.createElement("button");
    const floating = document.createElement("div");
    const boundarySize = { width: 200, height: 200 };
    Object.defineProperties(boundary, {
      clientWidth: { get: () => boundarySize.width },
      clientHeight: { get: () => boundarySize.height },
    });
    boundary.append(reference);
    document.body.append(boundary, floating);
    vi.spyOn(boundary, "getBoundingClientRect").mockImplementation(() =>
      rect(0, 0, boundarySize.width, boundarySize.height),
    );
    vi.spyOn(reference, "getBoundingClientRect").mockReturnValue(
      rect(60, 170, 20, 20),
    );
    vi.spyOn(floating, "getBoundingClientRect").mockReturnValue(
      rect(0, 0, 100, 80),
    );
    Object.defineProperties(floating, {
      offsetWidth: { value: 100 },
      offsetHeight: { value: 80 },
    });

    const boundaryRef = { current: boundary };
    const inside = await computePosition(reference, floating, {
      strategy: "fixed",
      placement: "bottom-start",
      middleware: floatingMiddleware(6, boundaryRef, "end"),
    });
    expect(inside.placement).toMatch(/^top/);
    expect(inside.y).toBeLessThan(170);
    expect(
      Number.parseFloat(
        floating.style.getPropertyValue("--mythril-available-width"),
      ),
    ).toBeLessThan(200);
    expect(
      Number.parseFloat(
        floating.style.getPropertyValue("--mythril-available-height"),
      ),
    ).toBeLessThan(200);

    boundarySize.width = 500;
    boundarySize.height = 500;
    const roomy = await computePosition(reference, floating, {
      strategy: "fixed",
      placement: "bottom-start",
      middleware: floatingMiddleware(6, boundaryRef, "end"),
    });
    expect(roomy.placement).toBe("bottom-start");
    expect(roomy.y).toBeGreaterThanOrEqual(190);
    expect(
      floating.style.getPropertyValue("--mythril-available-width"),
    ).toMatch(/px$/);
    boundary.remove();
    floating.remove();
  });
});
