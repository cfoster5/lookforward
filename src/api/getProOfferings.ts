import { useQuery } from "@tanstack/react-query";
import Purchases, { PurchasesOfferings } from "react-native-purchases";

const useOfferings = () =>
  useQuery<PurchasesOfferings>({
    queryKey: ["purchasesOfferings"],
    queryFn: async () => await Purchases.getOfferings(),
  });

export function useProOfferings() {
  const query = useOfferings();
  return { ...query, data: query.data?.all["pro"] };
}

export function useLimitHitOffering() {
  const query = useOfferings();
  return { ...query, data: query.data?.all["limit_hit"] };
}
