import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import produce from "immer";
import { FirestoreGame } from "interfaces/firebase";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
  Fragment,
} from "react";
import {
  Platform,
  PlatformColor,
  ScrollView,
  View,
  FlatList,
  Text,
} from "react-native";
import FastImage from "react-native-fast-image";
import { useMMKVString } from "react-native-mmkv";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { useGame } from "./api/getGame";

import { BlueBullet } from "@/components/BlueBullet";
import ButtonSingleState from "@/components/ButtonSingleState";
import CategoryControl from "@/components/CategoryControl/CategoryControl";
import { ExpandableText } from "@/components/ExpandableText";
import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { Text as ThemedText } from "@/components/Themed";
import Trailer from "@/components/Trailer";
import { removeSub } from "@/helpers/helpers";
import { reusableStyles } from "@/helpers/styles";
import { horizontalListProps } from "@/screens/Movie/constants/horizontalListProps";
import { useStore } from "@/stores/store";
import { FindStackParamList, Recent, TabNavigationParamList } from "@/types";
import { timestamp, timestampToUTC } from "@/utils/dates";

type GameScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParamList, "Game">,
  BottomTabScreenProps<TabNavigationParamList, "FindTab">
>;

export default function Game({ navigation, route }: GameScreenNavigationProp) {
  const { game } = route.params;
  const [countdownId, setCountdownId] = useState<FirestoreGame["documentID"]>();
  const { user, gameSubs, bottomSheetModalRef, setGame } = useStore();
  const [detailIndex, setDetailIndex] = useState(0);
  const { data, isLoading } = useGame(game.id);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();

  const [storedGames, setStoredGames] = useMMKVString("recent.games");

  const composeRecentGames = useCallback(
    () => (storedGames ? (JSON.parse(storedGames) as Recent[]) : []),
    [storedGames]
  );

  function getReleaseDate(): string {
    // need to filter client-side since combining search and filter on API is not working
    const filteredDates = data?.release_dates.filter(
      (releaseDate) => releaseDate.region === 2 || releaseDate.region === 8
    );
    const uniqueDates = [...new Set(filteredDates?.map((date) => date.date))];
    if (uniqueDates.length === 1) {
      return timestampToUTC(uniqueDates[0])
        .toFormat("MMMM d, yyyy")
        .toUpperCase();
    } else {
      return "MULTIPLE DATES";
    }
  }

  useEffect(() => {
    const recentGame: Recent = {
      id: game.id,
      name: game.name,
      img_path: game.cover?.url ?? "",
      last_viewed: timestamp,
      media_type: "game",
    };

    const updatedRecentGames = produce(
      composeRecentGames(),
      (draft: Recent[]) => {
        const index = draft.findIndex((recent) => recent.id === game.id);
        if (index === -1) draft.unshift(recentGame);
        else {
          draft.splice(index, 1);
          draft.unshift(recentGame);
        }
      }
    );

    setStoredGames(JSON.stringify(updatedRecentGames));
  }, [composeRecentGames, game.cover?.url, game.id, game.name, setStoredGames]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: game.name,
      headerRight: () => (
        <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
          <Item
            title="search"
            iconName={countdownId ? "checkmark-outline" : "add-outline"}
            onPress={() => {
              if (!countdownId) {
                setGame(game);
                bottomSheetModalRef.current?.present();
              } else {
                removeSub("gameReleases", countdownId, user!.uid);
              }
            }}
          />
        </HeaderButtons>
      ),
    });
  }, [bottomSheetModalRef, countdownId, game, navigation, setGame, user]);

  useEffect(() => {
    const documentID = gameSubs.find(
      (releaseDate) => releaseDate.game.id === game.id
    )?.documentID;

    setCountdownId(documentID);
  }, [game.id, gameSubs]);

  return (
    <ScrollView
      contentContainerStyle={
        Platform.OS === "ios"
          ? { paddingTop: headerHeight, paddingBottom: tabBarheight }
          : undefined
      }
      scrollIndicatorInsets={
        Platform.OS === "ios" ? { bottom: tabBarheight - 16 } : undefined
      }
    >
      {game?.cover?.url && (
        <FastImage
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
        <Text style={reusableStyles.date}>{getReleaseDate()}</Text>

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
              onPress={() => navigation.push("GameDiscover", { genre })}
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
            {data.involved_companies?.find((company) => company.publisher) && (
              <ThemedText style={{ ...iOSUIKit.bodyObject, paddingTop: 16 }}>
                Published by:
                {data.involved_companies
                  .filter((company) => company.publisher)
                  .map((company, i) => (
                    <Fragment key={i}>
                      {i > 0
                        ? `, ${company.company.name}`
                        : ` ${company.company.name}`}
                    </Fragment>
                  ))}
              </ThemedText>
            )}
            {data.involved_companies?.find((company) => company.developer) && (
              <ThemedText style={{ ...iOSUIKit.bodyObject, paddingTop: 16 }}>
                Developed by:
                {data.involved_companies
                  .filter((company) => company.developer)
                  .map((company, i) => (
                    <Fragment key={i}>
                      {i > 0
                        ? `, ${company.company.name}`
                        : ` ${company.company.name}`}
                    </Fragment>
                  ))}
              </ThemedText>
            )}
            {data.involved_companies?.find((company) => company.supporting) && (
              <View
                style={{
                  flexDirection: "row",
                  paddingTop: 16,
                  flexWrap: "wrap",
                }}
              >
                <ThemedText style={iOSUIKit.body}>Supported by: </ThemedText>
                {data.involved_companies
                  .filter((company) => company.supporting)
                  .map((company, i) => (
                    <View style={{ flexDirection: "row" }} key={i}>
                      {i > 0 && <BlueBullet />}
                      <ThemedText style={iOSUIKit.body}>
                        {company.company.name}
                      </ThemedText>
                    </View>
                  ))}
              </View>
            )}
          </>
        )}
        {detailIndex === 1 &&
          !isLoading &&
          (data.videos ? (
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
