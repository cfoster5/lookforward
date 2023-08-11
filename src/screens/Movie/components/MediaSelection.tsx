import { PlatformColor, Pressable, Text } from "react-native";
import { iOSColors, iOSUIKit } from "react-native-typography";

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
            ? iOSUIKit.bodyEmphasizedWhite
            : { ...iOSUIKit.bodyObject, color: PlatformColor("systemGray") },
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
