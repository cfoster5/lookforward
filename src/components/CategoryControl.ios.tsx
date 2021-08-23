import React from "react";
import SegmentedControl from "@react-native-community/segmented-control";

interface Props {
  buttons: string[],
  categoryIndex: number,
  handleCategoryChange: (index: number) => void
}

function CategoryControl({ buttons, categoryIndex, handleCategoryChange }: Props) {
  return (
    <SegmentedControl
      style={{ marginHorizontal: 16, paddingVertical: 16, marginTop: 8 }}
      values={buttons}
      selectedIndex={categoryIndex}
      onChange={(event) => {
        handleCategoryChange(event.nativeEvent.selectedSegmentIndex)
      }}
      appearance="dark"
    />
  )
}

export default CategoryControl;