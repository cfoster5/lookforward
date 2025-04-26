import SegmentedControl from "@react-native-segmented-control/segmented-control";

interface Props {
  buttons: string[];
  categoryIndex: number;
  handleCategoryChange: (index: number) => void;
}

export const CategoryControl = ({
  buttons,
  categoryIndex,
  handleCategoryChange,
}: Props) => (
  <SegmentedControl
    style={{ marginHorizontal: 16 }}
    values={buttons}
    selectedIndex={categoryIndex}
    onChange={(event) => {
      handleCategoryChange(event.nativeEvent.selectedSegmentIndex);
    }}
    appearance="dark"
  />
);
