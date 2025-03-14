import { Crew } from "tmdb-ts";

export function composeGroupedJobCredits(crew?: Crew[]) {
  // Group crew members by name and aggregate job roles into an array.
  // Output is a new array where each crew member appears only once, with their job property containing an array of all jobs they performed.
  const jobMap = new Map();

  crew?.forEach((crewMember) => {
    if (jobMap.has(crewMember.name)) {
      jobMap.get(crewMember.name).job.push(crewMember.job);
    } else {
      jobMap.set(crewMember.name, { ...crewMember, job: [crewMember.job] });
    }
  });

  return Array.from(jobMap.values());
}
