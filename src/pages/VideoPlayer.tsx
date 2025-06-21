import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import VideoPlayer from "@/components/player/VideoPlayer";
import { tmdbClient, Movie, TVShow } from "@/lib/tmdb";
import { Loader2 } from "lucide-react";

const VideoPlayerPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [item, setItem] = useState<Movie | TVShow | null>(null);

  const id = searchParams.get("id");
  const type = searchParams.get("type") as "movie" | "tv";

  // Fetch the specific movie or TV show details
  const { data: itemData, isLoading } = useQuery({
    queryKey: ["item-details", id, type],
    queryFn: async () => {
      if (!id || !type) throw new Error("Missing ID or type");

      const numericId = parseInt(id);
      if (type === "movie") {
        return tmdbClient.getMovieDetails(numericId);
      } else {
        return tmdbClient.getTVShowDetails(numericId);
      }
    },
    enabled: !!id && !!type,
  });

  useEffect(() => {
    if (itemData) {
      setItem(itemData);
    }
  }, [itemData]);

  const handleClose = () => {
    navigate(-1);
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!id || !type) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-xl mb-4">Invalid Video URL</h2>
          <button
            onClick={() => navigate("/dashboard")}
            className="text-netflix-500 hover:text-netflix-400"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (isLoading || !item) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white">Loading video...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <VideoPlayer
        item={item}
        onClose={handleClose}
        onBack={handleBack}
        className="w-full h-screen"
      />
    </div>
  );
};

export default VideoPlayerPage;
