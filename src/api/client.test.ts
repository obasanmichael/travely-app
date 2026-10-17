import { afterEach, describe, expect, it, vi } from "vitest";
import { describeFailure, getMeta } from "./client";

describe("describeFailure", () => {
  it.each([
    [0, true, /connection/],
    [429, true, /Too many/],
    [503, true, /updating/],
    [401, false, /session expired/],
    [500, true, /our side/],
  ])("status %i is retryable=%s", (status, retryable, message) => {
    const error = describeFailure(status);
    expect(error.retryable).toBe(retryable);
    expect(error.message).toMatch(message);
  });

  it("keeps the server's explanation for validation errors", () => {
    expect(describeFailure(422, "Unknown origin state NG-ZZ").message).toBe("Unknown origin state NG-ZZ");
  });
});

describe("validation errors from the server", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("name the answer that is wrong", async () => {
    const detail = [{ type: "less_than_equal", loc: ["body", "days"], msg: "Input should be less than or equal to 30" }];
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({ detail }), { status: 422 })));
    await expect(getMeta()).rejects.toThrow(/trip length/);
  });
});
