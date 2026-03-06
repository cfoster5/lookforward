import { Pressable, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { useRecentItemsStore } from "@/stores/recents";
import { colors } from "@/theme/colors";

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
        style={[iOSUIKit.subheadEmphasized, { color: colors.secondaryLabel }]}
      >
        {text}
      </Text>
      <Pressable onPress={() => handleClearPress(text)}>
        <Text style={[iOSUIKit.subhead, { color: colors.systemBlue }]}>
          Clear
        </Text>
      </Pressable>
    </View>
  );
};
