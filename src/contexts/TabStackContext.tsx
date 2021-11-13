import { createContext } from "react";

const TabStackContext = createContext({
  user: "",
  theme: "dark",
});

export default TabStackContext;
