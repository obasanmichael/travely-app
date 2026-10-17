import { describe, expect, it } from "vitest";
import { authMessage } from "./authMessages";

describe("authMessage", () => {
  it("tells the user what to do next", () => {
    expect(authMessage("auth/email-already-in-use")).toMatch(/Sign in instead/);
    expect(authMessage("auth/invalid-credential")).toMatch(/reset your password/);
  });

  it("keeps the code for anything unexpected", () => {
    expect(authMessage("auth/something-new")).toContain("auth/something-new");
  });
});
