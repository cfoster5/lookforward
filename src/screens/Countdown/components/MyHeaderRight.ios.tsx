import { PlatformColor } from "react-native";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { useCountdownStore } from "@/stores/store";
import { iOSUIKit } from "react-native-typography";

export const MyHeaderRight = () => {
  const { showDeleteButton, toggleDeleteButton, clearSelections } =
    useCountdownStore();

  return (
    <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
      <Item
        title={showDeleteButton ? "Done" : "Edit"}
        buttonStyle={[
          showDeleteButton ? iOSUIKit.bodyEmphasized : null,
          { color: PlatformColor("systemBlue") },
        ]}
        onPress={() => {
          toggleDeleteButton();
          if (showDeleteButton) clearSelections();
        }}
      />
    </HeaderButtons>
  );
};
