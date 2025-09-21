import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CategoryControl } from "@/components/CategoryControl";
import { GameLayout } from "@/screens/Search/GameLayout";
import { MovieLayout } from "@/screens/Search/MovieLayout";
import { useStore } from "@/stores/store";

export default function Search() {
  const { categoryIndex, setCategoryIndex } = useStore();
  const { top } = useSafeAreaInsets();

  return (
    <>
      <CategoryControl
        buttons={["Movies", "Games"]}
        categoryIndex={categoryIndex}
        handleCategoryChange={(index) => setCategoryIndex(index)}
        style={{
          // marginBottom: 24,
          marginHorizontal: 12,
          minHeight: 44,
          marginTop: top,
        }}
      />
      {categoryIndex === 0 ? <MovieLayout /> : <GameLayout />}
    </>
  );
}
