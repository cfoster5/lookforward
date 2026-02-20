import { ExtensionStorage } from "@bacons/apple-targets";
import { useEffect } from "react";
import { Platform } from "react-native";
import { PosterSize } from "tmdb-ts";

import { useGameCountdowns } from "@/screens/Countdown/api/getGameCountdowns";
import { useMovieCountdowns } from "@/screens/Countdown/api/getMovieCountdowns";
import { useAuthStore, useSubscriptionStore } from "@/stores";

const APP_GROUP = "group.com.lookforward.app";

export function useWidgetSync() {
  const movieCountdowns = useMovieCountdowns();
  const gameCountdowns = useGameCountdowns();
  const { movieSubs, gameSubs } = useSubscriptionStore();
  const { isPro } = useAuthStore();

  useEffect(() => {
    const syncData = async () => {
      // Widget is Pro-only feature
      if (!isPro) {
        try {
          const storage = new ExtensionStorage(APP_GROUP);
          storage.set("subscriptions", JSON.stringify([]));
          ExtensionStorage.reloadWidget();
        } catch (error) {
          console.error("Error clearing widget data:", error);
        }
        return;
      }

      // Only sync when we have data and queries are not pending
      if (
        (movieCountdowns.pending && movieSubs.length > 0) ||
        (gameCountdowns.pending && gameSubs.length > 0)
      ) {
        return;
      }

      try {
        const storage = new ExtensionStorage(APP_GROUP);
        const now = new Date();

        // Helper function to download and convert image to base64
        const downloadImageAsBase64 = async (url: string): Promise<string> => {
          try {
            if (Platform.OS !== "ios") return "";

            const response = await fetch(url);
            const blob = await response.blob();

            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const base64 = reader.result as string;
                // Remove the data URL prefix to get just the base64 string
                const base64String = base64.split(",")[1] || "";
                resolve(base64String);
              };
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            });
          } catch (error) {
            console.error(`Error downloading image:`, error);
            return "";
          }
        };

        // Get the movie data
        const movieDataPromises = movieCountdowns.data
          .filter((movie) => movie)
          .map(async (movie) => {
            const posterUrl = movie.poster_path
              ? `https://image.tmdb.org/t/p/${PosterSize.W300}${movie.poster_path}`
              : "";

            const posterBase64 = posterUrl
              ? await downloadImageAsBase64(posterUrl)
              : "";

            return {
              id: movie.documentID,
              title: movie.title || "Unknown Title",
              releaseDate: movie.releaseDate || "",
              posterBase64,
              type: "movie" as const,
              releaseDateObj: movie.releaseDate
                ? new Date(movie.releaseDate)
                : null,
            };
          });

        // Get the game data
        const gameDataPromises = gameCountdowns.data
          .filter((game) => game)
          .map(async (game) => {
            const releaseDate = game.date
              ? new Date(parseInt(game.date) * 1000)
              : null;

            // Build cover URL from IGDB cover data
            const coverUrl = game.game?.cover?.image_id
              ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.game.cover.image_id}.jpg`
              : "";

            const coverBase64 = coverUrl
              ? await downloadImageAsBase64(coverUrl)
              : "";

            return {
              id: game.id?.toString() || "",
              title: game.game?.name || "Unknown Game",
              releaseDate: releaseDate ? releaseDate.toISOString() : "",
              posterBase64: coverBase64,
              type: "game" as const,
              releaseDateObj: releaseDate,
            };
          });

        // Wait for all downloads to complete
        const movieData = await Promise.all(movieDataPromises);
        const gameData = await Promise.all(gameDataPromises);

        // Combine, filter, and sort all subscriptions
        const widgetData = [...movieData, ...gameData]
          .filter((item) => {
            // Only include upcoming items
            if (!item.releaseDateObj) return false;
            return item.releaseDateObj > now;
          })
          .sort((a, b) => {
            // Sort by release date (soonest first)
            if (!a.releaseDateObj || !b.releaseDateObj) return 0;
            return a.releaseDateObj.getTime() - b.releaseDateObj.getTime();
          })
          .slice(0, 3) // Limit to 3 subscriptions for the widget
          .map(({ releaseDateObj, ...item }) => item); // Remove the date object

        // Store the data as a JSON string
        storage.set("subscriptions", JSON.stringify(widgetData));

        // Debug: Log the widget data to see what's being stored
        // console.log("Widget data:", JSON.stringify(widgetData, null, 2));

        // Reload the widget to show new data
        ExtensionStorage.reloadWidget();
      } catch (error) {
        console.error("Error syncing widget data:", error);
      }
    };

    syncData();
  }, [movieCountdowns, gameCountdowns, movieSubs, gameSubs, isPro]);
}
