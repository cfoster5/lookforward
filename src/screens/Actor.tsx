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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Carousel from "react-native-snap-carousel";
import { iOSUIKit } from "react-native-typography";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp, useHeaderHeight } from "@react-navigation/stack";

import ButtonMultiState from "../components/ButtonMultiState";
import Poster from "../components/Poster";
import TabStackContext from "../contexts/TabStackContext";
import { months } from "../helpers/helpers";
import { reusableStyles } from "../helpers/styles";
import { getPerson } from "../helpers/tmdbRequests";
import { Navigation } from "../interfaces/navigation";
import { TMDB } from "../interfaces/tmdb";

interface Props {
  navigation: StackNavigationProp<Navigation.FindStackParamList, "Actor">;
  route: RouteProp<Navigation.FindStackParamList, "Actor">;
}

function Actor({ route, navigation }: Props) {
  const [details, setDetails] = useState<TMDB.Person>();
  const { theme } = useContext(TabStackContext);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const [initHeaderHeight, setInitHeaderHeight] = useState(0);
  const insets = useSafeAreaInsets();
  const ref = useRef<Carousel<any>>(null);
  const width = 200;
  const horizontalMargin = 4;
  const [showBio, setShowBio] = useState(false);
  const [selectedJob, setSelectedJob] = useState("Actor");

  useEffect(() => {
    if (initHeaderHeight === 0) {
      setInitHeaderHeight(headerHeight);
    }
  }, [headerHeight]);

  useEffect(() => {
    setDetails(undefined);
    navigation.setOptions({ title: route.params.name });
    getPerson(route.params.id).then((details) => {
      setDetails(details);
    });
  }, [route.params]);

  function getBirthday(): string {
    let monthIndex = new Date(details?.birthday as string).getUTCMonth();
    return `${months[monthIndex].toUpperCase()} ${new Date(
      details?.birthday as string
    ).getUTCDate()}, ${new Date(details?.birthday as string).getUTCFullYear()}`;
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

  return (
    <>
      {details ? (
        <ScrollView
          contentContainerStyle={
            Platform.OS === "ios"
              ? {
                  paddingTop: initHeaderHeight,
                  paddingBottom: tabBarheight - 16,
                }
              : undefined
          }
          scrollIndicatorInsets={
            Platform.OS === "ios"
              ? {
                  top: initHeaderHeight - insets.top,
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
            <Text
              style={
                theme === "dark"
                  ? iOSUIKit.largeTitleEmphasizedWhite
                  : iOSUIKit.largeTitleEmphasized
              }
            >
              {details?.name}
            </Text>
            {details?.birthday && (
              <Text style={reusableStyles.date}>{getBirthday()}</Text>
            )}
            <Pressable onPress={() => setShowBio(!showBio)}>
              <Text
                style={
                  theme === "dark"
                    ? { ...iOSUIKit.bodyWhiteObject, paddingTop: 16 }
                    : { ...iOSUIKit.bodyObject, paddingTop: 16 }
                }
                numberOfLines={showBio ? undefined : 4}
              >
                {details?.biography
                  ? details?.biography
                  : "No biography yet! Come back later!"}
              </Text>
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
                .sort((a, b) => b.job < a.job)
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
                    .sort(
                      (a, b) =>
                        new Date(b.release_date) - new Date(a.release_date)
                    )
                    .map((credit, i) => (
                      <View key={i} style={{ paddingBottom: 16 }}>
                        <Poster
                          navigation={navigation}
                          data={credit}
                          categoryIndex={0}
                        />
                      </View>
                    ))
                : details?.movie_credits.crew
                    .filter((credit) => credit.job === selectedJob)
                    .sort(
                      (a, b) =>
                        new Date(b.release_date) - new Date(a.release_date)
                    )
                    .map((credit, i) => (
                      <View key={i} style={{ paddingBottom: 16 }}>
                        <Poster
                          navigation={navigation}
                          data={credit}
                          categoryIndex={0}
                        />
                      </View>
                    ))}
            </View>
          </View>
        </ScrollView>
      ) : (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </>
  );
}

export default Actor;
