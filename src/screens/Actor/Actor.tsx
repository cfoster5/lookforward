import {
  BottomTabScreenProps,
  useBottomTabBarHeight,
} from "@react-navigation/bottom-tabs";
import { useHeaderHeight } from "@react-navigation/elements";
import { CompositeScreenProps } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Image } from "expo-image";
import produce from "immer";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  FlatList,
  Platform,
  PlatformColor,
  Text,
  View,
} from "react-native";
import { useMMKVString } from "react-native-mmkv";
import Carousel from "react-native-snap-carousel";
import { iOSUIKit } from "react-native-typography";

import { usePerson } from "./api/getPerson";
import { PosterSizes } from "../../interfaces/tmdb/configuration";

import ButtonMultiState from "@/components/ButtonMultiState";
import { ExpandableText } from "@/components/ExpandableText";
import { LoadingScreen } from "@/components/LoadingScreen";
import { MoviePoster } from "@/components/Posters/MoviePoster";
import { Text as ThemedText } from "@/components/Themed";
import { dateToLocaleString } from "@/helpers/formatting";
import { calculateWidth } from "@/helpers/helpers";
import { reusableStyles } from "@/helpers/styles";
import { FindStackParams, BottomTabParams, Recent } from "@/types";
import { timestamp } from "@/utils/dates";

type ActorScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<FindStackParams, "Actor">,
  CompositeScreenProps<
    BottomTabScreenProps<BottomTabParams, "FindTabStack">,
    BottomTabScreenProps<BottomTabParams, "CountdownTabStack">
  >
>;

function Actor({ route, navigation }: ActorScreenNavigationProp) {
  // const person = useGetPerson(route.params.personId);
  const { personId, name, profile_path } = route.params;
  const { data: person, isLoading } = usePerson(route.params.personId);
  const tabBarheight = useBottomTabBarHeight();
  const headerHeight = useHeaderHeight();
  const ref = useRef<Carousel<any>>(null);
  const width = 200;
  const horizontalMargin = 4;
  const [selectedJob, setSelectedJob] = useState("Actor");

  useLayoutEffect(() => {
    navigation.setOptions({ title: person?.name });
  }, [navigation, person]);

  const [storedPeople, setStoredPeople] = useMMKVString("recent.people");

  const composeRecentPeople = useCallback(
    () => (storedPeople ? (JSON.parse(storedPeople) as Recent[]) : []),
    [storedPeople]
  );

  useEffect(() => {
    const recentPerson: Recent = {
      id: personId,
      name,
      img_path: profile_path,
      last_viewed: timestamp,
    };

    const updatedRecentMovies = produce(
      composeRecentPeople(),
      (draft: Recent[]) => {
        console.log("draft", draft);
        const index = draft.findIndex((person) => person.id === personId);
        if (index === -1) draft.unshift(recentPerson);
        else {
          draft.splice(index, 1);
          draft.unshift(recentPerson);
        }
      }
    );

    setStoredPeople(JSON.stringify(updatedRecentMovies));
  }, [composeRecentPeople, name, personId, profile_path, setStoredPeople]);

  function RenderItem({ item, index }: { item: any; index: number }) {
    return (
      <Image
        source={{
          uri: `https://image.tmdb.org/t/p/${PosterSizes.W300}${item.file_path}`,
        }}
        style={{
          borderRadius: 8,
          borderColor: PlatformColor("systemGray6"),
          borderWidth: 1,
          width,
          height: width * 1.5,
          paddingHorizontal: horizontalMargin,
        }}
      />
    );
  }

  function returnData() {
    if (selectedJob === "Actor") {
      return (
        person?.movie_credits.cast
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
      );
    } else {
      return (
        person?.movie_credits.crew
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
      );
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
              movieTitle: item.title,
              poster_path: item.poster_path,
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
              ref={ref}
              data={person?.images?.profiles}
              renderItem={RenderItem}
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
              {dateToLocaleString(person?.birthday)}
            </Text>
          )}
          <ExpandableText text={person.biography} />
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
        </>
      }
    />
  );
}

export default Actor;
