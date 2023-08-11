import { PlatformColor } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
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
