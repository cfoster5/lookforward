import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useLayoutEffect, useRef, useState } from "react";
import { Dimensions, FlatList, Platform, Text, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { iOSUIKit } from "react-native-typography";
import { PersonMovieCast, PersonMovieCrew } from "tmdb-ts";

import ButtonMultiState from "@/components/ButtonMultiState";
import { ExpandableText } from "@/components/ExpandableText";
import { DynamicShareHeader } from "@/components/Headers";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { Text as ThemedText } from "@/components/Themed";
import { calculateWidth } from "@/helpers/helpers";
import { reusableStyles } from "@/helpers/styles";
import { useRecentItemsStore } from "@/stores/recents";
import { FindStackParams, BottomTabParams } from "@/types";
import { dateToFullLocale, timestamp } from "@/utils/dates";
import { useBottomTabOverflow } from "@/utils/useBottomTabOverflow";

import { usePerson } from "./api/getPerson";
import { CarouselItem } from "./components/CarouselItem";

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
  b: PersonMovieCast | PersonMovieCrew,
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

// Filter and sort the crew credits by job, ensuring each job appears only once.
function getUniqueSortedCrewJobs(crew?: PersonMovieCrew[]) {
  return crew
    ?.reduce((acc: PersonMovieCrew[], v) => {
      if (!acc.some((t) => t.job === v.job)) {
        acc.push(v);
      }
      return acc;
    }, [])
    .sort((a, b) =>
      a.job.localeCompare(b.job, undefined, {
        sensitivity: "base",
      }),
    );
}

function Actor({ route, navigation }: ActorScreenNavigationProp) {
  const { personId, name } = route.params;
  const { data: person, isLoading } = usePerson(route.params.personId);
  const paddingBottom = useBottomTabOverflow();
  const ref = useRef<Carousel<any>>(null);
  const [selectedJob, setSelectedJob] = useState("Actor");
  const { addRecent } = useRecentItemsStore();

  useLayoutEffect(() => {
    navigation.setOptions({
      // eslint-disable-next-line react/no-unstable-nested-components
      headerRight: () => (
        <DynamicShareHeader
          title={name}
          urlSegment={`person/${personId}?name=${name}`}
        />
      ),
    });
  }, [name, navigation, personId]);

  const castCredits = person?.movie_credits.cast.sort(sortReleaseDates);
  const crewCredits = person?.movie_credits.crew
    .filter((credit) => credit.job === selectedJob)
    .sort(sortReleaseDates);

  if (isLoading) return <LoadingScreen />;

  return (
    <FlatList
      data={selectedJob === "Actor" ? castCredits : crewCredits}
      renderItem={({ item }) => (
        <MoviePoster
          key={item.id.toString()}
          pressHandler={() => {
            navigation.push("Movie", {
              movieId: item.id,
              name: item.title,
            });
            addRecent("recentMovies", {
              id: item.id,
              name: item.title,
              img_path: item.poster_path,
              last_viewed: timestamp,
              media_type: "movie",
            });
          }}
          movie={item}
          posterPath={item.poster_path}
          style={{
            width: calculateWidth(16, 16, 2),
            aspectRatio: 2 / 3,
          }}
        />
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      automaticallyAdjustsScrollIndicatorInsets
      contentInsetAdjustmentBehavior="automatic"
      contentInset={{ bottom: paddingBottom }}
      scrollIndicatorInsets={{ bottom: paddingBottom }}
      contentContainerStyle={{
        marginHorizontal: 16,
      }}
      columnWrapperStyle={{
        justifyContent: "space-between",
        marginBottom: 16,
      }}
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
            {getUniqueSortedCrewJobs(person?.movie_credits.crew)?.map(
              (credit) => (
                <ButtonMultiState
                  key={credit.id}
                  text={credit.job}
                  selectedVal={selectedJob}
                  onPress={() => setSelectedJob(credit.job)}
                />
              ),
            )}
          </View>
        </>
      }
    />
  );
}

export default Actor;
