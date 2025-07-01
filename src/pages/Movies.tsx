import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import MovieCard from "@/components/movie/MovieCard";
import InSiteVideoPlayer from "@/components/player/InSiteVideoPlayer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  Filter,
  Search,
  TrendingUp,
  Star,
  Calendar,
} from "lucide-react";
import { tmdbClient, Movie, TVShow } from "@/lib/tmdb";

const Movies: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "top_rated" | "upcoming">(
    "popular",
  );
  const [filterBy, setFilterBy] = useState<"all" | "2024" | "2023">("all");
  const [regionFilter, setRegionFilter] = useState<"global" | "indian">(
    "global",
  );
  const [selectedMovie, setSelectedMovie] = useState<Movie | TVShow | null>(
    null,
  );
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Fetch different movie categories
  const { data: popularMovies, isLoading: loadingPopular } = useQuery({
    queryKey: ["popular-movies-page", regionFilter],
    queryFn: () =>
      tmdbClient.getPopularMovies(
        1,
        regionFilter === "indian" ? "IN" : undefined,
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: topRatedMovies, isLoading: loadingTopRated } = useQuery({
    queryKey: ["top-rated-movies-page", regionFilter],
    queryFn: () =>
      tmdbClient.getTopRatedMovies(
        1,
        regionFilter === "indian" ? "IN" : undefined,
      ),
    staleTime: 5 * 60 * 1000,
  });

  const { data: upcomingMovies, isLoading: loadingUpcoming } = useQuery({
    queryKey: ["upcoming-movies-page", regionFilter],
    queryFn: () =>
      tmdbClient.getUpcomingMovies(
        1,
        regionFilter === "indian" ? "IN" : undefined,
      ),
    staleTime: 5 * 60 * 1000,
  });

  // Indian specific content
  const { data: indianMovies, isLoading: loadingIndian } = useQuery({
    queryKey: ["indian-movies-page"],
    queryFn: () => tmdbClient.getIndianMovies(),
    enabled: regionFilter === "indian",
    staleTime: 5 * 60 * 1000,
  });

  const { data: nowPlayingMovies, isLoading: loadingNowPlaying } = useQuery({
    queryKey: ["now-playing-movies"],
    queryFn: () => tmdbClient.getNowPlayingMovies(),
    staleTime: 5 * 60 * 1000,
  });

  // Search movies
  const { data: searchResults, isLoading: loadingSearch } = useQuery({
    queryKey: ["search-movies", searchQuery],
    queryFn: () => tmdbClient.searchMovies(searchQuery),
    enabled: !!searchQuery.trim(),
    staleTime: 2 * 60 * 1000,
  });

  // Get movies based on current sort and region
  const getCurrentMovies = () => {
    if (searchQuery.trim()) {
      return searchResults?.results || [];
    }

    if (regionFilter === "indian") {
      // For Indian content, prioritize Indian movies
      switch (sortBy) {
        case "top_rated":
          return topRatedMovies?.results || [];
        case "upcoming":
          return upcomingMovies?.results || [];
        default:
          return indianMovies?.results || popularMovies?.results || [];
      }
    }

    switch (sortBy) {
      case "top_rated":
        return topRatedMovies?.results || [];
      case "upcoming":
        return upcomingMovies?.results || [];
      default:
        return popularMovies?.results || [];
    }
  };

  // Filter movies by year if needed
  const getFilteredMovies = () => {
    const movies = getCurrentMovies();

    if (filterBy === "all") return movies;

    return movies.filter((movie) => {
      const year = movie.release_date
        ? new Date(movie.release_date).getFullYear()
        : 0;
      return year.toString() === filterBy;
    });
  };

  const filteredMovies = getFilteredMovies();
  const isLoading =
    loadingPopular || loadingTopRated || loadingUpcoming || loadingSearch;

  const handlePlayClick = (movie: Movie | TVShow) => {
    setSelectedMovie(movie);
    setShowVideoPlayer(true);
  };

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {Array.from({ length: 18 }).map((_, index) => (
        <Skeleton
          key={index}
          className="w-full h-72 bg-streaming-card rounded-lg"
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-streaming-dark">
      <Header />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="border-white/30 bg-white/20 text-white hover:bg-white/30"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <h1 className="text-3xl font-bold text-white">Movies</h1>
            <Badge variant="secondary" className="bg-netflix-600 text-white">
              {filteredMovies.length} movies
            </Badge>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-streaming-card border-streaming-card text-white placeholder:text-streaming-gray focus:border-netflix-600 pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-streaming-gray" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-streaming-gray" />
                <span className="text-streaming-gray-light">Filter:</span>
              </div>

              {/* Region Filter */}
              <Select
                value={regionFilter}
                onValueChange={(value: any) => setRegionFilter(value)}
              >
                <SelectTrigger className="w-36 bg-streaming-card border-streaming-card text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-streaming-card border-streaming-card">
                  <SelectItem
                    value="global"
                    className="text-white hover:bg-streaming-darker"
                  >
                    🌍 Global
                  </SelectItem>
                  <SelectItem
                    value="indian"
                    className="text-white hover:bg-streaming-darker"
                  >
                    🇮🇳 Indian
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={sortBy}
                onValueChange={(value: any) => setSortBy(value)}
              >
                <SelectTrigger className="w-40 bg-streaming-card border-streaming-card text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-streaming-card border-streaming-card">
                  <SelectItem
                    value="popular"
                    className="text-white hover:bg-streaming-darker"
                  >
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Popular
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="top_rated"
                    className="text-white hover:bg-streaming-darker"
                  >
                    <div className="flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      Top Rated
                    </div>
                  </SelectItem>
                  <SelectItem
                    value="upcoming"
                    className="text-white hover:bg-streaming-darker"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Upcoming
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={filterBy}
                onValueChange={(value: any) => setFilterBy(value)}
              >
                <SelectTrigger className="w-32 bg-streaming-card border-streaming-card text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-streaming-card border-streaming-card">
                  <SelectItem
                    value="all"
                    className="text-white hover:bg-streaming-darker"
                  >
                    All Years
                  </SelectItem>
                  <SelectItem
                    value="2024"
                    className="text-white hover:bg-streaming-darker"
                  >
                    2024
                  </SelectItem>
                  <SelectItem
                    value="2023"
                    className="text-white hover:bg-streaming-darker"
                  >
                    2023
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="bg-streaming-card border-streaming-card mb-6">
              <TabsTrigger
                value="all"
                className="data-[state=active]:bg-netflix-600"
              >
                All Movies
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="data-[state=active]:bg-netflix-600"
              >
                Now Playing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {/* Main Movies Grid */}
              {isLoading ? (
                <LoadingSkeleton />
              ) : filteredMovies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-in">
                  {filteredMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      item={movie}
                      size="medium"
                      className="w-full"
                      onPlayClick={handlePlayClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <Search className="w-16 h-16 text-streaming-gray mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {searchQuery ? "No Movies Found" : "No Movies Available"}
                    </h3>
                    <p className="text-streaming-gray mb-6">
                      {searchQuery
                        ? `No movies found matching "${searchQuery}". Try adjusting your search.`
                        : "No movies available for the selected filters."}
                    </p>
                    {searchQuery && (
                      <Button
                        onClick={() => setSearchQuery("")}
                        className="bg-netflix-600 hover:bg-netflix-700 text-white"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="trending">
              {/* Now Playing Movies */}
              {loadingNowPlaying ? (
                <LoadingSkeleton />
              ) : nowPlayingMovies?.results ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-in">
                  {nowPlayingMovies.results.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      item={movie}
                      size="medium"
                      className="w-full"
                      onPlayClick={handlePlayClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-streaming-gray">
                    No movies currently playing
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedMovie && (
        <InSiteVideoPlayer
          item={selectedMovie}
          isOpen={showVideoPlayer}
          onClose={() => setShowVideoPlayer(false)}
        />
      )}
    </div>
  );
};

export default Movies;
