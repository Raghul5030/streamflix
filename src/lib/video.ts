// Video streaming utilities and trailer integration

export interface VideoSource {
  url: string;
  quality: "240p" | "360p" | "480p" | "720p" | "1080p";
  format: "mp4" | "webm" | "hls";
}

export interface VideoTrailer {
  id: string;
  key: string;
  name: string;
  site: "YouTube" | "Vimeo";
  type: "Trailer" | "Teaser" | "Clip" | "Behind the Scenes";
  official: boolean;
}

// YouTube trailer integration
export const getYouTubeEmbedUrl = (key: string): string => {
  return `https://www.youtube.com/embed/${key}?autoplay=1&controls=1&rel=0&showinfo=0&modestbranding=1`;
};

export const getYouTubeThumbnail = (
  key: string,
  quality: "default" | "hq" | "maxres" = "hq",
): string => {
  const qualityMap = {
    default: "default",
    hq: "hqdefault",
    maxres: "maxresdefault",
  };
  return `https://img.youtube.com/vi/${key}/${qualityMap[quality]}.jpg`;
};

// Demo video sources (in a real app, these would come from your video CDN)
export const getDemoVideoSources = (movieId: number): VideoSource[] => {
  // These are sample video URLs - replace with your actual video streaming URLs
  return [
    {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
      quality: "720p",
      format: "mp4",
    },
    {
      url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      quality: "480p",
      format: "mp4",
    },
  ];
};

// Fetch video trailers from TMDB
export const fetchMovieTrailers = async (
  movieId: number,
  apiKey: string,
): Promise<VideoTrailer[]> => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch trailers: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching movie trailers:", error);
    return [];
  }
};

export const fetchTVTrailers = async (
  tvId: number,
  apiKey: string,
): Promise<VideoTrailer[]> => {
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${tvId}/videos?api_key=${apiKey}`,
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch trailers: ${response.statusText}`);
    }

    const data = await response.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching TV trailers:", error);
    return [];
  }
};

// Get the best trailer from available options
export const getBestTrailer = (
  trailers: VideoTrailer[],
): VideoTrailer | null => {
  if (!trailers.length) return null;

  // Prioritize official trailers from YouTube
  const officialTrailers = trailers.filter(
    (t) => t.official && t.site === "YouTube" && t.type === "Trailer",
  );

  if (officialTrailers.length) {
    return officialTrailers[0];
  }

  // Fall back to any YouTube trailer
  const youtubeTrailers = trailers.filter(
    (t) => t.site === "YouTube" && t.type === "Trailer",
  );

  if (youtubeTrailers.length) {
    return youtubeTrailers[0];
  }

  // Last resort: any video
  return trailers[0];
};

// Stream quality detection based on network
export const detectOptimalQuality = (): VideoSource["quality"] => {
  // In a real app, you'd detect network speed and device capabilities
  const connection = (navigator as any).connection;

  if (connection) {
    const effectiveType = connection.effectiveType;
    switch (effectiveType) {
      case "4g":
        return "1080p";
      case "3g":
        return "720p";
      case "2g":
        return "480p";
      default:
        return "720p";
    }
  }

  return "720p"; // Default quality
};
