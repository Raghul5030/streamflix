import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  Play,
  X,
  ArrowLeft,
  Youtube,
  Loader2,
  ExternalLink,
} from "lucide-react";
import { Movie, TVShow, TMDBClient } from "@/lib/tmdb";
import {
  fetchMovieTrailers,
  fetchTVTrailers,
  VideoTrailer,
  getBestTrailer,
} from "@/lib/video";

interface InSiteVideoPlayerProps {
  item: Movie | TVShow;
  isOpen: boolean;
  onClose: () => void;
}

const InSiteVideoPlayer: React.FC<InSiteVideoPlayerProps> = ({
  item,
  isOpen,
  onClose,
}) => {
  const [selectedTrailer, setSelectedTrailer] = useState<VideoTrailer | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);

  const title = "title" in item ? item.title : item.name;
  const backdropUrl = item.backdrop_path
    ? TMDBClient.getBackdropUrl(item.backdrop_path, "w1280")
    : "";

  // Fetch trailers
  const {
    data: trailers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["trailers", item.id, "title" in item ? "movie" : "tv"],
    queryFn: async () => {
      const apiKey = "b771da6ad545bff676e9d5f6bf07c87b";
      if ("title" in item) {
        return fetchMovieTrailers(item.id, apiKey);
      } else {
        return fetchTVTrailers(item.id, apiKey);
      }
    },
    enabled: isOpen,
    staleTime: 10 * 60 * 1000,
  });

  // Auto-select best trailer
  useEffect(() => {
    if (trailers && trailers.length > 0) {
      const bestTrailer = getBestTrailer(trailers);
      setSelectedTrailer(bestTrailer);
    }
  }, [trailers]);

  const handlePlayVideo = () => {
    setIsPlaying(true);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[95vw] h-[90vh] p-0 bg-black border-none">
        <div className="relative w-full h-full bg-black overflow-hidden">
          {/* Background Image */}
          {!isPlaying && backdropUrl && (
            <div className="absolute inset-0">
              <img
                src={backdropUrl}
                alt={title}
                className="w-full h-full object-cover opacity-30"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
            </div>
          )}

          {/* Header */}
          <div
            className={`absolute top-0 left-0 right-0 z-30 p-6 ${isPlaying ? "bg-black/50" : ""}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h1 className="text-white text-2xl font-bold">{title}</h1>
                {selectedTrailer && (
                  <Badge variant="destructive" className="bg-red-600">
                    {selectedTrailer.type}
                  </Badge>
                )}
              </div>
              <Button
                onClick={onClose}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-10 w-10"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          <div className="absolute inset-0 flex items-center justify-center z-20">
            {isLoading ? (
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
                <p className="text-white text-xl">Loading trailer...</p>
              </div>
            ) : error ? (
              <div className="text-center max-w-md px-6">
                <div className="w-32 h-32 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="w-16 h-16 text-red-500" />
                </div>
                <h2 className="text-white text-xl font-bold mb-4">
                  Unable to Load Trailer
                </h2>
                <p className="text-white/70 mb-6">
                  There was an issue loading the trailer for "{title}".
                </p>
                <Button
                  onClick={onClose}
                  className="bg-netflix-600 hover:bg-netflix-700 text-white"
                >
                  Close
                </Button>
              </div>
            ) : selectedTrailer && isPlaying ? (
              /* Video Player */
              <div className="w-full h-full">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=1&controls=1&rel=0&modestbranding=1&fs=1`}
                  title={selectedTrailer.name}
                  className="w-full h-full"
                  allow="autoplay; encrypted-media; fullscreen"
                  allowFullScreen
                  frameBorder="0"
                />
              </div>
            ) : selectedTrailer ? (
              /* Play Button Overlay */
              <div className="text-center max-w-lg px-6">
                {/* Giant Play Button */}
                <div className="mb-8">
                  <button onClick={handlePlayVideo} className="group">
                    <div className="w-32 h-32 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-xl relative">
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                      <Play className="w-16 h-16 text-white fill-white ml-2 relative z-10" />
                    </div>
                  </button>
                </div>

                {/* Trailer Info */}
                <h2 className="text-white text-2xl font-bold mb-4">
                  {selectedTrailer.name}
                </h2>

                <div className="flex justify-center gap-3 mb-8">
                  <Badge
                    variant="destructive"
                    className="bg-red-600 text-lg px-4 py-2"
                  >
                    <Youtube className="w-4 h-4 mr-2" />
                    {selectedTrailer.type}
                  </Badge>
                  {selectedTrailer.official && (
                    <Badge
                      variant="default"
                      className="bg-green-600 text-lg px-4 py-2"
                    >
                      Official
                    </Badge>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button
                    onClick={handlePlayVideo}
                    size="lg"
                    className="w-full bg-red-600 hover:bg-red-700 text-white text-xl py-6 font-bold"
                  >
                    <Play className="w-6 h-6 mr-3 fill-white" />
                    PLAY TRAILER
                  </Button>

                  <Button
                    onClick={() =>
                      window.open(
                        `https://www.youtube.com/watch?v=${selectedTrailer.key}`,
                        "_blank",
                      )
                    }
                    variant="outline"
                    size="lg"
                    className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 py-4"
                  >
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Open in YouTube
                  </Button>
                </div>

                {/* Multiple Trailers */}
                {trailers && trailers.length > 1 && (
                  <div className="mt-8">
                    <p className="text-white/70 mb-4 text-sm">
                      Other trailers available:
                    </p>
                    <div className="flex justify-center gap-2">
                      {trailers.slice(0, 3).map((trailer) => (
                        <Button
                          key={trailer.key}
                          onClick={() => setSelectedTrailer(trailer)}
                          variant={
                            selectedTrailer.key === trailer.key
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          className={`${
                            selectedTrailer.key === trailer.key
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                          }`}
                        >
                          {trailer.type}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* No trailers */
              <div className="text-center max-w-md px-6">
                <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Play className="w-16 h-16 text-white/50" />
                </div>
                <h2 className="text-white text-xl font-bold mb-4">
                  No Trailers Available
                </h2>
                <p className="text-white/70 mb-6">
                  No video content is available for "{title}" at this time.
                </p>
                <Button
                  onClick={onClose}
                  className="bg-netflix-600 hover:bg-netflix-700 text-white"
                >
                  Close
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InSiteVideoPlayer;
