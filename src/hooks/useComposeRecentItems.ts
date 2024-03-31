import { useCallback } from "react";

import { Recent } from "@/types";

export const useComposeRecentItems = (storedItems: string | undefined) => {
  const composeRecentItems = useCallback(() => {
    return storedItems ? (JSON.parse(storedItems) as Recent[]) : [];
  }, [storedItems]);

  return composeRecentItems;
};
