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
  Tv,
} from "lucide-react";
import { tmdbClient, Movie, TVShow } from "@/lib/tmdb";

const TVShows: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "popular" | "top_rated" | "on_the_air" | "newest" | "oldest"
  >("popular");
  const [filterBy, setFilterBy] = useState<"all" | "2024" | "2023">("all");
  const [regionFilter, setRegionFilter] = useState<"global" | "indian">(
    "global",
  );
  const [selectedShow, setSelectedShow] = useState<Movie | TVShow | null>(null);
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Fetch different TV show categories
  const { data: popularTVShows, isLoading: loadingPopular } = useQuery({
    queryKey: ["popular-tv-shows-page"],
    queryFn: () => tmdbClient.getPopularTVShows(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: topRatedTVShows, isLoading: loadingTopRated } = useQuery({
    queryKey: ["top-rated-tv-shows-page"],
    queryFn: () => tmdbClient.getTopRatedTVShows(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: onTheAirTVShows, isLoading: loadingOnTheAir } = useQuery({
    queryKey: ["on-the-air-tv-shows"],
    queryFn: () => tmdbClient.getOnTheAirTVShows(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: airingTodayTVShows, isLoading: loadingAiringToday } = useQuery({
    queryKey: ["airing-today-tv-shows"],
    queryFn: () => tmdbClient.getAiringTodayTVShows(),
    staleTime: 5 * 60 * 1000,
  });

  // Indian TV Shows
  const { data: indianTVShows, isLoading: loadingIndianTV } = useQuery({
    queryKey: ["indian-tv-shows-page"],
    queryFn: () => tmdbClient.getIndianTVShows(),
    enabled: regionFilter === "indian",
    staleTime: 5 * 60 * 1000,
  });

  // Date-sorted TV shows
  const { data: newestTVShows, isLoading: loadingNewest } = useQuery({
    queryKey: ["newest-tv-shows", regionFilter],
    queryFn: () =>
      tmdbClient.request("/discover/tv", {
        page: "1",
        sort_by: "first_air_date.desc",
        ...(regionFilter === "indian" ? { with_origin_country: "IN" } : {}),
      }),
    enabled: sortBy === "newest",
    staleTime: 5 * 60 * 1000,
  });

  const { data: oldestTVShows, isLoading: loadingOldest } = useQuery({
    queryKey: ["oldest-tv-shows", regionFilter],
    queryFn: () =>
      tmdbClient.request("/discover/tv", {
        page: "1",
        sort_by: "first_air_date.asc",
        ...(regionFilter === "indian" ? { with_origin_country: "IN" } : {}),
      }),
    enabled: sortBy === "oldest",
    staleTime: 5 * 60 * 1000,
  });

  // Search TV shows
  const { data: searchResults, isLoading: loadingSearch } = useQuery({
    queryKey: ["search-tv-shows", searchQuery],
    queryFn: () => tmdbClient.searchTVShows(searchQuery),
    enabled: !!searchQuery.trim(),
    staleTime: 2 * 60 * 1000,
  });

  // Get TV shows based on current sort and region
  const getCurrentTVShows = () => {
    if (searchQuery.trim()) {
      return searchResults?.results || [];
    }

    if (regionFilter === "indian") {
      // For Indian content, prioritize Indian TV shows
      return indianTVShows?.results || popularTVShows?.results || [];
    }

    switch (sortBy) {
      case "top_rated":
        return topRatedTVShows?.results || [];
      case "on_the_air":
        return onTheAirTVShows?.results || [];
      default:
        return popularTVShows?.results || [];
    }
  };

  // Filter TV shows by year if needed
  const getFilteredTVShows = () => {
    const tvShows = getCurrentTVShows();

    if (filterBy === "all") return tvShows;

    return tvShows.filter((show) => {
      const year = show.first_air_date
        ? new Date(show.first_air_date).getFullYear()
        : 0;
      return year.toString() === filterBy;
    });
  };

  const filteredTVShows = getFilteredTVShows();
  const isLoading =
    loadingPopular || loadingTopRated || loadingOnTheAir || loadingSearch;

  const handlePlayClick = (show: Movie | TVShow) => {
    setSelectedShow(show);
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
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <Tv className="w-8 h-8 text-netflix-600" />
              TV Shows
            </h1>
            <Badge variant="secondary" className="bg-netflix-600 text-white">
              {filteredTVShows.length} shows
            </Badge>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Input
                type="text"
                placeholder="Search TV shows..."
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
                    value="on_the_air"
                    className="text-white hover:bg-streaming-darker"
                  >
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      On The Air
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
                All TV Shows
              </TabsTrigger>
              <TabsTrigger
                value="trending"
                className="data-[state=active]:bg-netflix-600"
              >
                Airing Today
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {/* Main TV Shows Grid */}
              {isLoading ? (
                <LoadingSkeleton />
              ) : filteredTVShows.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-in">
                  {filteredTVShows.map((show) => (
                    <MovieCard
                      key={show.id}
                      item={show}
                      size="medium"
                      className="w-full"
                      onPlayClick={handlePlayClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <Tv className="w-16 h-16 text-streaming-gray mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {searchQuery
                        ? "No TV Shows Found"
                        : "No TV Shows Available"}
                    </h3>
                    <p className="text-streaming-gray mb-6">
                      {searchQuery
                        ? `No TV shows found matching "${searchQuery}". Try adjusting your search.`
                        : "No TV shows available for the selected filters."}
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
              {/* Airing Today TV Shows */}
              {loadingAiringToday ? (
                <LoadingSkeleton />
              ) : airingTodayTVShows?.results ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-in">
                  {airingTodayTVShows.results.map((show) => (
                    <MovieCard
                      key={show.id}
                      item={show}
                      size="medium"
                      className="w-full"
                      onPlayClick={handlePlayClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Tv className="w-16 h-16 text-streaming-gray mx-auto mb-6" />
                  <p className="text-streaming-gray">
                    No TV shows airing today
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedShow && (
        <InSiteVideoPlayer
          item={selectedShow}
          isOpen={showVideoPlayer}
          onClose={() => setShowVideoPlayer(false)}
        />
      )}
    </div>
  );
};

export default TVShows;
