import { useEffect, useState } from "react";

export function useGetHypedGames() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    let isMounted = true;
    async function getHypedGames() {
      const response = await fetch(
        "https://gou4rcsh6i.execute-api.us-east-1.amazonaws.com/prod/games",
        {
          method: "POST",
          body: `fields name, category, hypes, first_release_date, cover.*, release_dates.*;
        where category = 0 & first_release_date > ${Math.floor(
          Date.now() / 1000
        )} & release_dates.region = (2,8) & hypes != null & cover.url != null;
        sort hypes desc;
        limit 10;`,
        }
      );
      if (isMounted) {
        // Checking for mounted status corrects warning: "Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.""
        setGames(await response.json());
      }
    }
    getHypedGames();
    return () => {
      isMounted = false;
    };
  }, []);

  return games;
}
