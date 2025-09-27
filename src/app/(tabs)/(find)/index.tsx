import { GameLayout } from "@/screens/Search/GameLayout";
import { MovieLayout } from "@/screens/Search/MovieLayout";
import { useInterfaceStore } from "@/stores";

export default function Search() {
  const { categoryIndex } = useInterfaceStore();

  return categoryIndex === 0 ? <MovieLayout /> : <GameLayout />;
}
