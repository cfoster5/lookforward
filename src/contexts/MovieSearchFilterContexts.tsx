import { createContext } from "react";

const MovieSearchFilterContext = createContext({
  selectedOption: "Coming Soon",
  setSelectedOption: (option: string) => {}
});

export default MovieSearchFilterContext;
