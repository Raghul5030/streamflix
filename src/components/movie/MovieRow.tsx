import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Movie, TVShow } from "@/lib/tmdb";
import MovieCard from "./MovieCard";
import { cn } from "@/lib/utils";

interface MovieRowProps {
  title: string;
  items: (Movie | TVShow)[];
  isLoading?: boolean;
  className?: string;
  onPlayClick?: (item: Movie | TVShow) => void;
}

const MovieRow: React.FC<MovieRowProps> = ({
  title,
  items,
  isLoading = false,
  className,
}) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    const newScrollLeft =
      direction === "left"
        ? container.scrollLeft - scrollAmount
        : container.scrollLeft + scrollAmount;

    container.scrollTo({
      left: newScrollLeft,
      behavior: "smooth",
    });
  };

  const LoadingSkeleton = () => (
    <div className="flex gap-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div
          key={index}
          className="w-48 h-72 bg-streaming-card rounded-lg animate-pulse flex-shrink-0"
        />
      ))}
    </div>
  );

  return (
    <div className={cn("movie-row-container", className)}>
      {/* Row header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">{title}</h2>
        {items.length > 0 && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-black/50 border-white/20 text-white hover:bg-white/20 p-2 h-8 w-8"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-black/50 border-white/20 text-white hover:bg-white/20 p-2 h-8 w-8"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Movie row */}
      <div className="relative group">
        {isLoading ? (
          <LoadingSkeleton />
        ) : items.length > 0 ? (
          <div
            ref={scrollContainerRef}
            className="movie-row flex gap-4 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0"
                style={{ scrollSnapAlign: "start" }}
              >
                <MovieCard item={item} size="medium" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-72 text-streaming-gray">
            <p>No content available</p>
          </div>
        )}

        {/* Scroll indicators (hidden on mobile) */}
        {!isLoading && items.length > 0 && (
          <>
            <Button
              variant="outline"
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-black/70 border-white/20 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:flex p-2 h-12 w-12"
              onClick={() => scroll("left")}
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>
            <Button
              variant="outline"
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-black/70 border-white/20 text-white hover:bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 hidden md:flex p-2 h-12 w-12"
              onClick={() => scroll("right")}
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MovieRow;
