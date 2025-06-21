import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import VideoPlayer from "@/components/player/VideoPlayer";
import SimpleVideoPlayer from "@/components/player/SimpleVideoPlayer";
import DirectVideoLauncher from "@/components/player/DirectVideoLauncher";
import EnhancedVideoPlayer from "@/components/player/EnhancedVideoPlayer";
import { useWishlist } from "@/contexts/WishlistContext";
import { useQuery } from "@tanstack/react-query";
import { fetchMovieTrailers, fetchTVTrailers } from "@/lib/video";
import {
  Play,
  Plus,
  Check,
  ThumbsUp,
  ThumbsDown,
  Share,
  Download,
  Star,
  Calendar,
  Clock,
  Users,
} from "lucide-react";
import { Movie, TVShow, TMDBClient } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface MovieDetailModalProps {
  item: Movie | TVShow | null;
  isOpen: boolean;
  onClose: () => void;
}

const MovieDetailModal: React.FC<MovieDetailModalProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const [showPlayer, setShowPlayer] = useState(false);
  const [userRating, setUserRating] = useState<"like" | "dislike" | null>(null);
  const [playerType, setPlayerType] = useState<
    "direct" | "simple" | "advanced"
  >("direct"); // Use direct launcher by default

  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isItemInWishlist = item ? isInWishlist(item.id) : false;

  // Fetch trailers for this item
  const { data: trailers } = useQuery({
    queryKey: ["trailers", item?.id, "title" in (item || {}) ? "movie" : "tv"],
    queryFn: async () => {
      if (!item) return [];
      const apiKey = "b771da6ad545bff676e9d5f6bf07c87b";
      if ("title" in item) {
        return fetchMovieTrailers(item.id, apiKey);
      } else {
        return fetchTVTrailers(item.id, apiKey);
      }
    },
    enabled: !!item,
    staleTime: 10 * 60 * 1000,
  });

  if (!item) return null;

  const title = "title" in item ? item.title : item.name;
  const releaseDate =
    "release_date" in item ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "";
  const backdropUrl = item.backdrop_path
    ? TMDBClient.getBackdropUrl(item.backdrop_path, "w1280")
    : "";
  const posterUrl = item.poster_path
    ? TMDBClient.getImageUrl(item.poster_path, "w500")
    : "";

  const handlePlay = () => {
    console.log("Opening video player for:", title, item);
    setShowPlayer(true);
  };

  const handleAddToList = () => {
    if (!item) return;

    if (isItemInWishlist) {
      const success = removeFromWishlist(item.id);
      if (success) {
        console.log(`Removed from wishlist: ${title}`);
      }
    } else {
      const success = addToWishlist(item);
      if (success) {
        console.log(`Added to wishlist: ${title}`);
      }
    }
  };

  const handleRating = (rating: "like" | "dislike") => {
    setUserRating(userRating === rating ? null : rating);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: title,
        text: item.overview,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      console.log("Link copied to clipboard");
    }
  };

  const handleDownload = () => {
    console.log(`Download: ${title}`);
  };

  if (showPlayer) {
    return (
      <Dialog open={isOpen} onOpenChange={() => {}}>
        <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 bg-black border-none">
          <EnhancedVideoPlayer
            item={item}
            onClose={() => setShowPlayer(false)}
            onBack={() => setShowPlayer(false)}
            autoPlay={true}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto bg-streaming-card border-streaming-card p-0">
        {/* Hero Section */}
        <div className="relative aspect-video">
          {backdropUrl ? (
            <img
              src={backdropUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-streaming-darker flex items-center justify-center">
              <Play className="w-16 h-16 text-streaming-gray" />
            </div>
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-streaming-card via-transparent to-transparent" />

          {/* Play button */}
          <Button
            onClick={handlePlay}
            className="absolute inset-0 bg-transparent hover:bg-black/20 w-full h-full flex items-center justify-center group"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-all">
              <Play className="w-10 h-10 text-white fill-white ml-1" />
            </div>
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Header */}
          <DialogHeader className="space-y-4">
            <div className="flex items-start gap-4">
              {posterUrl && (
                <img
                  src={posterUrl}
                  alt={title}
                  className="w-24 h-36 object-cover rounded-lg flex-shrink-0"
                />
              )}
              <div className="flex-1 space-y-2">
                <DialogTitle className="text-2xl font-bold text-white">
                  {title}
                </DialogTitle>

                {/* Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-sm">
                  {year && (
                    <div className="flex items-center gap-1 text-streaming-gray-light">
                      <Calendar className="w-4 h-4" />
                      {year}
                    </div>
                  )}

                  <Badge
                    variant="outline"
                    className="border-streaming-gray text-streaming-gray-light"
                  >
                    {"title" in item ? "Movie" : "TV Show"}
                  </Badge>

                  {item.vote_average > 0 && (
                    <div className="flex items-center gap-1 text-streaming-gray-light">
                      <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                      {item.vote_average.toFixed(1)}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-3 pt-2">
                  <Button
                    onClick={handlePlay}
                    className="bg-white text-black hover:bg-gray-200 font-semibold"
                  >
                    <Play className="w-4 h-4 mr-2 fill-current" />
                    Play
                  </Button>

                  <Button
                    onClick={handleAddToList}
                    variant="outline"
                    className={cn(
                      "border-white/30 font-semibold",
                      isItemInWishlist
                        ? "bg-green-600 text-white border-green-600 hover:bg-green-700"
                        : "bg-white/20 text-white hover:bg-white/30",
                    )}
                  >
                    {isItemInWishlist ? (
                      <Check className="w-4 h-4 mr-2" />
                    ) : (
                      <Plus className="w-4 h-4 mr-2" />
                    )}
                    {isItemInWishlist ? "In My List" : "Add to List"}
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleRating("like")}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "border-white/30 p-2 h-8 w-8",
                        userRating === "like"
                          ? "bg-green-600 text-white border-green-600"
                          : "bg-white/20 text-white hover:bg-white/30",
                      )}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={() => handleRating("dislike")}
                      variant="outline"
                      size="sm"
                      className={cn(
                        "border-white/30 p-2 h-8 w-8",
                        userRating === "dislike"
                          ? "bg-red-600 text-white border-red-600"
                          : "bg-white/20 text-white hover:bg-white/30",
                      )}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={handleShare}
                      variant="outline"
                      size="sm"
                      className="border-white/30 bg-white/20 text-white hover:bg-white/30 p-2 h-8 w-8"
                    >
                      <Share className="w-4 h-4" />
                    </Button>

                    <Button
                      onClick={handleDownload}
                      variant="outline"
                      size="sm"
                      className="border-white/30 bg-white/20 text-white hover:bg-white/30 p-2 h-8 w-8"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </DialogHeader>

          <Separator className="bg-streaming-gray/20" />

          {/* Description */}
          {item.overview && (
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-white">Overview</h3>
              <p className="text-streaming-gray-light leading-relaxed">
                {item.overview}
              </p>
            </div>
          )}

          <Separator className="bg-streaming-gray/20" />

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Details</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-streaming-gray">Rating:</span>
                  <span className="text-streaming-gray-light">
                    ⭐ {item.vote_average.toFixed(1)}/10
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-streaming-gray">Votes:</span>
                  <span className="text-streaming-gray-light">
                    {item.vote_count.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-streaming-gray">Release:</span>
                  <span className="text-streaming-gray-light">
                    {releaseDate
                      ? new Date(releaseDate).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-streaming-gray">Language:</span>
                  <span className="text-streaming-gray-light uppercase">
                    {item.original_language}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">
                Similar Content
              </h3>
              <p className="text-streaming-gray text-sm">
                Discover more content like this in your recommendations.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="border-white/30 bg-white/20 text-white hover:bg-white/30"
              >
                View Similar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieDetailModal;
