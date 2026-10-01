import React, { createContext, useContext, useState, useEffect } from "react";

const WishlistContext = createContext();
const WISHLIST_STORAGE_KEY = "guest_wishlist_v1";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Keep localStorage in sync whenever the wishlist changes
  useEffect(() => {
    try {
      localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(wishlist));
    } catch (err) {
      console.error("Failed to save wishlist to localStorage:", err);
    }
  }, [wishlist]);

  const isWishlisted = (productId) =>
    wishlist.some((item) => String(item.id) === String(productId));

  const addToWishlist = (product) => {
    const productId = typeof product === "object" ? product.id : product;

    setWishlist((prev) => {
      if (prev.some((item) => String(item.id) === String(productId))) {
        return prev; // already saved, no-op
      }
      return [...prev, { ...product, id: productId }];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((item) => String(item.id) !== String(productId)));
  };

  const toggleWishlist = (product) => {
    const productId = typeof product === "object" ? product.id : product;
    if (isWishlisted(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(product);
    }
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isWishlisted,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
        clearWishlist,
        totalWishlisted: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};
