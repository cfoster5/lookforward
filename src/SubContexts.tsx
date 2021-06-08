import React from "react";
import { Trakt } from "../types";

export const MovieSubContext = React.createContext([]);
export const ShowSubContext = React.createContext<Trakt.ShowPremiere[] | Trakt.ShowSearch[]>([]);
export const GameSubContext= React.createContext([]);

