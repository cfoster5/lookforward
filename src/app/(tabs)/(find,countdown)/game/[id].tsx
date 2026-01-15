import * as Colors from "@bacons/apple-colors";
import { getAnalytics, logEvent } from "@react-native-firebase/analytics";
import { Image } from "expo-image";
import {
  Stack,
  useLocalSearchParams,
  useRouter,
  useSegments,
} from "expo-router";
import { useState, Fragment } from "react";
import { ScrollView, View, FlatList, Text } from "react-native";
import RevenueCatUI from "react-native-purchases-ui";
import { iOSUIKit } from "react-native-typography";

import { useProOfferings } from "@/api/getProOfferings";
import ButtonSingleState from "@/components/ButtonSingleState";
import { CategoryControl } from "@/components/CategoryControl";
import { ExpandableText } from "@/components/ExpandableText";
import { GamePlatformPicker } from "@/components/GamePlatformPicker";
import { LargeBorderlessButton } from "@/components/LargeBorderlessButton";
import { Text as ThemedText } from "@/components/Themed";
import Trailer from "@/components/Trailer";
import { horizontalListProps } from "@/constants/HorizontalListProps";
import { removeSub, getGameReleaseDate } from "@/helpers/helpers";
import useAddRecent from "@/hooks/useAddRecent";
import { useAuthenticatedUser } from "@/hooks/useAuthenticatedUser";
import { useGame } from "@/screens/Game/api/getGame";
import {
  useAuthStore,
  useSubscriptionStore,
  useInterfaceStore,
} from "@/stores";
import { Recent } from "@/types";
import { timestamp } from "@/utils/dates";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

type GameData = NonNullable<ReturnType<typeof useGame>["data"]>;

type GameCreditsProp = {
  companies: GameData["involved_companies"];
  type: "publisher" | "developer" | "supporting";
  title: string;
};

const GameCredits = ({ companies, type, title }: GameCreditsProp) =>
  companies?.find((company) => company[type]) && (
    <ThemedText style={{ ...iOSUIKit.bodyObject, paddingTop: 16 }}>
      {title}:
      {companies
        .filter((company) => company[type])
        .map((company, i) => (
          <Fragment key={i}>
            {i > 0 ? `, ${company.company.name}` : ` ${company.company.name}`}
          </Fragment>
        ))}
    </ThemedText>
  );

export default function Game() {
  const segments = useSegments();
  const stack = segments[1] as "(find)" | "(countdown)";
  const router = useRouter();
  const { game: gameString } = useLocalSearchParams();
  const game = gameString ? JSON.parse(gameString) : undefined;
  const user = useAuthenticatedUser();
  const { isPro } = useAuthStore();
  const { gameSubs } = useSubscriptionStore();
  const { bottomSheetModalRef } = useInterfaceStore();
  const countdownId = gameSubs.find((s) => s.game.id === game.id)?.documentID;
  const [detailIndex, setDetailIndex] = useState(0);
  const { data, isLoading } = useGame(game.id);
  const paddingBottom = useBottomTabOverflow();

  const recentGame: Recent = {
    id: game.id,
    name: game.name,
    img_path: game.cover?.url ?? "",
    last_viewed: timestamp,
    media_type: "game",
  };

  useAddRecent("recentGames", recentGame);

  const { data: pro } = useProOfferings();

  return (
    <>
      <Stack.Header>
        {/* Set title for back navigation but set to transparent to hide title */}
        <Stack.Header.Title style={{ color: "transparent" }}>
          {game.name}
        </Stack.Header.Title>
        <Stack.Header.Right>
          <Stack.Header.Button
            onPress={() => {
              if (!countdownId) {
                bottomSheetModalRef.current?.present({
                  ...game,
                  release_dates: data?.release_dates,
                });
              } else {
                removeSub("gameReleases", countdownId, user.uid);
              }
            }}
          >
            <Stack.Header.Icon sf={countdownId ? "checkmark" : "plus"} />
          </Stack.Header.Button>
        </Stack.Header.Right>
      </Stack.Header>
      <ScrollView
        automaticallyAdjustsScrollIndicatorInsets
        contentInsetAdjustmentBehavior="automatic"
        contentInset={{ bottom: paddingBottom }}
        scrollIndicatorInsets={{ bottom: paddingBottom }}
      >
        {game?.cover?.url && (
          <Image
            style={{ aspectRatio: 16 / 9 }}
            source={{
              uri: `https:${game.cover.url.replace("thumb", "screenshot_big")}`,
            }}
          />
        )}
        <View style={{ margin: 16, marginBottom: 0 }}>
          <ThemedText style={iOSUIKit.largeTitleEmphasized}>
            {game.name}
          </ThemedText>
          <Text
            style={[
              iOSUIKit.subheadEmphasized,
              { color: Colors.secondaryLabel },
            ]}
          >
            {getGameReleaseDate(data)}
          </Text>

          {!isPro && (
            <LargeBorderlessButton
              handlePress={async () => {
                await RevenueCatUI.presentPaywall({ offering: pro });
                const analytics = getAnalytics();
                await logEvent(analytics, "select_promotion", {
                  name: "Pro",
                  id: "com.lookforward.pro",
                });
              }}
              text="Explore Pro Features"
              style={{ paddingBottom: 0 }}
            />
          )}

          <ExpandableText text={data?.summary} />

          <View
            style={{
              flexDirection: "row",
              paddingBottom: 16,
              flexWrap: "wrap",
            }}
          >
            {data?.genres?.map((genre, i) => (
              <ButtonSingleState
                key={i}
                text={genre.name}
                onPress={() =>
                  router.push({
                    pathname: `/(tabs)/${stack}/game-discover`,
                    params: {
                      genre: JSON.stringify(genre),
                      screenTitle: genre.name,
                    },
                  })
                }
                buttonStyle={{
                  backgroundColor: Colors.secondarySystemGroupedBackground,
                  borderColor: Colors.secondarySystemGroupedBackground,
                }}
              />
            ))}
          </View>
        </View>
        <CategoryControl
          buttons={["Credits", "Trailers"]}
          categoryIndex={detailIndex}
          handleCategoryChange={(index: number) => setDetailIndex(index)}
        />
        <View style={{ marginHorizontal: 16, marginBottom: 16 }}>
          {detailIndex === 0 && !isLoading && (
            <>
              <GameCredits
                companies={data?.involved_companies}
                type="publisher"
                title="Published by"
              />
              <GameCredits
                companies={data?.involved_companies}
                type="developer"
                title="Developed by"
              />
              <GameCredits
                companies={data?.involved_companies}
                type="supporting"
                title="Supported by"
              />
            </>
          )}
          {detailIndex === 1 &&
            !isLoading &&
            (data?.videos ? (
              <FlatList
                keyExtractor={(item) => item.id}
                data={data!.videos}
                renderItem={({ item }) => <Trailer video={item} />}
                {...horizontalListProps}
              />
            ) : (
              <ThemedText style={{ ...iOSUIKit.bodyObject, paddingTop: 16 }}>
                No trailers yet! Come back later!
              </ThemedText>
            ))}
        </View>
      </ScrollView>
      <GamePlatformPicker />
    </>
  );
}
