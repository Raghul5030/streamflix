import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ExternalLink, X, ArrowLeft } from "lucide-react";
import { VideoTrailer } from "@/lib/video";
import { Movie, TVShow } from "@/lib/tmdb";

interface SimpleVideoPlayerProps {
  item: Movie | TVShow;
  trailers: VideoTrailer[];
  onClose: () => void;
  onBack?: () => void;
}

const SimpleVideoPlayer: React.FC<SimpleVideoPlayerProps> = ({
  item,
  trailers,
  onClose,
  onBack,
}) => {
  const [selectedTrailer, setSelectedTrailer] = useState<VideoTrailer | null>(
    trailers.length > 0 ? trailers[0] : null,
  );

  const title = "title" in item ? item.title : item.name;

  if (!selectedTrailer) {
    return (
      <div className="relative w-full h-full bg-black flex items-center justify-center">
        <div className="text-center">
          <Play className="w-16 h-16 text-white/50 mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">
            No Trailers Available
          </h3>
          <p className="text-white/70 mb-6">
            No video content is available for "{title}" at this time.
          </p>
          <Button
            onClick={onClose}
            className="bg-netflix-600 hover:bg-netflix-700"
          >
            Close
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-30 bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
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
              <h2 className="text-white text-lg font-semibold">{title}</h2>
              <p className="text-white/70 text-sm">{selectedTrailer.name}</p>
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
      </div>

      {/* Main content area */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center max-w-md px-6">
          {/* Large play button */}
          <div className="mb-8">
            <a
              href={`https://www.youtube.com/watch?v=${selectedTrailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block"
            >
              <div className="w-32 h-32 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105 shadow-2xl">
                <Play className="w-16 h-16 text-white fill-white ml-2" />
              </div>
            </a>
          </div>

          {/* Video info */}
          <h3 className="text-white text-2xl font-bold mb-4">
            {selectedTrailer.name}
          </h3>

          <div className="flex justify-center gap-2 mb-6">
            <Badge variant="destructive" className="bg-red-600">
              {selectedTrailer.type}
            </Badge>
            <Badge variant="outline" className="border-white/30 text-white">
              {selectedTrailer.site}
            </Badge>
            {selectedTrailer.official && (
              <Badge variant="default" className="bg-green-600">
                Official
              </Badge>
            )}
          </div>

          {/* Action buttons */}
          <div className="space-y-4">
            <a
              href={`https://www.youtube.com/watch?v=${selectedTrailer.key}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full"
            >
              <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3">
                <ExternalLink className="w-5 h-5 mr-2" />
                Watch on YouTube
              </Button>
            </a>

            {/* Quick Play Option */}
            <Button
              onClick={() =>
                window.open(
                  `https://www.youtube.com/watch?v=${selectedTrailer.key}`,
                  "_blank",
                )
              }
              variant="outline"
              className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <Play className="w-4 h-4 mr-2" />
              Quick Play (New Tab)
            </Button>
          </div>
        </div>
      </div>

      {/* Trailer selector at bottom */}
      {trailers.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="text-center">
            <p className="text-white text-sm mb-3">Choose Trailer:</p>
            <div className="flex justify-center gap-2 overflow-x-auto">
              {trailers.map((trailer) => (
                <Button
                  key={trailer.key}
                  onClick={() => setSelectedTrailer(trailer)}
                  variant={
                    selectedTrailer.key === trailer.key ? "default" : "outline"
                  }
                  size="sm"
                  className={`flex-shrink-0 ${
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
        </div>
      )}
    </div>
  );
};

export default SimpleVideoPlayer;
