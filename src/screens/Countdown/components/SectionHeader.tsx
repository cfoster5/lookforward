import * as Colors from "@bacons/apple-colors";
import { Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

export const SectionHeader = ({ section }) => (
  <View style={{ backgroundColor: Colors.systemGray6 }}>
    <Text
      style={[
        iOSUIKit.title3EmphasizedWhite,
        { marginLeft: 16, marginVertical: 8 },
      ]}
    >
      {section.title}
    </Text>
  </View>
);
