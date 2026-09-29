import { createContext, useContext } from "react";
import { CONTENT_DEFAULTS } from "./contentDefaults";

export const ContentContext = createContext(CONTENT_DEFAULTS);

export function useContent() {
  return useContext(ContentContext);
}
