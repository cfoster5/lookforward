import * as Colors from "@bacons/apple-colors";
import { iOSUIKit } from "react-native-typography";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { useCountdownStore } from "@/stores";

export const MyHeaderRight = () => {
  const { isEditing, toggleIsEditing, clearSelections } = useCountdownStore();

  return (
    <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
      <Item
        title={isEditing ? "Done" : "Edit"}
        buttonStyle={[
          isEditing ? iOSUIKit.bodyEmphasized : null,
          { color: Colors.systemBlue },
        ]}
        onPress={() => {
          toggleIsEditing();
          if (isEditing) clearSelections();
        }}
      />
    </HeaderButtons>
  );
};
