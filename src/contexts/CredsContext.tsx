import React from "react";
import { IGDBCredentials } from "../../types";

export const CredsContext = React.createContext<IGDBCredentials>({
  access_token: "",
  expires_in: 0,
  modified: 0,
  token_type: "bearer",
});
export default CredsContext;
