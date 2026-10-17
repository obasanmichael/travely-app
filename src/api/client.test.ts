import { describe, expect, it } from "vitest";
import { describeFailure } from "./client";

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
