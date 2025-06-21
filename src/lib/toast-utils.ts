import { toast } from "sonner";
import { Movie, TVShow } from "./tmdb";

export const showWishlistToast = {
  added: (item: Movie | TVShow) => {
    const title = "title" in item ? item.title : item.name;
    toast.success("Added to Wishlist", {
      description: `${title} has been added to your watchlist`,
      duration: 3000,
    });
  },

  removed: (item: Movie | TVShow) => {
    const title = "title" in item ? item.title : item.name;
    toast.success("Removed from Wishlist", {
      description: `${title} has been removed from your watchlist`,
      duration: 3000,
    });
  },

  error: (action: "add" | "remove") => {
    toast.error("Wishlist Error", {
      description: `Failed to ${action} item ${action === "add" ? "to" : "from"} wishlist`,
      duration: 3000,
    });
  },

  cleared: () => {
    toast.success("Wishlist Cleared", {
      description: "All items have been removed from your wishlist",
      duration: 3000,
    });
  },
};

export const showVideoToast = {
  noTrailers: (title: string) => {
    toast.info("No Trailers Available", {
      description: `No video content is available for "${title}"`,
      duration: 4000,
    });
  },

  loading: () => {
    toast.loading("Loading video...", {
      description: "Fetching trailer information",
    });
  },

  error: () => {
    toast.error("Video Error", {
      description: "Failed to load video content",
      duration: 4000,
    });
  },
};
