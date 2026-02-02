// import * as Colors from "@bacons/apple-colors";
// import {
//   Host,
//   HStack,
//   List,
//   Progress,
//   RNHostView,
//   Section,
//   Spacer,
//   Text,
//   VStack,
// } from "@expo/ui/swift-ui";
// import { Image } from "expo-image";
// import { Link } from "expo-router";
// import { DateTime } from "luxon";
// import { StyleSheet, View } from "react-native";
// import { PosterSize } from "tmdb-ts";

// import { IconSymbol } from "@/components/IconSymbol";
// import { LoadingScreen } from "@/components/LoadingScreen";
// import { useCollectionsProgress } from "@/hooks/useCollectionProgress";
// import { useGameCountdowns } from "@/screens/Countdown/api/getGameCountdowns";
// import { useMovieCountdowns } from "@/screens/Countdown/api/getMovieCountdowns";

// function getDaysUntil(releaseDate: string | undefined): number | null {
//   if (!releaseDate) return null;
//   const release = DateTime.fromISO(releaseDate);
//   const now = DateTime.local();
//   return Math.ceil(release.diff(now, "days").days);
// }

// function formatReleaseDate(releaseDate: string | undefined): string {
//   if (!releaseDate) return "TBD";
//   return DateTime.fromISO(releaseDate).toLocaleString(DateTime.DATE_MED);
// }

// function getGameDaysUntil(timestamp: number | undefined): number | null {
//   if (!timestamp) return null;
//   // IGDB timestamps are midnight UTC - use startOf('day') for both to compare dates only
//   const release = DateTime.fromSeconds(timestamp, { zone: "utc" }).startOf(
//     "day",
//   );
//   const now = DateTime.local().startOf("day");
//   return Math.ceil(release.diff(now, "days").days);
// }

// function formatGameReleaseDate(
//   timestamp: number | undefined,
//   human: string | undefined,
// ): string {
//   if (timestamp) {
//     // IGDB timestamps are midnight UTC - display the UTC date to avoid timezone shift
//     return DateTime.fromSeconds(timestamp, { zone: "utc" }).toLocaleString(
//       DateTime.DATE_MED,
//     );
//   }
//   return human ?? "TBD";
// }

// export default function Countdown() {
//   const { data: movies, pending: isMoviesPending } = useMovieCountdowns();
//   const { data: gameReleases, pending: isGamesPending } = useGameCountdowns();
//   const { collectionsWithProgress } = useCollectionsProgress();

//   if (isMoviesPending || isGamesPending) return <LoadingScreen />;
//   return (
//     <Host style={{ flex: 1 }}>
//       <List
//         // editModeEnabled
//         deleteEnabled={true}
//         selectEnabled={true}
//         listStyle="insetGrouped"
//       >
//         {collectionsWithProgress.length > 0 && (
//           <Section title="Collections">
//             {collectionsWithProgress.map(({ collection, progress }) => {
//               const earlyCount = progress.trackedBeforeAnnouncement.length;
//               const progressValue =
//                 progress.totalInCollection > 0
//                   ? progress.trackedMovieIds.length / progress.totalInCollection
//                   : 0;

