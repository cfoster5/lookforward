import { useQuery } from "@tanstack/react-query";
import Purchases from "react-native-purchases";

export const useProOfferings = () =>
  useQuery({
    queryKey: ["proPackages"],
    queryFn: async () => await Purchases.getOfferings(),
    select: (data) => data.all["pro"],
  });

export const useLimitHitOffering = () =>
  useQuery({
    queryKey: ["proPackages"],
    queryFn: async () => await Purchases.getOfferings(),
    select: (data) => data.all["limit_hit"],
  });
