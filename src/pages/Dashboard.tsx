import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import MovieRow from "@/components/movie/MovieRow";
import MovieCard from "@/components/movie/MovieCard";
import InSiteVideoPlayer from "@/components/player/InSiteVideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Play, Plus, Info, Volume2, VolumeX, RotateCcw } from "lucide-react";
import { tmdbClient, Movie, TVShow, TMDBClient } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

const Dashboard: React.FC = () => {
  const [featuredItem, setFeaturedItem] = useState<Movie | TVShow | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [countdown, setCountdown] = useState(10);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Fetch data using React Query
  const {
    data: trendingMovies,
    isLoading: loadingTrending,
    error: trendingError,
  } = useQuery({
    queryKey: ["trending-movies"],
    queryFn: () => tmdbClient.getTrendingMovies(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const {
    data: popularMovies,
    isLoading: loadingPopular,
    error: popularError,
  } = useQuery({
    queryKey: ["popular-movies"],
    queryFn: () => tmdbClient.getPopularMovies(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: topRatedMovies,
    isLoading: loadingTopRated,
    error: topRatedError,
  } = useQuery({
    queryKey: ["top-rated-movies"],
    queryFn: () => tmdbClient.getTopRatedMovies(),
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: popularTVShows,
    isLoading: loadingTV,
    error: tvError,
  } = useQuery({
    queryKey: ["popular-tv"],
    queryFn: () => tmdbClient.getPopularTVShows(),
    staleTime: 5 * 60 * 1000,
  });

  // Real-time auto-rotating featured content with countdown
  useEffect(() => {
    if (trendingMovies?.results && trendingMovies.results.length > 0 && !featuredItem) {
      // Set initial featured item
      const randomIndex = Math.floor(
        Math.random() * Math.min(5, trendingMovies.results.length),
      );
      setFeaturedItem(trendingMovies.results[randomIndex]);
    }
  }, [trendingMovies, featuredItem]);

  // Countdown timer
  useEffect(() => {
    if (!isAutoRotating) return;

    const countdownInterval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          // Time to rotate
          if (trendingMovies?.results && trendingMovies.results.length > 0) {
            const availableItems = trendingMovies.results.slice(0, 8);
            const currentIndex = availableItems.findIndex(
              item => item.id === featuredItem?.id
            );
            const nextIndex = (currentIndex + 1) % availableItems.length;
            setFeaturedItem(availableItems[nextIndex]);
          }
          return 10; // Reset countdown
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [isAutoRotating, featuredItem?.id, trendingMovies]);

  const handlePlay = () => {
    if (featuredItem) {
      setShowVideoPlayer(true);
    }
  };

  const handleAddToList = () => {
    if (featuredItem) {
      console.log(
        "Added to list:",
        "title" in featuredItem ? featuredItem.title : featuredItem.name,
      );
    }
  };

  const handleMoreInfo = () => {
    if (featuredItem) {
      setShowVideoPlayer(true);
    }
  };

  // Show API key setup message if there's an error
  if (trendingError && trendingError.message.includes("API key")) {
    return (
      <div className="min-h-screen bg-streaming-dark">
        <Header />
        <div className="pt-16 flex items-center justify-center min-h-screen">
          <div className="text-center max-w-md p-8 bg-streaming-card rounded-lg border border-streaming-card">
            <h2 className="text-xl font-bold text-white mb-4">
              TMDB API Key Required
            </h2>
            <p className="text-streaming-gray-light mb-6">
              To display real movie and TV show data, you need to add your TMDB
              API key to{" "}
              <code className="bg-streaming-darker px-2 py-1 rounded text-netflix-400">
                src/lib/tmdb.ts
              </code>
            </p>
            <div className="text-left bg-streaming-darker p-4 rounded mb-4">
              <p className="text-xs text-streaming-gray mb-2">
                1. Get a free API key from{" "}
                <a
                  href="https://www.themoviedb.org/settings/api"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-netflix-400 hover:text-netflix-300"
                >
                  TMDB
                </a>
              </p>
              <p className="text-xs text-streaming-gray">
                2. Add it to the TMDB_API_KEY variable in tmdb.ts
              </p>
            </div>
            <Button
              onClick={() => window.location.reload()}
              className="bg-netflix-600 hover:bg-netflix-700 text-white"
            >
              Reload Page
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const title = featuredItem
    ? "title" in featuredItem
      ? featuredItem.title
      : featuredItem.name
    : "";
  const overview = featuredItem?.overview || "";
  const backdropUrl = featuredItem?.backdrop_path
    ? TMDBClient.getBackdropUrl(featuredItem.backdrop_path, "original")
    : "";

  return (
    <div className="min-h-screen bg-streaming-dark">
      <Header />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        {/* Background Image */}
        {backdropUrl && (
          <div className="absolute inset-0">
            <img
              src={backdropUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-streaming-dark via-streaming-dark/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-streaming-dark via-transparent to-transparent" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl">
            {/* Title */}
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 animate-fade-in">
              {title}
            </h1>

            {/* Description */}
            {overview && (
              <p className="text-lg text-streaming-gray-light mb-6 line-clamp-3 animate-fade-in">
                {overview}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 mb-8 animate-fade-in">
              {featuredItem?.vote_average && (
                <Badge variant="secondary" className="bg-green-600 text-white">
                  ⭐ {featuredItem.vote_average.toFixed(1)}
                </Badge>
              )}
              <Badge variant="outline" className="border-white/30 text-white">
                {"title" in (featuredItem || {}) ? "Movie" : "TV Show"}
              </Badge>
              <span className="text-streaming-gray">
                {featuredItem && "release_date" in featuredItem
                  ? new Date(featuredItem.release_date).getFullYear()
                  : featuredItem && "first_air_date" in featuredItem
                    ? new Date(featuredItem.first_air_date).getFullYear()
                    : ""}
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-4 animate-fade-in">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-200 font-semibold text-lg px-8 transition-all hover:scale-105"
                onClick={handlePlay}
              >
                <Play className="w-6 h-6 mr-2 fill-current" />
                Play Trailer
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/20 text-white hover:bg-white/30 font-semibold text-lg px-8"
                onClick={handleMoreInfo}
              >
                <Info className="w-6 h-6 mr-2" />
                More Info
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 bg-white/20 text-white hover:bg-white/30 font-semibold px-4"
                onClick={handleAddToList}
              >
                <Plus className="w-6 h-6" />
              </Button>
            </div>


          </div>
        </div>

        {/* Volume Control */}
        <div className="absolute bottom-8 right-8 z-10">
          <Button
            variant="outline"
            size="sm"
            className="border-white/30 bg-white/20 text-white hover:bg-white/30 p-2 h-10 w-10"
            onClick={() => setIsMuted(!isMuted)}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
        </div>
      </section>

      {/* Content Rows */}
      <section className="relative z-10 -mt-32 pb-16">
        <div className="container mx-auto px-4 space-y-12">
          {/* Trending Now */}
          <MovieRow
            title="Trending Now"
            items={trendingMovies?.results || []}
            isLoading={loadingTrending}
          />

          {/* Popular Movies */}
          <MovieRow
            title="Popular Movies"
            items={popularMovies?.results || []}
            isLoading={loadingPopular}
          />

          {/* Top Rated Movies */}
          <MovieRow
            title="Top Rated Movies"
            items={topRatedMovies?.results || []}
            isLoading={loadingTopRated}
          />

          {/* Popular TV Shows */}
          <MovieRow
            title="Popular TV Shows"
            items={popularTVShows?.results || []}
            isLoading={loadingTV}
          />

          {/* Demo rows for additional content */}
          <MovieRow
            title="Action & Adventure"
            items={popularMovies?.results?.slice(0, 10) || []}
            isLoading={loadingPopular}
          />

          <MovieRow
            title="Comedy Movies"
            items={topRatedMovies?.results?.slice(5, 15) || []}
            isLoading={loadingTopRated}
          />

          <MovieRow
            title="Documentaries"
            items={trendingMovies?.results?.slice(3, 13) || []}
          )}
        </div>
      </section>

      {/* Video Player Modal */}
      {featuredItem && (
        <InSiteVideoPlayer
          item={featuredItem}
          isOpen={showVideoPlayer}
          onClose={() => setShowVideoPlayer(false)}
        />
      )}
    </div>
  );
};
};

export default Dashboard;