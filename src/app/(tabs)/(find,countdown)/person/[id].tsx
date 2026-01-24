import { Stack, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import { Dimensions, FlatList, Platform, Text, View } from "react-native";
import Carousel from "react-native-snap-carousel";
import { iOSUIKit } from "react-native-typography";
import { PersonMovieCast, PersonMovieCrew } from "tmdb-ts";

import ButtonMultiState from "@/components/ButtonMultiState";
import { ExpandableText } from "@/components/ExpandableText";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { Text as ThemedText } from "@/components/Themed";
import { calculateWidth } from "@/helpers/helpers";
import { reusableStyles } from "@/helpers/styles";
import useAddRecent from "@/hooks/useAddRecent";
import { usePerson } from "@/screens/Actor/api/getPerson";
import { CarouselItem } from "@/screens/Actor/components/CarouselItem";
import { dateToFullLocale, timestamp } from "@/utils/dates";
import { onShare } from "@/utils/share";

const width = 200;
const horizontalMargin = 4;
const spacing = 16;

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

export default function Actor() {
  const { id } = useLocalSearchParams();
  const { data: person, isLoading } = usePerson(id);
  const ref = useRef<Carousel<any>>(null);
  const [selectedJob, setSelectedJob] = useState("Actor");

  const recentPerson: Recent = {
    id: id,
    name: person?.name,
    img_path: person?.profile_path,
    last_viewed: timestamp,
  };

  useAddRecent("recentPeople", recentPerson);

  const castCredits = person?.movie_credits.cast.sort(sortReleaseDates);
  const crewCredits = person?.movie_credits.crew
    .filter((credit) => credit.job === selectedJob)
    .sort(sortReleaseDates);

  if (isLoading) return <LoadingScreen />;

  return (
    <>
      {/* Set title for back navigation but set to transparent to hide title */}
      <Stack.Screen.Title style={{ color: "transparent" }}>
        {person?.name}
      </Stack.Screen.Title>
      <Stack.Toolbar placement="right">
        <Stack.Toolbar.Button
          onPress={() => onShare(`person/${id}`, "headerButton")}
        >
          <Stack.Toolbar.Icon sf="square.and.arrow.up" />
        </Stack.Toolbar.Button>
      </Stack.Toolbar>
      <FlatList
        data={selectedJob === "Actor" ? castCredits : crewCredits}
        renderItem={({ item, index }) => (
          <MoviePoster
            key={item.id.toString()}
            movie={item}
            posterPath={item.poster_path}
            style={{
              width: calculateWidth(spacing, spacing, 2),
              aspectRatio: 2 / 3,
            }}
            buttonStyle={{
              marginRight: index % 2 === 0 ? spacing / 2 : 0,
              marginLeft: index % 2 === 1 ? spacing / 2 : 0,
            }}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        automaticallyAdjustsScrollIndicatorInsets
        contentInsetAdjustmentBehavior="automatic"
        // contentInset={{ bottom: paddingBottom }}
        // scrollIndicatorInsets={{ bottom: paddingBottom }}
        contentContainerStyle={{
          marginHorizontal: spacing,
        }}
        columnWrapperStyle={{
          justifyContent: "space-between",
          marginBottom: spacing,
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
                    key={credit.job}
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
    </>
  );
}
