import BottomSheet, {
  BottomSheetTextInput,
  useBottomSheetDynamicSnapPoints,
} from "@gorhom/bottom-sheet";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { useMemo } from "react";
import {
  FlatList,
  Platform,
  PlatformColor,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { iOSUIKit } from "react-native-typography";

import { RecentPerson } from "./RecentPerson";
import { recentMovies } from "../../recentMovies";
import { recentPeople } from "../../recentPeople";

import { MoviePoster } from "@/components/Posters/MoviePoster";
import { calculateWidth } from "@/helpers/helpers";

export const SearchBottomSheet = () => {
  const tabBarHeight = useBottomTabBarHeight();
  const { top } = useSafeAreaInsets();

  const snapPoints = useMemo(() => ["CONTENT_HEIGHT", "50%", "100%"], []);

  const {
    animatedHandleHeight,
    animatedSnapPoints,
    animatedContentHeight,
    handleContentLayout,
  } = useBottomSheetDynamicSnapPoints(snapPoints);

  return (
    <BottomSheet
      // backgroundComponent={() => <BlurView style={StyleSheet.absoluteFill} />}
      bottomInset={tabBarHeight}
      topInset={top}
      snapPoints={animatedSnapPoints}
      handleHeight={animatedHandleHeight}
      contentHeight={animatedContentHeight}
      backgroundStyle={{
        backgroundColor:
          Platform.OS === "ios"
            ? PlatformColor("secondarySystemBackground")
            : "gray",
      }}
      handleIndicatorStyle={{
        backgroundColor: PlatformColor("systemGray"),
      }}
    >
      <View
        // style={[
        //     styles.contentContainer,
        //     // { paddingBottom: tabBarHeight + 16 },
        //     { paddingBottom: 16 },
        //   ]}
        style={{ marginHorizontal: 12 }}
      >
        <View onLayout={handleContentLayout}>
          <BottomSheetTextInput
            placeholder="Movies & People"
            placeholderTextColor={PlatformColor("secondaryLabel")}
            clearButtonMode="while-editing"
            style={styles.textInput}
          />
        </View>
        {true && (
          <>
            <Text
              style={[
                iOSUIKit.subheadEmphasized,
                { color: PlatformColor("secondaryLabel"), marginBottom: 8 },
              ]}
            >
              Recently Viewed Titles
            </Text>
            <FlatList
              data={recentMovies}
              renderItem={({ item }) => (
                <MoviePoster
                  pressHandler={() =>
                    navigation.push("Movie", {
                      movieId: item.id,
                      movieTitle: "item.title",
                    })
                  }
                  movie={item}
                  posterPath={item.poster_path}
                  style={{
                    aspectRatio: 2 / 3,
                    width: calculateWidth(12, 12, 3.5),
                  }}
                />
              )}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              ListHeaderComponent={<View style={{ width: 12 }} />}
              ListFooterComponent={<View style={{ width: 12 }} />}
              horizontal
              keyExtractor={(item) => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -12 }}
            />
            <Text
              style={[
                iOSUIKit.subheadEmphasized,
                {
                  color: PlatformColor("secondaryLabel"),
                  marginBottom: 8,
                  marginTop: 16,
                },
              ]}
            >
              Recently Viewed People
            </Text>
            <FlatList
              data={recentPeople}
              renderItem={RecentPerson}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              ListHeaderComponent={<View style={{ width: 12 }} />}
              ListFooterComponent={<View style={{ width: 12 }} />}
              horizontal
              keyExtractor={({ id }) => id.toString()}
              showsHorizontalScrollIndicator={false}
              style={{ marginHorizontal: -12 }}
            />
          </>
        )}
      </View>
    </BottomSheet>
  );
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  textInput: {
    ...iOSUIKit.bodyObject,
    alignSelf: "stretch",
    // marginHorizontal: 12,
    // marginBottom: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: PlatformColor("tertiarySystemFill"),
    color: PlatformColor("label"),
    // textAlign: "center",
    marginBottom: 16,
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
