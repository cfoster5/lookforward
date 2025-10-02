import { Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

export const SectionHeader = ({ section, sectionIndex }) => (
  <View style={{ marginTop: sectionIndex > 0 ? 24 : 0 }}>
    <Text
      style={[
        iOSUIKit.title3EmphasizedWhite,
        { marginVertical: 8, marginHorizontal: 16 },
      ]}
    >
      {section.title}
    </Text>
  </View>
);
