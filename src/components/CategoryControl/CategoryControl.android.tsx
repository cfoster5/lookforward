import { Pressable, Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

interface Props {
  buttons: string[];
  categoryIndex: number;
  handleCategoryChange: (index: number) => void;
}

function CategoryControl({
  buttons,
  categoryIndex,
  handleCategoryChange,
}: Props) {
  return (
    // <SegmentedControl
    //   style={{ marginHorizontal: 16, marginTop: 8, paddingVertical: 16 }}
    //   values={buttons}
    //   selectedIndex={categoryIndex}
    //   onChange={(event) => {
    //     handleCategoryChange(event.nativeEvent.selectedSegmentIndex)
    //   }}
    //   appearance="dark"
    // />
    <View
      style={{
        // flex: 1,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "flex-start",
        paddingHorizontal: 16,
        marginTop: 8,
      }}
    >
      {buttons.map((button, i) => (
        <Pressable
          style={{
            width: `${100 / buttons.length}%`,
            paddingVertical: 4,
            borderColor: "#1c1c1f",
            borderWidth: 2,
            backgroundColor: categoryIndex === i ? "#5b5b60" : "#1c1c1f",
            borderTopLeftRadius: i === 0 ? 8 : 0,
            borderBottomLeftRadius: i === 0 ? 8 : 0,
            borderTopRightRadius: i === buttons.length - 1 ? 8 : 0,
            borderBottomRightRadius: i === buttons.length - 1 ? 8 : 0,
          }}
          key={i}
          onPress={() => handleCategoryChange(i)}
        >
          <Text style={{ ...iOSUIKit.bodyWhiteObject, textAlign: "center" }}>
            {button}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

export default CategoryControl;
