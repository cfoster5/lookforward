import { GameLayout } from "@/screens/Search/GameLayout";
import { MovieLayout } from "@/screens/Search/MovieLayout";
import { useStore } from "@/stores/store";

export default function Search() {
  const { categoryIndex } = useStore();

  return categoryIndex === 0 ? <MovieLayout /> : <GameLayout />;
}
