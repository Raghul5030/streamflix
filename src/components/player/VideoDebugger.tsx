import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { VideoTrailer } from "@/lib/video";
import { Movie, TVShow } from "@/lib/tmdb";
import { Play, ExternalLink, RefreshCw, Info } from "lucide-react";

interface VideoDebuggerProps {
  item: Movie | TVShow;
  trailers: VideoTrailer[];
  selectedTrailer: VideoTrailer | null;
  onTrailerSelect: (trailer: VideoTrailer) => void;
  isLoading: boolean;
  error?: Error | null;
}

const VideoDebugger: React.FC<VideoDebuggerProps> = ({
  item,
  trailers,
  selectedTrailer,
  onTrailerSelect,
  isLoading,
  error,
}) => {
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  const title = "title" in item ? item.title : item.name;

  return (
    <div className="absolute inset-0 bg-black/90 flex items-center justify-center z-20 p-8">
      <div className="bg-streaming-card border border-streaming-card rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Video Player Debug</h3>
          <Button
            onClick={() => setShowDebugInfo(!showDebugInfo)}
            variant="outline"
            size="sm"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Info className="w-4 h-4 mr-2" />
            {showDebugInfo ? "Hide" : "Show"} Debug Info
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <h4 className="text-lg font-semibold text-white mb-2">{title}</h4>
            <p className="text-streaming-gray text-sm">Movie ID: {item.id}</p>
            <p className="text-streaming-gray text-sm">
              Type: {"title" in item ? "Movie" : "TV Show"}
            </p>
          </div>

          {isLoading && (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 text-white animate-spin mx-auto mb-4" />
              <p className="text-white">Loading trailers...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-600/20 border border-red-600/50 rounded p-4">
              <h5 className="text-red-400 font-semibold mb-2">Error</h5>
              <p className="text-red-300 text-sm">{error.message}</p>
            </div>
          )}

          {trailers && trailers.length > 0 && (
            <div>
              <h5 className="text-white font-semibold mb-3">
                Available Trailers ({trailers.length})
              </h5>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {trailers.map((trailer) => (
                  <div
                    key={trailer.key}
                    className={`p-3 rounded border cursor-pointer transition-colors ${
                      selectedTrailer?.key === trailer.key
                        ? "border-netflix-600 bg-netflix-600/20"
                        : "border-streaming-card bg-streaming-darker hover:bg-streaming-card"
                    }`}
                    onClick={() => onTrailerSelect(trailer)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-white font-medium text-sm">
                          {trailer.name}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {trailer.type}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {trailer.site}
                          </Badge>
                          {trailer.official && (
                            <Badge
                              variant="default"
                              className="text-xs bg-green-600"
                            >
                              Official
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="ghost">
                          <Play className="w-4 h-4" />
                        </Button>
                        <a
                          href={`https://www.youtube.com/watch?v=${trailer.key}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Button size="sm" variant="ghost">
                            <ExternalLink className="w-4 h-4" />
                          </Button>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {trailers && trailers.length === 0 && !isLoading && (
            <div className="text-center py-8">
              <Play className="w-12 h-12 text-streaming-gray mx-auto mb-4" />
              <h5 className="text-white font-semibold mb-2">
                No Trailers Found
              </h5>
              <p className="text-streaming-gray text-sm">
                No video trailers are available for this content.
              </p>
            </div>
          )}

          {showDebugInfo && (
            <div className="bg-streaming-darker rounded p-4 space-y-2">
              <h5 className="text-white font-semibold">Debug Information</h5>
              <pre className="text-xs text-streaming-gray overflow-x-auto">
                {JSON.stringify(
                  {
                    itemId: item.id,
                    itemType: "title" in item ? "movie" : "tv",
                    trailersCount: trailers?.length || 0,
                    selectedTrailer: selectedTrailer
                      ? {
                          key: selectedTrailer.key,
                          name: selectedTrailer.name,
                          type: selectedTrailer.type,
                          site: selectedTrailer.site,
                        }
                      : null,
                    youtubeUrl: selectedTrailer
                      ? `https://www.youtube.com/watch?v=${selectedTrailer.key}`
                      : null,
                  },
                  null,
                  2,
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VideoDebugger;