//               return (
//                 <VStack key={collection.id} alignment="leading" spacing={8}>
//                   <HStack spacing={8}>
//                     <RNHostView matchContents>
//                       <IconSymbol
//                         name={collection.badgeIcon ?? "trophy.fill"}
//                         size={20}
//                         color={Colors.systemYellow}
//                       />
//                     </RNHostView>
//                     <Text>{collection.name}</Text>
//                     <Spacer />
//                     <Text color="secondary">
//                       {progress.trackedMovieIds.length}/
//                       {progress.totalInCollection}
//                     </Text>
//                   </HStack>
//                   <Progress progress={progressValue} variant="linear" />
//                   {earlyCount > 0 && (
//                     <HStack spacing={4}>
//                       <RNHostView matchContents>
//                         <IconSymbol
//                           name="star.fill"
//                           size={14}
//                           color={Colors.systemOrange}
//                         />
//                       </RNHostView>
//                       <Text color="secondary">
//                         {earlyCount} tracked before nominations!
//                       </Text>
//                     </HStack>
//                   )}
//                 </VStack>
//               );
//             })}
//           </Section>
//         )}
//         {movies.length > 0 && (
//           <Section title="Movies">
//             {movies
//               .sort((a, b) => {
//                 if (!a?.releaseDate) return 1;
//                 if (!b?.releaseDate) return -1;
//                 return a.releaseDate.localeCompare(b.releaseDate);
//               })
//               .map((movie, index) => (
//                 <Link
//                   key={index}
//                   href={`/(tabs)/(countdown)/movie/${movie?.id}`}
//                   asChild
//                 >
//                   <HStack spacing={18}>
//                     <RNHostView matchContents>
//                       {movie?.poster_path ? (
//                         <Image
//                           source={{
//                             uri: `https://image.tmdb.org/t/p/${PosterSize.W185}${movie.poster_path}`,
//                           }}
//                           style={{
//                             // 50 matches slide to delete perfectly
//                             // 100 gets to the image halfway point when sliding to delete
//                             width: 50,
//                             aspectRatio: 2 / 3,
//                             borderRadius: 13,
//                             borderWidth: StyleSheet.hairlineWidth,
//                             borderColor: Colors.separator,
//                           }}
//                           contentFit="cover"
//                         />
//                       ) : (
//                         <View
//                           style={{
//                             width: 50,
//                             aspectRatio: 2 / 3,
//                             borderRadius: 13,
//                             borderWidth: StyleSheet.hairlineWidth,
//                             borderColor: Colors.separator,
//                             // backgroundColor: Colors.systemGray6,
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <IconSymbol
//                             name="film"
//                             size={30}
//                             color={Colors.systemGray3}
//                           />
//                         </View>
//                       )}
//                     </RNHostView>
//                     <VStack alignment="leading">
//                       <Text lineLimit={2}>{movie?.title}</Text>
//                       <Text color="secondary">
//                         {formatReleaseDate(movie?.releaseDate)}
//                       </Text>
//                     </VStack>
//                     <Spacer />
//                     <VStack alignment="center">
//                       <Text>{getDaysUntil(movie?.releaseDate) ?? "TBD"}</Text>
//                       <Text>days</Text>
//                     </VStack>
//                   </HStack>
//                 </Link>
//               ))}
//           </Section>
//         )}
//         {gameReleases.length > 0 && (
//           <Section title="Games">
//             {gameReleases
//               .sort((a, b) => {
//                 if (!a?.date) return 1;
//                 if (!b?.date) return -1;
//                 return a.date - b.date;
//               })
//               .map((game, index) => (
//                 <Link
//                   key={index}
//                   href={{
//                     pathname: "/(tabs)/(countdown)/game/[id]",
//                     params: {
//                       id: game?.id,
//                       game: JSON.stringify({
//                         id: game?.game?.id,
//                         name: game?.game?.name,
//                         cover: game?.game?.cover,
//                       }),
//                     },
//                   }}
//                   asChild
//                 >
//                   <HStack spacing={18}>
//                     <RNHostView matchContents>
//                       {game?.game?.cover?.image_id ? (
//                         <Image
//                           source={{
//                             uri: `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.game.cover.image_id}.jpg`,
//                           }}
//                           style={{
//                             width: 50,
//                             aspectRatio: 3 / 4,
//                             borderRadius: 13,
//                             borderWidth: StyleSheet.hairlineWidth,
//                             borderColor: Colors.separator,
//                           }}
//                           contentFit="cover"
//                         />
//                       ) : (
//                         <View
//                           style={{
//                             width: 50,
//                             aspectRatio: 3 / 4,
//                             borderRadius: 13,
//                             borderWidth: StyleSheet.hairlineWidth,
//                             borderColor: Colors.separator,
//                             // backgroundColor: Colors.systemGray6,
//                             justifyContent: "center",
//                             alignItems: "center",
//                           }}
//                         >
//                           <IconSymbol
//                             name="gamecontroller"
//                             size={30}
//                             color={Colors.systemGray3}
//                           />
//                         </View>
//                       )}
//                     </RNHostView>
//                     <VStack alignment="leading">
//                       <Text>{game?.game?.name ?? "Unknown"}</Text>
//                       <Text color="secondary">
//                         {formatGameReleaseDate(game?.date, game?.human)}
//                       </Text>
//                     </VStack>
//                     <Spacer />
//                     <VStack alignment="center">
//                       <Text>{getGameDaysUntil(game?.date) ?? "TBD"}</Text>
//                       <Text>days</Text>
//                     </VStack>
//                   </HStack>
//                 </Link>
//               ))}
//           </Section>
//         )}
//       </List>
//     </Host>
//   );
// }
