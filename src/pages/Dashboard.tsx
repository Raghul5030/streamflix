import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import MovieRow from "@/components/movie/MovieRow";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Plus, Info, Volume2, VolumeX } from "lucide-react";
import { tmdbClient, Movie, TVShow, TMDBClient } from "@/lib/tmdb";

const Dashboard: React.FC = () => {
  const [featuredItem, setFeaturedItem] = useState<Movie | TVShow | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  // Fetch data using React Query
  const {
    data: trendingMovies,
    isLoading: loadingTrending,
    error: trendingError,
  } = useQuery({
    queryKey: ["trending-movies"],
    queryFn: () => tmdbClient.getTrendingMovies(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: popularMovies, isLoading: loadingPopular } = useQuery({
    queryKey: ["popular-movies"],
    queryFn: () => tmdbClient.getPopularMovies(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: topRatedMovies, isLoading: loadingTopRated } = useQuery({
    queryKey: ["top-rated-movies"],
    queryFn: () => tmdbClient.getTopRatedMovies(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: popularTVShows, isLoading: loadingTV } = useQuery({
    queryKey: ["popular-tv"],
    queryFn: () => tmdbClient.getPopularTVShows(),
    staleTime: 5 * 60 * 1000,
  });

  // Set featured item from trending movies
  useEffect(() => {
    if (trendingMovies?.results && trendingMovies.results.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * Math.min(5, trendingMovies.results.length),
      );
      setFeaturedItem(trendingMovies.results[randomIndex]);
    }
  }, [trendingMovies]);

  const handlePlay = () => {
    if (featuredItem) {
      const title =
        "title" in featuredItem ? featuredItem.title : featuredItem.name;
      const searchQuery = encodeURIComponent(`${title} official trailer`);
      window.open(
        `https://www.youtube.com/results?search_query=${searchQuery}`,
        "_blank",
      );
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
      console.log(
        "More info:",
        "title" in featuredItem ? featuredItem.title : featuredItem.name,
      );
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
              API key.
            </p>
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
              {title || "Welcome to StreamFlix"}
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
                className="bg-white text-black hover:bg-gray-200 font-semibold text-lg px-8"
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
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
