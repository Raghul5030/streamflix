import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  ExternalLink,
  X,
  ArrowLeft,
  Youtube,
  Search,
} from "lucide-react";
import { Movie, TVShow, TMDBClient } from "@/lib/tmdb";
import { fetchMovieTrailers, fetchTVTrailers, VideoTrailer } from "@/lib/video";

interface EnhancedVideoPlayerProps {
  item: Movie | TVShow;
  onClose: () => void;
  onBack?: () => void;
  autoPlay?: boolean;
}

const EnhancedVideoPlayer: React.FC<EnhancedVideoPlayerProps> = ({
  item,
  onClose,
  onBack,
  autoPlay = false,
}) => {
  const [selectedTrailer, setSelectedTrailer] = useState<VideoTrailer | null>(
    null,
  );
  const [showIframe, setShowIframe] = useState(false);

  const title = "title" in item ? item.title : item.name;
  const backdropUrl = item.backdrop_path
    ? TMDBClient.getBackdropUrl(item.backdrop_path, "w1280")
    : "";

  // Fetch trailers
  const { data: trailers, isLoading } = useQuery({
    queryKey: ["trailers", item.id, "title" in item ? "movie" : "tv"],
    queryFn: async () => {
      const apiKey = "b771da6ad545bff676e9d5f6bf07c87b";
      if ("title" in item) {
        return fetchMovieTrailers(item.id, apiKey);
      } else {
        return fetchTVTrailers(item.id, apiKey);
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  // Auto-select best trailer
  useEffect(() => {
    if (trailers && trailers.length > 0) {
      const bestTrailer =
        trailers.find((t) => t.official && t.type === "Trailer") || trailers[0];
      setSelectedTrailer(bestTrailer);

      if (autoPlay && bestTrailer) {
        // Auto-open YouTube in new tab
        setTimeout(() => {
          window.open(
            `https://www.youtube.com/watch?v=${bestTrailer.key}`,
            "_blank",
          );
        }, 1000);
      }
    }
  }, [trailers, autoPlay]);

  const playDirectly = (trailer: VideoTrailer) => {
    window.open(`https://www.youtube.com/watch?v=${trailer.key}`, "_blank");
  };

  const searchYouTube = () => {
    const searchQuery = encodeURIComponent(`${title} official trailer`);
    window.open(
      `https://www.youtube.com/results?search_query=${searchQuery}`,
      "_blank",
    );
  };

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Background */}
      {backdropUrl && (
        <div className="absolute inset-0">
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>
      )}

      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-10 w-10"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h1 className="text-white text-3xl font-bold">{title}</h1>
              <p className="text-white/70 text-lg">Choose how to watch</p>
            </div>
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
        <div className="text-center max-w-2xl px-6">
          {isLoading ? (
            <div className="animate-pulse">
              <div className="w-32 h-32 bg-white/20 rounded-full mx-auto mb-8 flex items-center justify-center">
                <Play className="w-16 h-16 text-white" />
              </div>
              <p className="text-white text-xl">Loading trailers...</p>
            </div>
          ) : selectedTrailer ? (
            <>
              {/* Giant Play Button */}
              <div className="mb-8">
                <button
                  onClick={() => playDirectly(selectedTrailer)}
                  className="group"
                >
                  <div className="w-40 h-40 bg-gradient-to-br from-red-600 to-red-800 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
                    <Play className="w-20 h-20 text-white fill-white ml-3 relative z-10" />
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
                    Official Trailer
                  </Badge>
                )}
              </div>

              {/* Action Options */}
              <div className="space-y-4 mb-8">
                <Button
                  onClick={() => playDirectly(selectedTrailer)}
                  size="lg"
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xl py-6 font-bold"
                >
                  <ExternalLink className="w-6 h-6 mr-3" />
                  WATCH ON YOUTUBE
                </Button>

                <div className="grid grid-cols-2 gap-4">
                  <Button
                    onClick={() => setShowIframe(!showIframe)}
                    variant="outline"
                    size="lg"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20 py-4"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Try Embed
                  </Button>

                  <Button
                    onClick={searchYouTube}
                    variant="outline"
                    size="lg"
                    className="border-white/30 bg-white/10 text-white hover:bg-white/20 py-4"
                  >
                    <Search className="w-5 h-5 mr-2" />
                    Search More
                  </Button>
                </div>
              </div>

              {/* Embedded Player */}
              {showIframe && (
                <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedTrailer.key}?autoplay=1&controls=1&rel=0`}
                    title={selectedTrailer.name}
                    className="w-full aspect-video"
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
                  />
                </div>
              )}

              {/* Other Trailers */}
              {trailers && trailers.length > 1 && (
                <div className="mt-8">
                  <h3 className="text-white text-lg font-semibold mb-4">
                    Other Trailers
                  </h3>
                  <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                    {trailers
                      .filter((t) => t.key !== selectedTrailer.key)
                      .slice(0, 4)
                      .map((trailer) => (
                        <Button
                          key={trailer.key}
                          onClick={() => setSelectedTrailer(trailer)}
                          variant="outline"
                          className="border-white/20 bg-white/5 text-white hover:bg-white/15 justify-start"
                        >
                          <Play className="w-4 h-4 mr-3" />
                          <span className="flex-1 text-left">
                            {trailer.name}
                          </span>
                          <Badge variant="secondary" className="ml-2">
                            {trailer.type}
                          </Badge>
                        </Button>
                      ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* No trailers fallback */
            <>
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-6">
                <Play className="w-16 h-16 text-white/50" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-4">
                No Official Trailers
              </h2>
              <p className="text-white/70 mb-8">
                Let's search YouTube for "{title}" content
              </p>
              <Button
                onClick={searchYouTube}
                size="lg"
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8"
              >
                <Search className="w-5 h-5 mr-2" />
                Search YouTube
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedVideoPlayer;
