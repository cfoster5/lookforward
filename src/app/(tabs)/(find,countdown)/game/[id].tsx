import analytics from "@react-native-firebase/analytics";
import { Image } from "expo-image";
import {
  useLocalSearchParams,
  useNavigation,
  useRouter,
  useSegments,
} from "expo-router";
import { useLayoutEffect, useState, Fragment, useMemo } from "react";
import { PlatformColor, ScrollView, View, FlatList, Text } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import ButtonSingleState from "@/components/ButtonSingleState";
import { CategoryControl } from "@/components/CategoryControl";
import { ExpandableText } from "@/components/ExpandableText";
import { GamePlatformPicker } from "@/components/GamePlatformPicker";
import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { LargeBorderlessButton } from "@/components/LargeBorderlessButton";
import { Text as ThemedText } from "@/components/Themed";
import Trailer from "@/components/Trailer";
import { BANNER_AD_UNIT_ID } from "@/constants/AdUnits";
import { horizontalListProps } from "@/constants/HorizontalListProps";
import { removeSub, getGameReleaseDate } from "@/helpers/helpers";
import useAddRecent from "@/hooks/useAddRecent";
import { useGame } from "@/screens/Game/api/getGame";
import { useStore } from "@/stores/store";
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
  const navigation = useNavigation();
  const { game: gameString } = useLocalSearchParams();
  const game = gameString ? JSON.parse(gameString) : undefined;
  const { user, gameSubs, bottomSheetModalRef, isPro, proModalRef } =
    useStore();
  const countdownId = gameSubs.find((s) => s.game.id === game.id)?.documentID;
  const [detailIndex, setDetailIndex] = useState(0);
  const { data, isLoading } = useGame(game.id);
  const paddingBottom = useBottomTabOverflow();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="search"
            iconName={countdownId ? "checkmark-outline" : "add-outline"}
            onPress={() => {
              if (!countdownId) {
                bottomSheetModalRef.current?.present({
                  ...game,
                  release_dates: data?.release_dates,
                });
              } else {
                removeSub("gameReleases", countdownId, user!.uid);
              }
            }}
          />
        </HeaderButtons>
      ),
    });
  }, [bottomSheetModalRef, countdownId, game, navigation, user, data]);

  // Memoize object to avoid unnecessary recalculations and re-renders.
  // Improves performance by ensuring that the object is only recalculated when its dependencies change.
  const recentGame: Recent = useMemo(
    () => ({
      id: game.id,
      name: game.name,
      img_path: game.cover?.url ?? "",
      last_viewed: timestamp,
      media_type: "game",
    }),
    [game.cover?.url, game.id, game.name],
  );

  useAddRecent("recentGames", recentGame);

  return (
    <>
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
              { color: PlatformColor("secondaryLabel") },
            ]}
          >
            {getGameReleaseDate(data)}
          </Text>

          {!isPro && (
            <>
              <LargeBorderlessButton
                handlePress={async () => {
                  proModalRef.current?.present();
                  await analytics().logEvent("select_promotion", {
                    name: "Pro",
                    id: "com.lookforward.pro",
                  });
                }}
                text="Explore Pro Features"
                style={{ paddingBottom: 0 }}
              />
              <View style={{ alignItems: "center", paddingTop: 16 }}>
                <BannerAd
                  unitId={BANNER_AD_UNIT_ID}
                  size={BannerAdSize.BANNER}
                  requestOptions={{ requestNonPersonalizedAdsOnly: true }}
                />
              </View>
            </>
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
                  backgroundColor: PlatformColor(
                    "secondarySystemGroupedBackground",
                  ),
                  borderColor: PlatformColor(
                    "secondarySystemGroupedBackground",
                  ),
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
