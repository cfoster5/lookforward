import { PlatformColor, Pressable, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { useRecentItemsStore } from "@/stores/recents";

type SectionHeaderProps = {
  text: string;
  categoryIndex: number;
};

export const SectionHeader = ({ text, categoryIndex }: SectionHeaderProps) => {
  const { resetItems } = useRecentItemsStore();

  function handleClearPress(sectionTitle: string) {
    if (categoryIndex === 0) {
      if (sectionTitle === "Titles") {
        resetItems("recentMovies");
      } else {
        resetItems("recentPeople");
      }
    } else resetItems("recentGames");
  }

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Text
        style={[
          iOSUIKit.subheadEmphasized,
          { color: PlatformColor("secondaryLabel") },
        ]}
      >
        {text}
      </Text>
      <Pressable onPress={() => handleClearPress(text)}>
        <Text
          style={[iOSUIKit.subhead, { color: PlatformColor("systemBlue") }]}
        >
          Clear
        </Text>
      </Pressable>
    </View>
  );
};
