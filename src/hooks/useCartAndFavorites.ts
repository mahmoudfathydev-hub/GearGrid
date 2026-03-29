import { useCartAndFavoritesContext } from "@/context/CartAndFavoritesContext";

export function useCartAndFavorites() {
  return useCartAndFavoritesContext();
}

