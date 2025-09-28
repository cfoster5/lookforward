import * as Colors from "@bacons/apple-colors";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import { IoniconsHeaderButton } from "@/components/IoniconsHeaderButton";
import { onShare } from "@/utils/share";

// Extract the arrow function into a separate component to avoid creating a new one every time
export const ShareHeader = () => (
  <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
    <Item title="share" iconName="share-outline" />
  </HeaderButtons>
);

// Extract the arrow function into a separate component to avoid creating a new one every time
export const MultiItemHeader = () => (
  <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
    <Item title="search" iconName="add-outline" />
    <Item title="share" iconName="share-outline" />
  </HeaderButtons>
);

export const DynamicShareHeader = ({ urlSegment }) => (
  <HeaderButtons HeaderButtonComponent={IoniconsHeaderButton}>
    <Item
      title="share"
      iconName="share-outline"
      onPress={() => onShare(urlSegment, "headerButton")}
      color={Colors.label}
    />
  </HeaderButtons>
);
