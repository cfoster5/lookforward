import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { FirestoreGame } from "interfaces/firebase";
import { useEffect, useLayoutEffect, useState, Fragment, useMemo } from "react";
import { PlatformColor, ScrollView, View, FlatList, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { useGame } from "./api/getGame";

import ButtonSingleState from "@/components/ButtonSingleState";
import CategoryControl from "@/components/CategoryControl/CategoryControl";
import { ExpandableText } from "@/components/ExpandableText";
import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { Text as ThemedText } from "@/components/Themed";
import Trailer from "@/components/Trailer";
import { horizontalListProps } from "@/constants/HorizontalListProps";
import { removeSub, getGameReleaseDate } from "@/helpers/helpers";
import { useStore } from "@/stores/store";
import { FindStackParamList, Recent, TabNavigationParamList } from "@/types";
import { timestamp } from "@/utils/dates";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";
import { useRecentMoviesStore } from "@/stores/recents";
import useAddRecent from "@/hooks/useAddRecent";

type GameScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParamList, "Game">,
  BottomTabScreenProps<TabNavigationParamList, "FindTab">
>;

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

export default function Game({ navigation, route }: GameScreenNavigationProp) {
  const { game } = route.params;
  const [countdownId, setCountdownId] = useState<FirestoreGame["documentID"]>();
  const { user, gameSubs, bottomSheetModalRef } = useStore();
  const [detailIndex, setDetailIndex] = useState(0);
  const { data, isLoading } = useGame(game.id);
  const paddingBottom = useBottomTabOverflow();
  const { addRecent } = useRecentMoviesStore();

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

  useEffect(() => {
    const documentID = gameSubs.find(
      (releaseDate) => releaseDate.game.id === game.id,
    )?.documentID;

    setCountdownId(documentID);
  }, [game.id, gameSubs]);

  return (
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
                navigation.push("GameDiscover", {
                  genre,
                  screenTitle: genre.name,
                })
              }
              buttonStyle={{
                backgroundColor: PlatformColor("systemGray5"),
                borderColor: PlatformColor("systemGray5"),
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
  );
}
