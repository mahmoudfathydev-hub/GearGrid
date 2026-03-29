"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Car } from "@/types/car";

interface CartAndFavoritesContextType {
  cartItems: string[];
  favoriteItems: string[];
  addToCart: (car: Car) => void;
  removeFromCart: (car: Car) => void;
  addToFavorites: (car: Car) => void;
  removeFromFavorites: (car: Car) => void;
  isFavorite: (carId: string) => boolean;
  isInCart: (carId: string) => boolean;
  cartCount: number;
  favoriteCount: number;
}

const CartAndFavoritesContext = createContext<CartAndFavoritesContextType | undefined>(undefined);

export function CartAndFavoritesProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<string[]>([]);
  const [favoriteItems, setFavoriteItems] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load from localStorage on mount (unconditionally call useEffect)
  useEffect(() => {
    const savedCart = localStorage.getItem("cartItems");
    const savedFavorites = localStorage.getItem("favoriteItems");
    
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        console.error("Failed to parse cartItems from localStorage", e);
      }
    }
    
    if (savedFavorites) {
      try {
        setFavoriteItems(JSON.parse(savedFavorites));
      } catch (e) {
        console.error("Failed to parse favoriteItems from localStorage", e);
      }
    }
    
    setIsInitialized(true);
  }, []);

  // Sync to localStorage whenever items change, but only after initialization
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }
  }, [cartItems, isInitialized]);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("favoriteItems", JSON.stringify(favoriteItems));
    }
  }, [favoriteItems, isInitialized]);

  const addToCart = (car: Car) => {
    setCartItems(prev => {
      if (prev.includes(car.id)) {
        return prev.filter(id => id !== car.id);
      }
      return [...prev, car.id];
    });
  };

  const removeFromCart = (car: Car) => {
    setCartItems(prev => prev.filter(id => id !== car.id));
  };

  const addToFavorites = (car: Car) => {
    setFavoriteItems(prev => {
      if (prev.includes(car.id)) {
        return prev.filter(id => id !== car.id);
      }
      return [...prev, car.id];
    });
  };

  const removeFromFavorites = (car: Car) => {
    setFavoriteItems(prev => prev.filter(id => id !== car.id));
  };

  const isFavorite = (carId: string) => favoriteItems.includes(carId);
  const isInCart = (carId: string) => cartItems.includes(carId);

  return (
    <CartAndFavoritesContext.Provider
      value={{
        cartItems,
        favoriteItems,
        addToCart,
        removeFromCart,
        addToFavorites,
        removeFromFavorites,
        isFavorite,
        isInCart,
        cartCount: cartItems.length,
        favoriteCount: favoriteItems.length,
      }}
    >
      {children}
    </CartAndFavoritesContext.Provider>
  );
}

export function useCartAndFavoritesContext() {
  const context = useContext(CartAndFavoritesContext);
  if (context === undefined) {
    throw new Error("useCartAndFavoritesContext must be used within a CartAndFavoritesProvider");
  }
  return context;
}
