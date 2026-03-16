import { View } from "react-native";

const Spacer16 = () => <View style={spacer16Style} />;
const Spacer8 = () => <View style={spacer8Style} />;

const spacer16Style = { width: 16 };
const spacer8Style = { width: 8 };

export const horizontalListProps = {
  horizontal: true,
  style: { marginHorizontal: -16, marginTop: 16 },
  ListHeaderComponent: Spacer16,
  ItemSeparatorComponent: Spacer8,
  ListFooterComponent: Spacer16,
  showsHorizontalScrollIndicator: false,
};
