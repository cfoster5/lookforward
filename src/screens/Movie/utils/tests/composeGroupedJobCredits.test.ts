import { composeGroupedJobCredits } from "@/screens/Movie/utils/composeGroupedJobCredits";
import type { Crew } from "tmdb-ts";

function makeCrew(name: string, job: string): Crew {
  return { name, job, id: 1, credit_id: "", department: "", gender: 0, known_for_department: "", original_name: "", popularity: 0, profile_path: "", adult: false };
}

describe("composeGroupedJobCredits", () => {
  it("aggregates multiple jobs for the same person into an array", () => {
    const crew = [makeCrew("Alice", "Director"), makeCrew("Alice", "Writer")];
    const result = composeGroupedJobCredits(crew);
    expect(result).toHaveLength(1);
    expect(result[0].job).toEqual(["Director", "Writer"]);
  });

  it("keeps distinct crew members separate", () => {
    const crew = [makeCrew("Alice", "Director"), makeCrew("Bob", "Producer")];
    const result = composeGroupedJobCredits(crew);
    expect(result).toHaveLength(2);
  });

  it("wraps a single job in an array", () => {
    const crew = [makeCrew("Alice", "Director")];
    const result = composeGroupedJobCredits(crew);
    expect(result[0].job).toEqual(["Director"]);
  });

  it("returns empty array for empty crew", () => {
    expect(composeGroupedJobCredits([])).toEqual([]);
  });

  it("returns empty array when crew is undefined", () => {
    expect(composeGroupedJobCredits(undefined)).toEqual([]);
  });
});
