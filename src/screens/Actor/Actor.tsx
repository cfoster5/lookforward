import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useRef, useState } from "react";
import { Dimensions, FlatList, Platform, Text, View } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import Carousel from "react-native-snap-carousel";
import { iOSUIKit } from "react-native-typography";
import { PersonMovieCast, PersonMovieCrew } from "tmdb-ts";

import { usePerson } from "./api/getPerson";
import { CarouselItem } from "./components/CarouselItem";

import ButtonMultiState from "@/components/ButtonMultiState";
import { ExpandableText } from "@/components/ExpandableText";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { Text as ThemedText } from "@/components/Themed";
import { calculateWidth } from "@/helpers/helpers";
import { reusableStyles } from "@/helpers/styles";
import { useComposeRecentItems } from "@/hooks/useComposeRecentItems";
import { useUpdateRecentItems } from "@/hooks/useUpdateRecentItems";
import { FindStackParams, BottomTabParams, Recent } from "@/types";
import { dateToFullLocale, timestamp } from "@/utils/dates";

type ActorScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParams, "Actor">,
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParams, "FindTabStack">,
    BottomTabScreenProps<BottomTabParams, "CountdownTabStack">
  >
>;

const width = 200;
const horizontalMargin = 4;

function sortReleaseDates(
  a: PersonMovieCast | PersonMovieCrew,
  b: PersonMovieCast | PersonMovieCrew
) {
  if (Platform.OS === "ios")
    return b.release_date?.localeCompare(a.release_date);
  else {
    if (b.release_date !== a.release_date) {
      return b.release_date < a.release_date ? -1 : 1;
    } else {
      return 0;
    }
  }
}

function Actor({ route, navigation }: ActorScreenNavigationProp) {
  // const person = useGetPerson(route.params.personId);
  const { personId, name } = route.params;
  const { data: person, isLoading } = usePerson(route.params.personId);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const ref = useRef<Carousel<any>>(null);
  const [selectedJob, setSelectedJob] = useState("Actor");

  const [storedPeople, setStoredPeople] = useMMKVString("recent.people");
  const composeRecentPeople = useComposeRecentItems(storedPeople);

  const recentPerson: Recent = {
    id: personId,
    name,
    img_path: person?.profile_path,
    last_viewed: timestamp,
  };

  useUpdateRecentItems(composeRecentPeople, recentPerson, setStoredPeople, [
    personId,
    person?.profile_path,
  ]);

  function returnData() {
    if (selectedJob === "Actor") {
      return person?.movie_credits.cast.sort(sortReleaseDates);
    } else {
      return person?.movie_credits.crew
        .filter((credit) => credit.job === selectedJob)
        .sort(sortReleaseDates);
    }
  }

  if (isLoading) return <LoadingScreen />;

  return (
    <FlatList
      data={returnData()}
      renderItem={({ item }) => (
        <MoviePoster
          key={item.id.toString()}
          pressHandler={() =>
            navigation.push("Movie", {
              movieId: item.id,
              name: item.title,
            })
          }
          movie={item}
          posterPath={item.poster_path}
          style={{
            width: calculateWidth(16, 16, 2),
            height: calculateWidth(16, 16, 2) * 1.5,
          }}
        />
      )}
      keyExtractor={(item, index) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={[
        {
          marginHorizontal: 16,
        },
        Platform.OS === "ios"
          ? { paddingTop: headerHeight, paddingBottom: tabBarheight }
          : undefined,
      ]}
      columnWrapperStyle={{
        justifyContent: "space-between",
        marginBottom: 16,
      }}
      scrollIndicatorInsets={
        Platform.OS === "ios"
          ? {
              bottom: tabBarheight - 16,
            }
          : undefined
      }
      // do not use arrow functions for header and footer components
      // fixed issue where carousel would re-render
      // https://stackoverflow.com/a/70232246/5648619
      ListHeaderComponent={
        <>
          {person?.images?.profiles && (
            <Carousel
              vertical={false}
              ref={ref}
              data={person?.images?.profiles}
              renderItem={({ item }) => (
                <CarouselItem
                  item={item}
                  width={width}
                  horizontalMargin={horizontalMargin}
                />
              )}
              layout="default"
              loop
              sliderWidth={Dimensions.get("window").width}
              itemWidth={width + horizontalMargin * 2}
              // removeClippedSubviews={true}
              containerCustomStyle={{
                marginVertical: 16,
                marginHorizontal: -16,
              }}
            />
          )}
          <ThemedText style={iOSUIKit.largeTitleEmphasized}>
            {person?.name}
          </ThemedText>
          {person?.birthday && (
            <Text style={reusableStyles.date}>
              {dateToFullLocale(person?.birthday).toUpperCase()}
            </Text>
          )}
          <ExpandableText text={person!.biography} />
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
              .sort((a, b) => {
                const jobA = a.job.toLowerCase();
                const jobB = b.job.toLowerCase();
                if (Platform.OS === "ios") return jobA.localeCompare(jobB);
                else {
                  if (jobA !== jobB) {
                    return jobA < jobB ? -1 : 1;
                  } else {
                    return 0;
                  }
                }
              })
              .map((credit, i) => (
                <ButtonMultiState
                  key={i}
                  text={credit.job}
                  selectedVal={selectedJob}
                  onPress={() => setSelectedJob(credit.job)}
                />
              ))}
          </View>
        </>
      }
    />
  );
}

export default Actor;
