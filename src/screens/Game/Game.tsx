import { getAnalytics } from "@react-native-firebase/analytics";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import { useLayoutEffect, useState, Fragment } from "react";
import { PlatformColor, ScrollView, View, FlatList, Text } from "react-native";
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
import { horizontalListProps } from "@/constants/HorizontalListProps";
import { removeSub, getGameReleaseDate } from "@/helpers/helpers";
import { useStore } from "@/stores/store";
import { FindStackParamList, TabNavigationParamList } from "@/types";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

import { useGame } from "./api/getGame";

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
            <LargeBorderlessButton
              handlePress={async () => {
                proModalRef.current?.present();
                await getAnalytics().logEvent("select_promotion", {
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
                  navigation.push("GameDiscover", {
                    genre,
                    screenTitle: genre.name,
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
