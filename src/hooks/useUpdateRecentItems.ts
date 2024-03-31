import produce from "immer";
import { useEffect } from "react";

import { Recent } from "@/types";

export const useUpdateRecentItems = (
  composeRecentItems: () => Recent[],
  newItem: Recent,
  setStoredItems: (items: string) => void,
  dependencies: any[]
) => {
  useEffect(() => {
    const updatedRecentItems = produce(
      composeRecentItems(),
      (draft: Recent[]) => {
        const index = draft.findIndex((item) => item.id === newItem.id);
        if (index === -1) draft.unshift(newItem);
        else if (index !== 0) {
          // No action if item is already at beginning
          draft.splice(index, 1);
          draft.unshift(newItem);
        }
      }
    );

    setStoredItems(JSON.stringify(updatedRecentItems));
  }, [composeRecentItems, newItem, setStoredItems, ...dependencies]);
};
