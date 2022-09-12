import React, { Fragment, useState } from "react";
import { Dimensions, Platform, ScrollView, Text, View } from "react-native";
import { Image } from "react-native-elements";
import { iOSUIKit } from "react-native-typography";
import {
  BottomTabNavigationProp,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeNavigationProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { BlueBullet } from "components/BlueBullet";
import ButtonSingleState from "components/ButtonSingleState";
import CategoryControl from "components/CategoryControl/CategoryControl";
import { ExpandableText } from "components/ExpandableText";
import { Text as ThemedText } from "components/Themed";
import Trailer from "components/Trailer";
import { reusableStyles } from "helpers/styles";
import { IGDB } from "interfaces/igdb";
import { Navigation } from "interfaces/navigation";
import { DateTime } from "luxon";

interface Props {
  navigation: CompositeNavigationProp<
    StackNavigationProp<Navigation.FindStackParamList, "Game">,
    BottomTabNavigationProp<Navigation.TabNavigationParamList, "FindTab">
  >;
  game: IGDB.Game.Game;
}

function GameDetails({ navigation, game }: Props) {
  const [detailIndex, setDetailIndex] = useState(0);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [showAllOverview, setShowAllOverview] = useState(false);

  function getReleaseDate(): string {
    let filteredDates = game.release_dates.filter(
      (releaseDate) => releaseDate.region === 2 || releaseDate.region === 8
    );
    let uniqueDates = [...new Set(filteredDates.map((date) => date.date))];
    if (uniqueDates.length === 1) {
      return DateTime.fromSeconds(uniqueDates[0])
        .toUTC()
        .toFormat("MMMM d, yyyy")
        .toUpperCase();
    } else {
      return "MULTIPLE DATES";
    }
  }

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
        <Image
          style={{
            width: Dimensions.get("window").width,
            height: (720 / 1280) * Dimensions.get("window").width,
          }}
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

        <ExpandableText
          isExpanded={showAllOverview}
          pressHandler={() => setShowAllOverview(!showAllOverview)}
          text={game.summary}
        />

        <View
          style={{
            flexDirection: "row",
            paddingBottom: 16,
            flexWrap: "wrap",
          }}
        >
          {game?.genres?.map((genre, i) => (
            <ButtonSingleState
              key={i}
              text={genre.name}
              onPress={() => navigation.push("GameDiscover", { genre: genre })}
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
        {detailIndex === 0 && (
          <>
            {game.involved_companies?.find((company) => company.publisher) && (
              <ThemedText style={{ ...iOSUIKit.bodyObject, paddingTop: 16 }}>
                Published by:
                {game.involved_companies
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
            {game.involved_companies?.find((company) => company.developer) && (
              <ThemedText style={{ ...iOSUIKit.bodyObject, paddingTop: 16 }}>
                Developed by:
                {game.involved_companies
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
            {game.involved_companies?.find((company) => company.supporting) && (
              <View
                style={{
                  flexDirection: "row",
                  paddingTop: 16,
                  flexWrap: "wrap",
                }}
              >
                <ThemedText style={iOSUIKit.body}>Supported by: </ThemedText>
                {game.involved_companies
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
          (game.videos ? (
            game.videos.map((video, i) => (
              <Trailer key={i} video={video} index={i} />
            ))
          ) : (
            <ThemedText style={{ ...iOSUIKit.bodyObject, paddingTop: 16 }}>
              No trailers yet! Come back later!
            </ThemedText>
          ))}
      </View>
    </ScrollView>
  );
}

export default GameDetails;