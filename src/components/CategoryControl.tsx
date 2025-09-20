import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { StyleProp, ViewStyle } from "react-native";

interface Props {
  buttons: string[];
  categoryIndex: number;
  handleCategoryChange: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

export const CategoryControl = ({
  buttons,
  categoryIndex,
  handleCategoryChange,
  style,
}: Props) => (
  <SegmentedControl
    style={[{ marginHorizontal: 16 }, style]}
    values={buttons}
    selectedIndex={categoryIndex}
    onChange={(event) => {
      handleCategoryChange(event.nativeEvent.selectedSegmentIndex);
    }}
    appearance="dark"
  />
);
