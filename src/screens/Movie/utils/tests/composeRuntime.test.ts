import { composeRuntime } from "@/screens/Movie/utils/composeRuntime";

describe("composeRuntime", () => {
  it("formats minutes only when under an hour", () => {
    expect(composeRuntime(45)).toBe("45m");
  });

  it("formats hours and minutes", () => {
    expect(composeRuntime(125)).toBe("2h 5m");
  });

  it("formats exactly one hour", () => {
    expect(composeRuntime(60)).toBe("1h 0m");
  });

  it("returns undefined when runtime is 0", () => {
    expect(composeRuntime(0)).toBeUndefined();
  });

  it("returns undefined when runtime is undefined", () => {
    expect(composeRuntime(undefined)).toBeUndefined();
  });
});
