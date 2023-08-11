import { View } from "react-native";

export const horizontalListProps = {
  horizontal: true,
  style: { marginHorizontal: -16, marginTop: 16 },
  ListHeaderComponent: () => <View style={{ width: 16 }} />,
  ItemSeparatorComponent: () => <View style={{ width: 8 }} />,
  ListFooterComponent: () => <View style={{ width: 16 }} />,
  showsHorizontalScrollIndicator: false,
};
