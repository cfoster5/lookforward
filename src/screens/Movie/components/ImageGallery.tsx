import { Galeria } from "@nandorojo/galeria";
import { FlatList } from "react-native";
import { PosterSize, Images } from "tmdb-ts";

import { horizontalListProps } from "@/constants/HorizontalListProps";
import { calculateWidth } from "@/helpers/helpers";

import type { ImageSelectionProps } from "../types";

import { GalleryImage } from "./GalleryImage";

interface ImageGalleryProps {
  images: Images;
  selection: ImageSelectionProps;
}

export const ImageGallery = ({ images, selection }: ImageGalleryProps) => {
  const imageType = selection.value;
  const selectedImages = images[imageType];
  const urls = selectedImages.map(
    (image) =>
      `https://image.tmdb.org/t/p/${PosterSize.ORIGINAL}${image.file_path}`,
  );

  return (
    <Galeria urls={urls}>
      <FlatList
        keyExtractor={(item) => item.file_path}
        data={selectedImages}
        renderItem={({ item, index }) => (
          <GalleryImage
            index={index}
            width={
              imageType === "posters"
                ? calculateWidth(16, 8, 2.5)
                : calculateWidth(16, 8, 1.5)
            }
            aspectRatio={item.aspect_ratio}
            uri={`https://image.tmdb.org/t/p/${PosterSize.ORIGINAL}${item.file_path}`}
          />
        )}
        {...horizontalListProps}
      />
    </Galeria>
  );
};
