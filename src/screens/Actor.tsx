import React, { useContext, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import FastImage from "react-native-fast-image";
import Carousel from "react-native-snap-carousel";
import { iOSUIKit } from "react-native-typography";
import {
  BottomTabNavigationProp,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeNavigationProp, RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { DateTime } from "luxon";

import ButtonMultiState from "../components/ButtonMultiState";
import Poster from "../components/Poster";
import { Text as ThemedText } from "../components/Themed";
import { reusableStyles } from "../helpers/styles";
import { getPerson } from "../helpers/tmdbRequests";
import { Navigation } from "../interfaces/navigation";
import { TMDB } from "../interfaces/tmdb";

interface Props {
  // navigation:
  //   | StackNavigationProp<Navigation.FindStackParamList, "Actor">
  //   | StackNavigationProp<Navigation.CountdownStackParamList, "Actor">;
  navigation:
    | CompositeNavigationProp<
        StackNavigationProp<Navigation.FindStackParamList, "Find" | "Details">,
        BottomTabNavigationProp<Navigation.TabNavigationParamList, "FindTab">
      >
    | CompositeNavigationProp<
        StackNavigationProp<Navigation.CountdownStackParamList, "Details">,
        BottomTabNavigationProp<
          Navigation.TabNavigationParamList,
          "CountdownTab"
        >
      >;
  route:
    | RouteProp<Navigation.FindStackParamList, "Actor">
    | RouteProp<Navigation.CountdownStackParamList, "Actor">;
}

function Actor({ route, navigation }: Props) {
  const [details, setDetails] = useState<TMDB.Person.Person>();
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const ref = useRef<Carousel<any>>(null);
  const width = 200;
  const horizontalMargin = 4;
  const [showBio, setShowBio] = useState(false);
  const [selectedJob, setSelectedJob] = useState("Actor");

  useEffect(() => {
    setDetails(undefined);
    async function getData() {
      const details = await getPerson(route.params.personId);
      navigation.setOptions({ title: details.name });
      setDetails(details);
    }
    getData();
  }, [route.params.personId]);

  function getBirthday(): string {
    return DateTime.fromFormat(details?.birthday as string, "yyyy-MM-dd")
      .toFormat("MMMM d, yyyy")
      .toUpperCase();
  }

  function RenderItem({ item, index }: { item: any; index: number }) {
    return (
      <FastImage
        source={{
          uri: `https://image.tmdb.org/t/p/w300${item.file_path}`,
        }}
        style={{
          borderRadius: 8,
          borderColor: "#1f1f1f",
          borderWidth: 1,
          width: width,
          height: width * 1.5,
          paddingHorizontal: horizontalMargin,
        }}
      />
    );
  }

  return details ? (
    <ScrollView
      contentContainerStyle={
        Platform.OS === "ios"
          ? {
              paddingTop: headerHeight,
              paddingBottom: tabBarheight - 16,
            }
          : undefined
      }
      scrollIndicatorInsets={
        Platform.OS === "ios"
          ? {
              bottom: tabBarheight - 16,
            }
          : undefined
      }
    >
      {details?.images?.profiles && (
        <Carousel
          ref={ref}
          data={details?.images?.profiles}
          renderItem={RenderItem}
          layout={"default"}
          loop={true}
          sliderWidth={Dimensions.get("window").width}
          itemWidth={width + horizontalMargin * 2}
          // removeClippedSubviews={true}
          containerCustomStyle={{ marginTop: 16 }}
        />
      )}
      <View
        style={
          Platform.OS === "ios"
            ? { margin: 16 }
            : { marginTop: 16, marginHorizontal: 16 }
        }
      >
        <ThemedText style={iOSUIKit.largeTitleEmphasized}>
          {details?.name}
        </ThemedText>
        {details?.birthday && (
          <Text style={reusableStyles.date}>{getBirthday()}</Text>
        )}
        <Pressable onPress={() => setShowBio(!showBio)}>
          <ThemedText
            style={{ ...iOSUIKit.bodyObject, paddingTop: 16 }}
            numberOfLines={showBio ? undefined : 4}
          >
            {details?.biography
              ? details?.biography
              : "No biography yet! Come back later!"}
          </ThemedText>
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            paddingBottom: 16,
            flexWrap: "wrap",
          }}
        >
          <ButtonMultiState
            text="Actor"
            selectedVal={selectedJob}
            onPress={() => setSelectedJob("Actor")}
          />
          {details?.movie_credits.crew
            .filter((v, i, a) => a.findIndex((t) => t.job === v.job) === i)
            .sort((a, b) =>
              a.job.toLowerCase().localeCompare(b.job.toLowerCase())
            )
            .map((credit, i) => (
              <ButtonMultiState
                key={i}
                text={credit.job}
                selectedVal={selectedJob}
                onPress={() => setSelectedJob(credit.job)}
              />
            ))}
        </View>
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-between",
          }}
        >
          {selectedJob === "Actor"
            ? details?.movie_credits.cast
                .sort((a, b) => b.release_date?.localeCompare(a.release_date))
                .map((credit, i) => (
                  <View key={i} style={{ paddingBottom: 16 }}>
                    <Poster navigation={navigation} movie={credit} />
                  </View>
                ))
            : details?.movie_credits.crew
                .filter((credit) => credit.job === selectedJob)
                .sort((a, b) => b.release_date?.localeCompare(a.release_date))
                .map((credit, i) => (
                  <View key={i} style={{ paddingBottom: 16 }}>
                    <Poster navigation={navigation} movie={credit} />
                  </View>
                ))}
        </View>
      </View>
    </ScrollView>
  ) : (
    <View style={{ flex: 1, justifyContent: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

export default Actor;
