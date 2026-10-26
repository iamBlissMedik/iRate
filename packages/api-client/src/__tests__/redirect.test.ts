import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "../redirect";

describe("safeRedirectPath", () => {
  it("keeps same-origin paths (with query strings)", () => {
    expect(safeRedirectPath("/dashboard/users?page=2")).toBe("/dashboard/users?page=2");
  });

  it.each([
    null,
    undefined,
    "",
    "dashboard",
    "https://evil.com",
    "//evil.com",
    "/\\evil.com",
    "/\t/evil.com",
  ])("falls back for %j", (value) => {
    expect(safeRedirectPath(value, "/home")).toBe("/home");
  });
});
