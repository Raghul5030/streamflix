import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/layout/Header";
import MovieCard from "@/components/movie/MovieCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon, Filter, X, ArrowLeft } from "lucide-react";
import { tmdbClient, Movie, TVShow } from "@/lib/tmdb";
import { cn } from "@/lib/utils";

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedFilter, setSelectedFilter] = useState<"all" | "movie" | "tv">(
    "all",
  );
  const navigate = useNavigate();

  const {
    data: searchResults,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["search", query, selectedFilter],
    queryFn: async () => {
      if (!query.trim()) return { results: [] };

      if (selectedFilter === "movie") {
        return tmdbClient.searchMovies(query);
      } else if (selectedFilter === "tv") {
        return tmdbClient.searchTVShows(query);
      } else {
        return tmdbClient.searchMulti(query);
      }
    },
    enabled: !!query.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setQuery(queryParam);
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchParams({ q: query.trim() });
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearchParams({});
  };

  const filterOptions = [
    { value: "all", label: "All", count: searchResults?.results?.length || 0 },
    {
      value: "movie",
      label: "Movies",
      count:
        searchResults?.results?.filter((item) => "title" in item)?.length || 0,
    },
    {
      value: "tv",
      label: "TV Shows",
      count:
        searchResults?.results?.filter((item) => "name" in item)?.length || 0,
    },
  ];

  const filteredResults = searchResults?.results?.filter((item) => {
    if (selectedFilter === "movie") return "title" in item;
    if (selectedFilter === "tv") return "name" in item;
    return true;
  });

  const LoadingSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {Array.from({ length: 12 }).map((_, index) => (
        <Skeleton key={index} className="w-full h-72 bg-streaming-card" />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-streaming-dark">
      <Header />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Navigation */}
          <div className="mb-6">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          {/* Search Section */}
          <div className="max-w-2xl mx-auto mb-8">
            <form onSubmit={handleSearch} className="relative mb-6">
              <Input
                type="text"
                placeholder="Search for movies, TV shows, people..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="bg-streaming-card border-streaming-card text-white placeholder:text-streaming-gray focus:border-netflix-600 pr-20 text-lg h-14"
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-2">
                {query && (
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={clearSearch}
                    className="text-streaming-gray hover:text-white p-2 h-8 w-8"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  type="submit"
                  size="sm"
                  className="bg-netflix-600 hover:bg-netflix-700 text-white p-2 h-10 w-10"
                  disabled={!query.trim()}
                >
                  <SearchIcon className="w-5 h-5" />
                </Button>
              </div>
            </form>

            {/* Popular searches */}
            {!query && (
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Popular Searches
                </h3>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    "Marvel",
                    "Netflix",
                    "Action",
                    "Comedy",
                    "Horror",
                    "Thriller",
                    "Drama",
                    "Sci-Fi",
                  ].map((term) => (
                    <Badge
                      key={term}
                      variant="outline"
                      className="border-streaming-card bg-streaming-card text-streaming-gray-light hover:bg-streaming-card-hover cursor-pointer"
                      onClick={() => {
                        setQuery(term);
                        setSearchParams({ q: term });
                      }}
                    >
                      {term}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Section */}
          {query && (
            <>
              {/* Filters */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Filter className="w-5 h-5 text-streaming-gray" />
                  <span className="text-streaming-gray-light">Filter:</span>
                </div>
                <div className="flex gap-2">
                  {filterOptions.map((option) => (
                    <Button
                      key={option.value}
                      variant={
                        selectedFilter === option.value ? "default" : "outline"
                      }
                      size="sm"
                      className={cn(
                        selectedFilter === option.value
                          ? "bg-netflix-600 hover:bg-netflix-700 text-white"
                          : "border-streaming-card bg-streaming-card text-streaming-gray-light hover:bg-streaming-card-hover",
                      )}
                      onClick={() =>
                        setSelectedFilter(option.value as typeof selectedFilter)
                      }
                    >
                      {option.label} ({option.count})
                    </Button>
                  ))}
                </div>
              </div>

              {/* Search Header */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Search Results for "{query}"
                </h2>
                <p className="text-streaming-gray">
                  {isLoading
                    ? "Searching..."
                    : `${filteredResults?.length || 0} results found`}
                </p>
              </div>

              {/* Results Grid */}
              {isLoading ? (
                <LoadingSkeleton />
              ) : error ? (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-xl font-semibold text-white mb-4">
                      Search Error
                    </h3>
                    <p className="text-streaming-gray mb-6">
                      There was an error searching for content. Please try again
                      later.
                    </p>
                    <Button
                      onClick={() => window.location.reload()}
                      className="bg-netflix-600 hover:bg-netflix-700 text-white"
                    >
                      Try Again
                    </Button>
                  </div>
                </div>
              ) : filteredResults && filteredResults.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
                  {filteredResults.map((item) => (
                    <MovieCard
                      key={item.id}
                      item={item as Movie | TVShow}
                      size="medium"
                      className="w-full"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="max-w-md mx-auto">
                    <SearchIcon className="w-16 h-16 text-streaming-gray mx-auto mb-6" />
                    <h3 className="text-xl font-semibold text-white mb-4">
                      No Results Found
                    </h3>
                    <p className="text-streaming-gray mb-6">
                      We couldn't find any{" "}
                      {selectedFilter !== "all"
                        ? selectedFilter + "s"
                        : "content"}{" "}
                      matching "{query}". Try adjusting your search terms or
                      filters.
                    </p>
                    <div className="space-y-2">
                      <Button
                        onClick={clearSearch}
                        className="bg-netflix-600 hover:bg-netflix-700 text-white w-full"
                      >
                        Clear Search
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setSelectedFilter("all")}
                        className="border-streaming-card bg-streaming-card text-streaming-gray-light hover:bg-streaming-card-hover w-full"
                      >
                        Show All Results
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
