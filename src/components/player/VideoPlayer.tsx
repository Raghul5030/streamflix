import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import VideoDebugger from "./VideoDebugger";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  SkipBack,
  SkipForward,
  Settings,
  X,
  ArrowLeft,
  Loader2,
  Bug,
} from "lucide-react";
import {
  fetchMovieTrailers,
  fetchTVTrailers,
  getBestTrailer,
  getYouTubeEmbedUrl,
  VideoTrailer,
} from "@/lib/video";
import { Movie, TVShow } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

interface VideoPlayerProps {
  item: Movie | TVShow;
  onClose: () => void;
  onBack?: () => void;
  className?: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  item,
  onClose,
  onBack,
  className,
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState<VideoTrailer | null>(
    null,
  );
  const [showDebugger, setShowDebugger] = useState(false);

  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();

  const title = "title" in item ? item.title : item.name;
  const description = item.overview;

  // Fetch trailers for the current item
  const {
    data: trailers,
    isLoading: loadingTrailers,
    error: trailersError,
  } = useQuery({
    queryKey: ["trailers", item.id, "title" in item ? "movie" : "tv"],
    queryFn: async () => {
      const apiKey = "b771da6ad545bff676e9d5f6bf07c87b";
      console.log(`Fetching trailers for ${title} (ID: ${item.id})`);

      if ("title" in item) {
        const result = await fetchMovieTrailers(item.id, apiKey);
        console.log("Movie trailers:", result);
        return result;
      } else {
        const result = await fetchTVTrailers(item.id, apiKey);
        console.log("TV trailers:", result);
        return result;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
  });

  // Select the best trailer when trailers are loaded
  useEffect(() => {
    if (trailers && trailers.length > 0) {
      const bestTrailer = getBestTrailer(trailers);
      console.log("Selected trailer:", bestTrailer);
      setSelectedTrailer(bestTrailer);
    } else if (trailers && trailers.length === 0) {
      console.log("No trailers found for", title);
    }
  }, [trailers, title]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      if (playerRef.current?.requestFullscreen) {
        playerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleTrailerSelect = (trailer: VideoTrailer) => {
    setSelectedTrailer(trailer);
  };

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={playerRef}
      className={cn(
        "relative bg-black overflow-hidden",
        isFullscreen ? "fixed inset-0 z-50" : "rounded-lg aspect-video w-full",
        className,
      )}
      onMouseMove={handleMouseMove}
    >
      {/* Video Content */}
      <div className="relative w-full h-full">
        {loadingTrailers ? (
          // Loading state
          <div className="w-full h-full bg-streaming-darker flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
              <p className="text-white">Loading trailers for {title}...</p>
              <p className="text-white/70 text-sm mt-2">Movie ID: {item.id}</p>
            </div>
          </div>
        ) : trailersError ? (
          // Error state
          <div className="w-full h-full bg-streaming-darker flex items-center justify-center">
            <div className="text-center max-w-md px-6">
              <Play className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">
                Error Loading Video
              </h3>
              <p className="text-white/70 text-sm mb-4">
                Failed to load video content for "{title}". Please try again.
              </p>
              <p className="text-red-400 text-xs">
                Error: {trailersError.message}
              </p>
            </div>
          </div>
        ) : selectedTrailer ? (
          // Multi-option video player
          <div className="relative w-full h-full bg-black">
            {/* Option 1: Direct YouTube iframe (most compatible) */}
            <div className="absolute inset-0">
              <iframe
                key={`yt-${selectedTrailer.key}`}
                src={`https://www.youtube-nocookie.com/embed/${selectedTrailer.key}?autoplay=1&controls=1&rel=0&modestbranding=1&fs=1`}
                title={selectedTrailer.name}
                className="w-full h-full border-0"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>

            {/* Fallback poster with play button */}
            <div
              className="absolute inset-0 bg-black/50 flex items-center justify-center group cursor-pointer"
              onClick={() =>
                window.open(
                  `https://www.youtube.com/watch?v=${selectedTrailer.key}`,
                  "_blank",
                )
              }
            >
              <div className="text-center">
                <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center mb-4 group-hover:bg-red-700 transition-colors">
                  <Play className="w-10 h-10 text-white fill-white ml-1" />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">
                  {selectedTrailer.name}
                </h3>
                <p className="text-white/70 text-sm mb-4">
                  Click to watch trailer
                </p>
                <Badge variant="destructive" className="bg-red-600">
                  {selectedTrailer.type} • {selectedTrailer.site}
                </Badge>
              </div>
            </div>

            {/* Video controls overlay */}
            <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20 pointer-events-none">
              <div className="bg-black/90 text-white text-sm px-3 py-2 rounded backdrop-blur-sm pointer-events-auto">
                🎬 {selectedTrailer.name}
              </div>
              <div className="flex gap-2 pointer-events-auto">
                <a
                  href={`https://www.youtube.com/watch?v=${selectedTrailer.key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                >
                  Open YouTube
                </a>
              </div>
            </div>

            {/* Trailer selector */}
            {trailers && trailers.length > 1 && (
              <div className="absolute bottom-20 left-4 right-4 z-20">
                <div className="bg-black/90 rounded p-3 backdrop-blur-sm">
                  <p className="text-white text-sm mb-2">Available Trailers:</p>
                  <div className="flex gap-2 overflow-x-auto">
                    {trailers.slice(0, 5).map((trailer) => (
                      <Button
                        key={trailer.key}
                        onClick={() => setSelectedTrailer(trailer)}
                        variant={
                          selectedTrailer.key === trailer.key
                            ? "default"
                            : "outline"
                        }
                        size="sm"
                        className={cn(
                          "flex-shrink-0 text-xs",
                          selectedTrailer.key === trailer.key
                            ? "bg-red-600 hover:bg-red-700 text-white"
                            : "border-white/30 bg-white/10 text-white hover:bg-white/20",
                        )}
                      >
                        {trailer.type}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : trailers && trailers.length === 0 ? (
          // No trailers found
          <div className="w-full h-full bg-streaming-darker flex items-center justify-center">
            <div className="text-center max-w-md px-6">
              <Play className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">
                No Trailers Available
              </h3>
              <p className="text-white/70 text-sm mb-4">
                No video trailers are available for "{title}" at this time.
              </p>
              <p className="text-white/50 text-xs">
                Movie ID: {item.id} | Type:{" "}
                {"title" in item ? "Movie" : "TV Show"}
              </p>
            </div>
          </div>
        ) : (
          // Fallback state
          <div className="w-full h-full bg-streaming-darker flex items-center justify-center">
            <div className="text-center max-w-md px-6">
              <Play className="w-16 h-16 text-white/50 mx-auto mb-4" />
              <h3 className="text-white text-lg font-semibold mb-2">
                Loading Video Content
              </h3>
              <p className="text-white/70 text-sm">
                Preparing video for "{title}"...
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Controls overlay */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 transition-opacity duration-300",
          showControls || !selectedTrailer ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-8 w-8"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <div>
              <h3 className="text-white font-semibold text-lg">{title}</h3>
              {selectedTrailer && (
                <p className="text-white/70 text-sm">{selectedTrailer.name}</p>
              )}
            </div>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-2 h-8 w-8"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Trailer selection */}
        {trailers && trailers.length > 1 && (
          <div className="absolute bottom-16 left-4 right-4">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {trailers.slice(0, 5).map((trailer) => (
                <Button
                  key={trailer.id}
                  onClick={() => handleTrailerSelect(trailer)}
                  variant={
                    selectedTrailer?.id === trailer.id ? "default" : "outline"
                  }
                  size="sm"
                  className={cn(
                    "flex-shrink-0",
                    selectedTrailer?.id === trailer.id
                      ? "bg-netflix-600 hover:bg-netflix-700 text-white"
                      : "border-white/30 bg-white/10 text-white hover:bg-white/20",
                  )}
                >
                  <Badge variant="secondary" className="mr-2 text-xs">
                    {trailer.type}
                  </Badge>
                  {trailer.name}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Bottom controls */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {description && (
                <p className="text-white/70 text-sm max-w-md line-clamp-2">
                  {description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setShowDebugger(true)}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-8 w-8"
                title="Debug Video"
              >
                <Bug className="w-4 h-4" />
              </Button>

              <Button
                onClick={toggleFullscreen}
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 p-2 h-8 w-8"
              >
                {isFullscreen ? (
                  <Minimize className="w-4 h-4" />
                ) : (
                  <Maximize className="w-4 h-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Debugger */}
      {showDebugger && (
        <VideoDebugger
          item={item}
          trailers={trailers || []}
          selectedTrailer={selectedTrailer}
          onTrailerSelect={(trailer) => {
            setSelectedTrailer(trailer);
            setShowDebugger(false);
          }}
          isLoading={loadingTrailers}
          error={trailersError}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
