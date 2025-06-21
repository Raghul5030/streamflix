import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Movie, TVShow } from "@/lib/tmdb";
import { wishlistService, WishlistItem } from "@/lib/wishlist";

interface WishlistContextType {
  wishlist: WishlistItem[];
  isInWishlist: (itemId: number) => boolean;
  addToWishlist: (item: Movie | TVShow) => boolean;
  removeFromWishlist: (itemId: number) => boolean;
  clearWishlist: () => void;
  wishlistCount: number;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(
  undefined,
);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
};

interface WishlistProviderProps {
  children: ReactNode;
}

export const WishlistProvider: React.FC<WishlistProviderProps> = ({
  children,
}) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load wishlist on mount
    const loadWishlist = () => {
      try {
        const savedWishlist = wishlistService.getWishlist();
        setWishlist(savedWishlist);
      } catch (error) {
        console.error("Error loading wishlist:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadWishlist();
  }, []);

  const isInWishlist = (itemId: number): boolean => {
    return wishlist.some((item) => item.id === itemId);
  };

  const addToWishlist = (item: Movie | TVShow): boolean => {
    const success = wishlistService.addToWishlist(item);
    if (success) {
      const updatedWishlist = wishlistService.getWishlist();
      setWishlist(updatedWishlist);
    }
    return success;
  };

  const removeFromWishlist = (itemId: number): boolean => {
    const success = wishlistService.removeFromWishlist(itemId);
    if (success) {
      const updatedWishlist = wishlistService.getWishlist();
      setWishlist(updatedWishlist);
    }
    return success;
  };

  const clearWishlist = (): void => {
    wishlistService.clearWishlist();
    setWishlist([]);
  };

  const value: WishlistContextType = {
    wishlist,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    wishlistCount: wishlist.length,
    isLoading,
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};
