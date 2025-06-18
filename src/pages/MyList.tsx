import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import MovieCard from "@/components/movie/MovieCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Heart, Trash2, Calendar, Filter } from "lucide-react";
import { useWishlist } from "@/contexts/WishlistContext";

const MyList: React.FC = () => {
  const navigate = useNavigate();
  const { wishlist, clearWishlist, wishlistCount } = useWishlist();
  const [sortBy, setSortBy] = useState<"recent" | "alphabetical" | "rating">(
    "recent",
  );

  const movieItems = wishlist.filter((item) => item.type === "movie");
  const tvItems = wishlist.filter((item) => item.type === "tv");

  const sortedWishlist = [...wishlist].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        const titleA = "title" in a ? a.title : a.name;
        const titleB = "title" in b ? b.title : b.name;
        return titleA.localeCompare(titleB);
      case "rating":
        return b.vote_average - a.vote_average;
      case "recent":
      default:
        return b.addedAt.getTime() - a.addedAt.getTime();
    }
  });

  const handleClearWishlist = () => {
    if (
      window.confirm("Are you sure you want to clear your entire wishlist?")
    ) {
      clearWishlist();
    }
  };

  return (
    <div className="min-h-screen bg-streaming-dark">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate(-1)}
                variant="outline"
                size="sm"
                className="border-white/30 bg-white/20 text-white hover:bg-white/30"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-white">My List</h1>
                <p className="text-streaming-gray">
                  {wishlistCount} {wishlistCount === 1 ? "item" : "items"} in
                  your watchlist
                </p>
              </div>
            </div>

            {wishlistCount > 0 && (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-streaming-gray" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-streaming-card border-streaming-card text-white rounded px-3 py-1 text-sm"
                  >
                    <option value="recent">Recently Added</option>
                    <option value="alphabetical">A-Z</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>
                <Button
                  onClick={handleClearWishlist}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-500 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            )}
          </div>

          {wishlistCount === 0 ? (
            // Empty state
            <div className="text-center py-16">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 bg-netflix-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Heart className="w-8 h-8 text-netflix-500" />
                </div>
                <h2 className="text-xl font-semibold text-white mb-4">
                  Your Personal Watchlist
                </h2>
                <p className="text-streaming-gray mb-8">
                  Save movies and TV shows to watch later. Click the + button on
                  any movie or show to add it to your list.
                </p>
                <Button
                  onClick={() => navigate("/dashboard")}
                  className="bg-netflix-600 hover:bg-netflix-700 text-white"
                >
                  Browse Content
                </Button>
              </div>
            </div>
          ) : (
            // Wishlist content
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="bg-streaming-card border-streaming-card mb-6">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-netflix-600"
                >
                  All ({wishlistCount})
                </TabsTrigger>
                <TabsTrigger
                  value="movies"
                  className="data-[state=active]:bg-netflix-600"
                >
                  Movies ({movieItems.length})
                </TabsTrigger>
                <TabsTrigger
                  value="tv"
                  className="data-[state=active]:bg-netflix-600"
                >
                  TV Shows ({tvItems.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {sortedWishlist.map((item) => (
                    <div key={item.id} className="relative">
                      <MovieCard item={item} size="medium" className="w-full" />
                      <div className="absolute top-2 left-2 bg-netflix-600 text-white text-xs px-2 py-1 rounded">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {item.addedAt.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="movies">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {movieItems.map((item) => (
                    <div key={item.id} className="relative">
                      <MovieCard item={item} size="medium" className="w-full" />
                      <div className="absolute top-2 left-2 bg-netflix-600 text-white text-xs px-2 py-1 rounded">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {item.addedAt.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="tv">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                  {tvItems.map((item) => (
                    <div key={item.id} className="relative">
                      <MovieCard item={item} size="medium" className="w-full" />
                      <div className="absolute top-2 left-2 bg-netflix-600 text-white text-xs px-2 py-1 rounded">
                        <Calendar className="w-3 h-3 inline mr-1" />
                        {item.addedAt.toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyList;
