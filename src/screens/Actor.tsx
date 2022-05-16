import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
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
import { MoviePoster } from "../components/Posters/MoviePoster";
import { Text as ThemedText } from "../components/Themed";
import { reusableStyles } from "../helpers/styles";
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

function useGetPerson(personId: number) {
  const [person, setPerson] = useState();

  useEffect(() => {
    async function getPerson() {
      const response = await fetch(
        `https://api.themoviedb.org/3/person/${personId}?api_key=68991fbb0b75dba5ae0ecd8182e967b1&language=en-US&append_to_response=movie_credits,images`
      );
      const json = await response.json();
      setPerson(json);
    }
    getPerson();
  }, [personId]);

  return person;
}

function Actor({ route, navigation }: Props) {
  const person = useGetPerson(route.params.personId);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const ref = useRef<Carousel<any>>(null);
  const width = 200;
  const horizontalMargin = 4;
  const [showBio, setShowBio] = useState(false);
  const [selectedJob, setSelectedJob] = useState("Actor");

  useLayoutEffect(() => {
    navigation.setOptions({ title: person?.name });
  }, [person]);

  function getBirthday(): string {
    return DateTime.fromFormat(person?.birthday as string, "yyyy-MM-dd")
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

  return person ? (
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
      {person?.images?.profiles && (
        <Carousel
          ref={ref}
          data={person?.images?.profiles}
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
          {person?.name}
        </ThemedText>
        {person?.birthday && (
          <Text style={reusableStyles.date}>{getBirthday()}</Text>
        )}
        <Pressable onPress={() => setShowBio(!showBio)}>
          <ThemedText
            style={{ ...iOSUIKit.bodyObject, paddingTop: 16 }}
            numberOfLines={showBio ? undefined : 4}
          >
            {person?.biography
              ? person?.biography
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
          {person?.movie_credits.crew
            .filter((v, i, a) => a.findIndex((t) => t.job === v.job) === i)
            // .sort((a, b) =>
            //   a.job.toLowerCase().localeCompare(b.job.toLowerCase())
            // )
            .sort((a, b) =>
              Platform.OS === "ios"
                ? a.job.toLowerCase().localeCompare(b.job.toLowerCase())
                : a.job.toLowerCase() !== b.job.toLowerCase()
                ? a.job.toLowerCase() < b.job.toLowerCase()
                  ? -1
                  : 1
                : 0
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
            ? person?.movie_credits.cast
                // .sort((a, b) => b.release_date?.localeCompare(a.release_date))
                .sort((a, b) =>
                  Platform.OS === "ios"
                    ? b.release_date?.localeCompare(a.release_date)
                    : b.release_date !== a.release_date
                    ? b.release_date < a.release_date
                      ? -1
                      : 1
                    : 0
                )
                .map((credit, i) => (
                  <Pressable
                    key={i}
                    style={{ marginBottom: 16 }}
                    onPress={() => navigation.push("Movie", { movie: credit })}
                  >
                    <MoviePoster movie={credit} />
                  </Pressable>
                ))
            : person?.movie_credits.crew
                .filter((credit) => credit.job === selectedJob)
                // .sort((a, b) => b.release_date?.localeCompare(a.release_date))
                .sort((a, b) =>
                  Platform.OS === "ios"
                    ? b.release_date?.localeCompare(a.release_date)
                    : b.release_date !== a.release_date
                    ? b.release_date < a.release_date
                      ? -1
                      : 1
                    : 0
                )
                .map((credit, i) => (
                  <Pressable
                    key={i}
                    style={{ marginBottom: 16 }}
                    onPress={() => navigation.push("Movie", { movie: credit })}
                  >
                    <MoviePoster movie={credit} />
                  </Pressable>
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
