import { Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { Colors } from "@/constants/Colors";

export const SectionHeader = ({ section }) => (
  <View style={{ backgroundColor: Colors.gray6 }}>
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
