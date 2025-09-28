import { Text, View } from "react-native";
import { iOSUIKit } from "react-native-typography";

export const SectionHeader = ({ section }) => (
  <View>
    <Text style={[iOSUIKit.title3EmphasizedWhite, { marginVertical: 8 }]}>
      {section.title}
    </Text>
  </View>
);
