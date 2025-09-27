import * as Colors from "@bacons/apple-colors";
import { Image } from "expo-image";
import { PosterSizes } from "tmdb-ts";

import { MyPerson } from "../types";

type Props = {
  item: MyPerson["images"]["profiles"][number];
  width: number;
  horizontalMargin: number;
};

export const CarouselItem = ({ item, width, horizontalMargin }: Props) => (
  <Image
    source={{
      uri: `https://image.tmdb.org/t/p/${PosterSizes.W300}${item.file_path}`,
    }}
    style={{
      borderRadius: 12,
      borderColor: Colors.separator,
      borderWidth: 1,
      width,
      height: width * 1.5,
      paddingHorizontal: horizontalMargin,
    }}
  />
);
