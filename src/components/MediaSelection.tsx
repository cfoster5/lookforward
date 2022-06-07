import React from "react";
import { Pressable, Text } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

export function MediaSelection({
  option,
  action,
  mediaSelections,
}: {
  option: "Trailers" | "Teasers" | "Posters" | "Backdrops";
  action: () => void;
  mediaSelections: {
    videos: "Trailer" | "Teaser";
    images: "posters" | "backdrops";
  };
}) {
  return (
    <Pressable style={{ marginRight: 8 }} onPress={action}>
      <Text
        style={[
          option.toLowerCase().includes(mediaSelections.images.toLowerCase()) ||
          option.toLowerCase().includes(mediaSelections.videos.toLowerCase())
            ? iOSUIKit.bodyEmphasizedWhite
            : { ...iOSUIKit.bodyObject, color: iOSColors.gray },
          {
            marginTop: 16,
          },
        ]}
      >
        {option}
      </Text>
    </Pressable>
  );
}
