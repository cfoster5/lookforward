import { Ionicons } from "@expo/vector-icons";
import { PlatformColor } from "react-native";
import { HeaderButton } from "react-navigation-header-buttons";

export function IoniconsHeaderButton(props) {
  return (
    // the `props` here come from <Item ... />
    // you may access them and pass something else to `HeaderButton` if you like
    <HeaderButton
      IconComponent={Ionicons}
      iconSize={30}
      color={PlatformColor("systemBlue")}
      {...props}
    />
  );
}
