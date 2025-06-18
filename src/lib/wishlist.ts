import { Movie, TVShow } from "./tmdb";

export type WishlistItem = (Movie | TVShow) & {
  addedAt: Date;
  type: "movie" | "tv";
};

class WishlistService {
  private static readonly STORAGE_KEY = "streaming_wishlist";

  // Get all wishlist items
  getWishlist(): WishlistItem[] {
    try {
      const wishlistData = localStorage.getItem(WishlistService.STORAGE_KEY);
      if (!wishlistData) return [];

      const items = JSON.parse(wishlistData);
      return items.map((item: any) => ({
        ...item,
        addedAt: new Date(item.addedAt),
      }));
    } catch (error) {
      console.error("Error loading wishlist:", error);
      return [];
    }
  }

  // Save wishlist to localStorage
  private saveWishlist(items: WishlistItem[]): void {
    try {
      localStorage.setItem(WishlistService.STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Error saving wishlist:", error);
    }
  }

  // Add item to wishlist
  addToWishlist(item: Movie | TVShow): boolean {
    try {
      const currentWishlist = this.getWishlist();

      // Check if item already exists
      const exists = currentWishlist.some(
        (wishItem) => wishItem.id === item.id,
      );
      if (exists) {
        return false; // Already in wishlist
      }

      const wishlistItem: WishlistItem = {
        ...item,
        addedAt: new Date(),
        type: "title" in item ? "movie" : "tv",
      };

      const updatedWishlist = [wishlistItem, ...currentWishlist];
      this.saveWishlist(updatedWishlist);
      return true;
    } catch (error) {
      console.error("Error adding to wishlist:", error);
      return false;
    }
  }

  // Remove item from wishlist
  removeFromWishlist(itemId: number): boolean {
    try {
      const currentWishlist = this.getWishlist();
      const updatedWishlist = currentWishlist.filter(
        (item) => item.id !== itemId,
      );

      this.saveWishlist(updatedWishlist);
      return true;
    } catch (error) {
      console.error("Error removing from wishlist:", error);
      return false;
    }
  }

  // Check if item is in wishlist
  isInWishlist(itemId: number): boolean {
    const wishlist = this.getWishlist();
    return wishlist.some((item) => item.id === itemId);
  }

  // Get wishlist count
  getWishlistCount(): number {
    return this.getWishlist().length;
  }

  // Clear entire wishlist
  clearWishlist(): void {
    try {
      localStorage.removeItem(WishlistService.STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing wishlist:", error);
    }
  }

  // Get wishlist by type
  getWishlistByType(type: "movie" | "tv"): WishlistItem[] {
    return this.getWishlist().filter((item) => item.type === type);
  }

  // Get recently added items
  getRecentlyAdded(limit: number = 10): WishlistItem[] {
    return this.getWishlist()
      .sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime())
      .slice(0, limit);
  }
}

export const wishlistService = new WishlistService();
