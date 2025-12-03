import * as Colors from "@bacons/apple-colors";
import { Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { IconSymbol } from "@/components/IconSymbol";

interface FilteredEmptyStateProps {
  statusFilter: "released" | "unreleased";
  mediaFilter: "all" | "movies" | "games";
}

export const FilteredEmptyState = ({
  statusFilter,
  mediaFilter,
}: FilteredEmptyStateProps) => {
  const getMediaText = () => {
    if (mediaFilter === "movies") return "movies";
    if (mediaFilter === "games") return "games";
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
        color={Colors.secondaryLabel}
        style={{ marginBottom: 16 }}
      />
      <Text
        style={[
          iOSUIKit.title3Emphasized,
          {
            color: Colors.label,
            textAlign: "center",
            marginBottom: 8,
          },
        ]}
      >
        No {statusFilter} {getMediaText()}
      </Text>
      <Text
        style={[
          iOSUIKit.body,
          {
            color: Colors.secondaryLabel,
            textAlign: "center",
          },
        ]}
      >
        Try changing your filters to see your countdowns
      </Text>
    </View>
  );
};
