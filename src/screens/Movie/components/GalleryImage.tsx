import { Galeria } from "@nandorojo/galeria";
import { Image } from "expo-image";
import { PlatformColor } from "react-native";

type GalleryImageProps = {
  index: number;
  width: number;
  aspectRatio: number;
  uri: string;
};

export const GalleryImage = ({
  index,
  width,
  aspectRatio,
  uri,
}: GalleryImageProps) => (
  <Galeria.Image index={index}>
    <Image
      style={{
        borderRadius: 12,
        borderWidth: 1,
        borderColor: PlatformColor("separator"),
        width,
        aspectRatio,
        // aspectRatio:
        //   imageSelection.value === "posters"
        //     ? 2 / 3
        //     : 16 / 9,
      }}
      source={{ uri: uri }}
    />
  </Galeria.Image>
);
