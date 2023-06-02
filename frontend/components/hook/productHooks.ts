import { Product } from '../../types/Product'
import APIClient from "../../utils/getAPI";
import { useQuery } from "@tanstack/react-query";

export const GetQueryProduct = () =>
  useQuery({
    queryKey: ["Products"],
    queryFn: async () => (await APIClient.get<Product[]>("/api/products")).data,
  });

export const GetQuerySlug = (slug: string) =>
  useQuery({
    queryKey: ['Product', slug],
    queryFn: async () =>
      (await APIClient.get<Product>(`/api/products/${slug}`)).data,
  });
