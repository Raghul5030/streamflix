import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Play, Plus, Check, ThumbsUp, Info } from "lucide-react";
import { Movie, TVShow, TMDBClient } from "@/lib/tmdb";
import { useWishlist } from "@/contexts/WishlistContext";
import { showWishlistToast } from "@/lib/toast-utils";
import MovieDetailModal from "./MovieDetailModal";
import { cn } from "@/lib/utils";

interface MovieCardProps {
  item: Movie | TVShow;
  size?: "small" | "medium" | "large";
  showDetails?: boolean;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  item,
  size = "medium",
  showDetails = false,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isItemInWishlist = isInWishlist(item.id);

  const title = "title" in item ? item.title : item.name;
  const releaseDate =
    "release_date" in item ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";

  const sizeClasses = {
    small: "w-32 h-48",
    medium: "w-48 h-72",
    large: "w-64 h-96",
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log(`Playing: ${title}`, item);

    // Option 1: Open in modal (current behavior)
    setShowDetailModal(true);

    // Option 2: Navigate to dedicated video player page (uncomment to use)
    // const navigate = useNavigate();
    // const type = "title" in item ? "movie" : "tv";
    // navigate(`/watch?id=${item.id}&type=${type}`);
  };

  const handleAddToList = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isItemInWishlist) {
      const success = removeFromWishlist(item.id);
      if (success) {
        showWishlistToast.removed(item);
      } else {
        showWishlistToast.error("remove");
      }
    } else {
      const success = addToWishlist(item);
      if (success) {
        showWishlistToast.added(item);
      } else {
        showWishlistToast.error("add");
      }
    }
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    // In a real app, this would like/unlike the item
    console.log(`Liked: ${title}`);
  };

  const handleMoreInfo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDetailModal(true);
  };

  const handleCardClick = () => {
    setShowDetailModal(true);
  };

  return (
    <>
      <Card
        className={cn(
          "movie-card bg-streaming-card border-streaming-card group relative overflow-hidden cursor-pointer",
          sizeClasses[size],
          className,
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCardClick}
      >
        {/* Poster Image */}
        <div className="relative w-full h-full">
          {item.poster_path && (
            <img
              src={TMDBClient.getImageUrl(item.poster_path, "w500")}
              alt={title}
              className={cn(
                "w-full h-full object-cover transition-opacity duration-300",
                imageLoaded ? "opacity-100" : "opacity-0",
              )}
              onLoad={() => setImageLoaded(true)}
            />
          )}

          {/* Loading placeholder */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-streaming-darker animate-pulse flex items-center justify-center">
              <div className="w-12 h-12 border-2 border-netflix-600 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Hover controls */}
          <div
            className={cn(
              "absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0",
            )}
          >
            {/* Action buttons */}
            <div className="flex items-center gap-2 mb-3">
              <Button
                size="sm"
                className="bg-white text-black hover:bg-gray-200 p-2 h-8 w-8"
                onClick={handlePlayClick}
              >
                <Play className="w-4 h-4 fill-current" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className={cn(
                  "border-white/30 p-2 h-8 w-8",
                  isItemInWishlist
                    ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                    : "bg-black/50 text-white hover:bg-white/20",
                )}
                onClick={handleAddToList}
              >
                {isItemInWishlist ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 bg-black/50 text-white hover:bg-white/20 p-2 h-8 w-8"
                onClick={handleLike}
              >
                <ThumbsUp className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="border-white/30 bg-black/50 text-white hover:bg-white/20 p-2 h-8 w-8 ml-auto"
                onClick={handleMoreInfo}
              >
                <Info className="w-4 h-4" />
              </Button>
            </div>

            {/* Title and info */}
            <div className="space-y-1">
              <h3 className="text-white font-semibold text-sm line-clamp-2">
                {title}
              </h3>
              <div className="flex items-center gap-2">
                {year && (
                  <span className="text-streaming-gray-light text-xs">
                    {year}
                  </span>
                )}
                {item.vote_average > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    ⭐ {item.vote_average.toFixed(1)}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Rating badge (always visible) */}
          {item.vote_average > 0 && (
            <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
              ⭐ {item.vote_average.toFixed(1)}
            </div>
          )}
        </div>

        {/* Details section (for larger cards) */}
        {showDetails && size === "large" && (
          <div className="absolute bottom-0 left-0 right-0 bg-streaming-card/95 backdrop-blur-sm p-4 space-y-2">
            <h3 className="text-white font-semibold text-lg line-clamp-1">
              {title}
            </h3>
            {item.overview && (
              <p className="text-streaming-gray-light text-sm line-clamp-3">
                {item.overview}
              </p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-streaming-gray text-xs">{year}</span>
              <Badge variant="secondary" className="text-xs">
                {"title" in item ? "Movie" : "TV Show"}
              </Badge>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      <MovieDetailModal
        item={item}
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
      />
    </>
  );
};

export default MovieCard;
