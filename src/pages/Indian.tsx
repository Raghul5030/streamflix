import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import MovieCard from "@/components/movie/MovieCard";
import MovieRow from "@/components/movie/MovieRow";
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
import { ArrowLeft, Filter, Search, Heart, Star, Film } from "lucide-react";
import { tmdbClient, Movie, TVShow } from "@/lib/tmdb";

const Indian: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [sortBy, setSortBy] = useState<
    "popular" | "newest" | "oldest" | "rating"
  >("popular");
  const [selectedContent, setSelectedContent] = useState<Movie | TVShow | null>(
    null,
  );
  const [showVideoPlayer, setShowVideoPlayer] = useState(false);

  // Indian language options
  const languages = [
    { code: "all", name: "All Indian Languages", flag: "🇮🇳" },
    { code: "hi", name: "Hindi (Bollywood)", flag: "🎬" },
    { code: "ta", name: "Tamil (Kollywood)", flag: "🎭" },
    { code: "te", name: "Telugu (Tollywood)", flag: "🎪" },
    { code: "ml", name: "Malayalam (Mollywood)", flag: "🎨" },
    { code: "bn", name: "Bengali", flag: "📚" },
    { code: "kn", name: "Kannada (Sandalwood)", flag: "🌟" },
  ];

  // Fetch Indian content
  const { data: indianMovies, isLoading: loadingIndian } = useQuery({
    queryKey: ["indian-movies"],
    queryFn: () => tmdbClient.getIndianMovies(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: bollywoodMovies, isLoading: loadingBollywood } = useQuery({
    queryKey: ["bollywood-movies"],
    queryFn: () => tmdbClient.getBollywoodMovies(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: tamilMovies, isLoading: loadingTamil } = useQuery({
    queryKey: ["tamil-movies"],
    queryFn: () => tmdbClient.getTamilMovies(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: teluguMovies, isLoading: loadingTelugu } = useQuery({
    queryKey: ["telugu-movies"],
    queryFn: () => tmdbClient.getTeluguMovies(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: malayalamMovies, isLoading: loadingMalayalam } = useQuery({
    queryKey: ["malayalam-movies"],
    queryFn: () => tmdbClient.getMalayalamMovies(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: indianTVShows, isLoading: loadingIndianTV } = useQuery({
    queryKey: ["indian-tv-shows"],
    queryFn: () => tmdbClient.getIndianTVShows(),
    staleTime: 5 * 60 * 1000,
  });

  const { data: trendingInIndia, isLoading: loadingTrending } = useQuery({
    queryKey: ["trending-in-india"],
    queryFn: () => tmdbClient.getTrendingInIndia("movie"),
    staleTime: 5 * 60 * 1000,
  });

  // Date-sorted Indian content
  const { data: newestIndianContent, isLoading: loadingNewest } = useQuery({
    queryKey: ["newest-indian-content", selectedLanguage],
    queryFn: () => {
      const params: Record<string, string> = {
        page: "1",
        sort_by: "release_date.desc",
        region: "IN",
        with_origin_country: "IN",
      };
      if (selectedLanguage !== "all") {
        params.with_original_language = selectedLanguage;
      }
      return tmdbClient.request("/discover/movie", params);
    },
    enabled: sortBy === "newest",
    staleTime: 5 * 60 * 1000,
  });

  const { data: oldestIndianContent, isLoading: loadingOldest } = useQuery({
    queryKey: ["oldest-indian-content", selectedLanguage],
    queryFn: () => {
      const params: Record<string, string> = {
        page: "1",
        sort_by: "release_date.asc",
        region: "IN",
        with_origin_country: "IN",
      };
      if (selectedLanguage !== "all") {
        params.with_original_language = selectedLanguage;
      }
      return tmdbClient.request("/discover/movie", params);
    },
    enabled: sortBy === "oldest",
    staleTime: 5 * 60 * 1000,
  });

  // Search Indian content
  const { data: searchResults, isLoading: loadingSearch } = useQuery({
    queryKey: ["search-indian", searchQuery],
    queryFn: () => tmdbClient.searchMovies(searchQuery),
    enabled: !!searchQuery.trim(),
    staleTime: 2 * 60 * 1000,
  });

  // Get filtered content based on language selection and sorting
  const getFilteredContent = () => {
    if (searchQuery.trim()) {
      return searchResults?.results || [];
    }

    // If date sorting is active, use date-sorted results
    if (sortBy === "newest") {
      return newestIndianContent?.results || [];
    }
    if (sortBy === "oldest") {
      return oldestIndianContent?.results || [];
    }

    // Default language-based filtering
    switch (selectedLanguage) {
      case "hi":
        return bollywoodMovies?.results || [];
      case "ta":
        return tamilMovies?.results || [];
      case "te":
        return teluguMovies?.results || [];
      case "ml":
        return malayalamMovies?.results || [];
      default:
        return indianMovies?.results || [];
    }
  };

  const filteredContent = getFilteredContent();
  const isLoading =
    loadingIndian ||
    loadingBollywood ||
    loadingTamil ||
    loadingTelugu ||
    loadingMalayalam ||
    loadingNewest ||
    loadingOldest ||
    loadingSearch;

  const handlePlayClick = (item: Movie | TVShow) => {
    setSelectedContent(item);
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
              <span className="text-4xl">🇮🇳</span>
              Indian Content
            </h1>
            <Badge variant="secondary" className="bg-orange-600 text-white">
              {filteredContent.length} items
            </Badge>
          </div>

          {/* Search and Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Input
                type="text"
                placeholder="Search Indian movies & shows..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-streaming-card border-streaming-card text-white placeholder:text-streaming-gray focus:border-orange-600 pr-10"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-streaming-gray" />
            </div>

            {/* Language Filter */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-streaming-gray" />
                <span className="text-streaming-gray-light">Language:</span>
              </div>

              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger className="w-56 bg-streaming-card border-streaming-card text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-streaming-card border-streaming-card">
                  {languages.map((lang) => (
                    <SelectItem
                      key={lang.code}
                      value={lang.code}
                      className="text-white hover:bg-streaming-darker"
                    >
                      <div className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        {lang.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Content Sections */}
          <div className="space-y-12">
            {/* Trending in India */}
            <MovieRow
              title="🔥 Trending in India"
              items={trendingInIndia?.results || []}
              isLoading={loadingTrending}
              onPlayClick={handlePlayClick}
            />

            {/* Bollywood Hits */}
            <MovieRow
              title="🎬 Bollywood Blockbusters"
              items={bollywoodMovies?.results || []}
              isLoading={loadingBollywood}
              onPlayClick={handlePlayClick}
            />

            {/* South Indian Cinema */}
            <MovieRow
              title="🎭 South Indian Cinema"
              items={tamilMovies?.results || []}
              isLoading={loadingTamil}
              onPlayClick={handlePlayClick}
            />

            {/* Telugu Movies */}
            <MovieRow
              title="🎪 Tollywood Hits"
              items={teluguMovies?.results || []}
              isLoading={loadingTelugu}
              onPlayClick={handlePlayClick}
            />

            {/* Malayalam Movies */}
            <MovieRow
              title="🎨 Mollywood Masterpieces"
              items={malayalamMovies?.results || []}
              isLoading={loadingMalayalam}
              onPlayClick={handlePlayClick}
            />

            {/* Indian TV Shows */}
            <MovieRow
              title="📺 Indian TV Shows"
              items={indianTVShows?.results || []}
              isLoading={loadingIndianTV}
              onPlayClick={handlePlayClick}
            />
          </div>

          {/* Tabs for Different Views */}
          <Tabs defaultValue="movies" className="w-full mt-12">
            <TabsList className="bg-streaming-card border-streaming-card mb-6">
              <TabsTrigger
                value="movies"
                className="data-[state=active]:bg-orange-600"
              >
                🎬 Movies
              </TabsTrigger>
              <TabsTrigger
                value="shows"
                className="data-[state=active]:bg-orange-600"
              >
                📺 TV Shows
              </TabsTrigger>
              <TabsTrigger
                value="regional"
                className="data-[state=active]:bg-orange-600"
              >
                🗣️ Regional
              </TabsTrigger>
            </TabsList>

            <TabsContent value="movies">
              {/* Main Content Grid */}
              {isLoading ? (
                <LoadingSkeleton />
              ) : filteredContent.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-in">
                  {filteredContent.map((item) => (
                    <MovieCard
                      key={item.id}
                      item={item}
                      size="medium"
                      className="w-full"
                      onPlayClick={handlePlayClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <Heart className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {searchQuery
                        ? "No Content Found"
                        : "No Indian Content Available"}
                    </h3>
                    <p className="text-streaming-gray mb-6">
                      {searchQuery
                        ? `No Indian content found matching "${searchQuery}". Try a different search.`
                        : "No Indian content available for the selected language."}
                    </p>
                    {searchQuery && (
                      <Button
                        onClick={() => setSearchQuery("")}
                        className="bg-orange-600 hover:bg-orange-700 text-white"
                      >
                        Clear Search
                      </Button>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="shows">
              {/* Indian TV Shows */}
              {loadingIndianTV ? (
                <LoadingSkeleton />
              ) : indianTVShows?.results ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 animate-fade-in">
                  {indianTVShows.results.map((show) => (
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
                  <Film className="w-16 h-16 text-orange-500 mx-auto mb-6" />
                  <p className="text-streaming-gray">
                    No Indian TV shows available
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="regional">
              {/* Regional Content by Language */}
              <div className="space-y-8">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {languages.slice(1).map((lang) => (
                    <Button
                      key={lang.code}
                      onClick={() => setSelectedLanguage(lang.code)}
                      variant={
                        selectedLanguage === lang.code ? "default" : "outline"
                      }
                      className={`h-auto p-4 flex flex-col items-center gap-2 ${
                        selectedLanguage === lang.code
                          ? "bg-orange-600 hover:bg-orange-700 text-white"
                          : "border-white/30 bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      <span className="text-2xl">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Video Player Modal */}
      {selectedContent && (
        <InSiteVideoPlayer
          item={selectedContent}
          isOpen={showVideoPlayer}
          onClose={() => setShowVideoPlayer(false)}
        />
      )}
    </div>
  );
};

export default Indian;
