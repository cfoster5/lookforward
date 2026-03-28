import { ReleaseDateType } from "tmdb-ts";

import { getPreferredReleaseDate } from "@/helpers/getPreferredReleaseDate";
import type { ReleaseDate } from "tmdb-ts";

function makeDate(type: number, release_date: string): ReleaseDate {
  return { type, release_date, certification: "", note: "", descriptors: [] };
}

describe("getPreferredReleaseDate", () => {
  it("prefers Theatrical over Limited", () => {
    const dates = [
      makeDate(ReleaseDateType["Theatrical (limited)"], "2024-03-01"),
      makeDate(ReleaseDateType.Theatrical, "2024-04-01"),
    ];
    expect(getPreferredReleaseDate(dates)?.type).toBe(
      ReleaseDateType.Theatrical,
    );
  });

  it("falls back to Limited when no Theatrical", () => {
    const dates = [
      makeDate(ReleaseDateType.Digital, "2024-05-01"),
      makeDate(ReleaseDateType["Theatrical (limited)"], "2024-03-01"),
    ];
    expect(getPreferredReleaseDate(dates)?.type).toBe(
      ReleaseDateType["Theatrical (limited)"],
    );
  });

  it("picks earliest Theatrical when multiple exist", () => {
    const dates = [
      makeDate(ReleaseDateType.Theatrical, "2024-06-01"),
      makeDate(ReleaseDateType.Theatrical, "2024-03-01"),
    ];
    expect(getPreferredReleaseDate(dates)?.release_date).toBe("2024-03-01");
  });

  it("excludes Premiere dates from fallback", () => {
    const dates = [makeDate(ReleaseDateType.Premiere, "2024-01-01")];
    expect(getPreferredReleaseDate(dates)).toBeUndefined();
  });

  it("falls back to non-Premiere types when no Theatrical or Limited", () => {
    const dates = [
      makeDate(ReleaseDateType.Premiere, "2024-01-01"),
      makeDate(ReleaseDateType.Digital, "2024-04-01"),
    ];
    expect(getPreferredReleaseDate(dates)?.type).toBe(ReleaseDateType.Digital);
  });

  it("returns undefined for empty list", () => {
    expect(getPreferredReleaseDate([])).toBeUndefined();
  });
});
