import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, ExternalLink, X, ArrowLeft, Youtube } from "lucide-react";
import { VideoTrailer } from "@/lib/video";
import { Movie, TVShow, TMDBClient } from "@/lib/tmdb";

interface DirectVideoLauncherProps {
  item: Movie | TVShow;
  trailers: VideoTrailer[];
  onClose: () => void;
  onBack?: () => void;
}

const DirectVideoLauncher: React.FC<DirectVideoLauncherProps> = ({
  item,
  trailers,
  onClose,
  onBack,
}) => {
  const title = "title" in item ? item.title : item.name;
  const backdropUrl = item.backdrop_path
    ? TMDBClient.getBackdropUrl(item.backdrop_path, "w1280")
    : "";

  const bestTrailer =
    trailers.find((t) => t.official && t.type === "Trailer") || trailers[0];

  return (
    <div className="relative w-full h-full bg-black overflow-hidden">
      {/* Background Image */}
      {backdropUrl && (
        <div className="absolute inset-0">
          <img
            src={backdropUrl}
            alt={title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
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
              <h1 className="text-white text-2xl font-bold">{title}</h1>
              <p className="text-white/70">Watch Trailer</p>
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
        <div className="text-center max-w-lg px-6">
          {bestTrailer ? (
            <>
              {/* Giant Play Button */}
              <div className="mb-8">
                <button
                  onClick={() =>
                    window.open(
                      `https://www.youtube.com/watch?v=${bestTrailer.key}`,
                      "_blank",
                    )
                  }
                  className="group"
                >
                  <div className="w-40 h-40 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl shadow-xl">
                    <Play className="w-20 h-20 text-white fill-white ml-3" />
                  </div>
                </button>
              </div>

              {/* Trailer Info */}
              <h2 className="text-white text-3xl font-bold mb-4">
                {bestTrailer.name}
              </h2>

              <div className="flex justify-center gap-3 mb-8">
                <Badge
                  variant="destructive"
                  className="bg-red-600 text-lg px-4 py-2"
                >
                  <Youtube className="w-4 h-4 mr-2" />
                  {bestTrailer.type}
                </Badge>
                {bestTrailer.official && (
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
                  onClick={() =>
                    window.open(
                      `https://www.youtube.com/watch?v=${bestTrailer.key}`,
                      "_blank",
                    )
                  }
                  size="lg"
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-xl py-6 font-bold"
                >
                  <ExternalLink className="w-6 h-6 mr-3" />
                  WATCH TRAILER ON YOUTUBE
                </Button>

                <Button
                  onClick={() =>
                    window.open(
                      `https://www.youtube.com/watch?v=${bestTrailer.key}`,
                      "_blank",
                    )
                  }
                  variant="outline"
                  size="lg"
                  className="w-full border-white/30 bg-white/10 text-white hover:bg-white/20 text-lg py-4"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Quick Play
                </Button>
              </div>

              {/* Additional trailers */}
              {trailers.length > 1 && (
                <div className="mt-8">
                  <p className="text-white/70 mb-4">More Trailers Available:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {trailers.slice(0, 3).map((trailer) => (
                      <Button
                        key={trailer.key}
                        onClick={() =>
                          window.open(
                            `https://www.youtube.com/watch?v=${trailer.key}`,
                            "_blank",
                          )
                        }
                        variant="outline"
                        className="border-white/20 bg-white/5 text-white hover:bg-white/15 justify-start"
                      >
                        <Play className="w-4 h-4 mr-3" />
                        <span className="flex-1 text-left">{trailer.name}</span>
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
            /* No trailers */
            <>
              <div className="w-32 h-32 bg-white/10 rounded-full flex items-center justify-center mb-6">
                <Play className="w-16 h-16 text-white/50" />
              </div>
              <h2 className="text-white text-2xl font-bold mb-4">
                No Trailers Available
              </h2>
              <p className="text-white/70 mb-8">
                Sorry, no video content is available for "{title}" at this time.
              </p>
              <Button
                onClick={onClose}
                className="bg-netflix-600 hover:bg-netflix-700 text-white"
              >
                Close
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="absolute bottom-0 left-0 right-0 z-30 p-6">
        <div className="text-center">
          <p className="text-white/50 text-sm">
            Trailers provided by The Movie Database (TMDb)
          </p>
        </div>
      </div>
    </div>
  );
};

export default DirectVideoLauncher;
