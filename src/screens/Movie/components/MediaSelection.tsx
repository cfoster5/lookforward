import { Pressable, Text } from "react-native";
import { iOSUIKit } from "react-native-typography";

import { Colors } from "@/constants/Colors";

export function MediaSelection({
  option,
  action,
  mediaSelections,
  creditsSelection,
}: {
  option: "Trailers" | "Teasers" | "Posters" | "Backdrops" | "Cast" | "Crew";
  action: () => void;
  mediaSelections?: {
    videos: "Trailer" | "Teaser";
    images: "posters" | "backdrops";
  };
  creditsSelection?: "Cast" | "Crew";
}) {
  return (
    <Pressable style={{ marginRight: 8 }} onPress={action}>
      <Text
        style={[
          option
            .toLowerCase()
            .includes(mediaSelections?.images.toLowerCase()) ||
          option
            .toLowerCase()
            .includes(mediaSelections?.videos.toLowerCase()) ||
          option.toLowerCase().includes(creditsSelection?.toLowerCase())
            ? [iOSUIKit.bodyEmphasized, { color: Colors.label }]
            : [iOSUIKit.body, { color: Colors.secondaryLabel }],
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
