import { useQuery } from "@tanstack/react-query";

import { igdb } from "@/providers/app";
import { timestamp } from "@/utils/dates";

async function getUpcomingPlatforms() {
  const query = `fields platform.id, platform.name;
    where date > ${Math.floor(timestamp)} & release_region = (2,8);
    sort date asc;
    limit 500;`;

  const response = await igdb.releaseDates.retreiveReleaseDate(query);
  const seen = new Set<number>();
  const platforms: { id: number; name: string }[] = [];

  for (const release of response.data) {
    const p = release.platform;
    if (!p?.id || !p?.name || seen.has(p.id)) continue;
    seen.add(p.id);
    platforms.push({ id: p.id, name: p.name });
  }

  return platforms;
}

export function useGamePlatforms() {
  return useQuery({
    queryKey: ["gamePlatformsFromUpcoming"],
    queryFn: getUpcomingPlatforms,
  });
}
