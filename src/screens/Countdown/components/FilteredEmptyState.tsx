import { Color } from "expo-router";
import { Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { IconSymbol } from "@/components/IconSymbol";

interface FilteredEmptyStateProps {
  statusFilter: "all" | "released" | "unreleased";
  mediaFilter: "all" | "movies" | "games" | "people";
}

export const FilteredEmptyState = ({
  statusFilter,
  mediaFilter,
}: FilteredEmptyStateProps) => {
  const getMediaText = () => {
    if (mediaFilter === "movies") return "movies";
    if (mediaFilter === "games") return "games";
    if (mediaFilter === "people") return "people you follow";
    return "movies or games";
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 16,
        paddingTop: 100,
      }}
    >
      <IconSymbol
        name="line.3.horizontal.decrease"
        size={64}
        color={Color.ios.secondaryLabel as string}
        style={{ marginBottom: 16 }}
      />
      <Text
        style={[
          iOSUIKit.title3Emphasized,
          {
            color: Color.ios.label,
            textAlign: "center",
            marginBottom: 8,
          },
        ]}
      >
        No {statusFilter !== "all" ? `${statusFilter} ` : ""}
        {getMediaText()}
      </Text>
      <Text
        style={[
          iOSUIKit.body,
          {
            color: Color.ios.secondaryLabel,
            textAlign: "center",
          },
        ]}
      >
        Try changing your filters to see your countdowns
      </Text>
    </View>
  );
};
