const TMDB_API_KEY = "b771da6ad545bff676e9d5f6bf07c87b";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
  popularity: number;
  video: boolean;
}

export interface TVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  origin_country: string[];
  original_language: string;
  original_name: string;
  popularity: number;
}

export interface Genre {
  id: number;
  name: string;
}

export interface TMDBResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

class TMDBClient {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string = TMDB_API_KEY) {
    this.apiKey = apiKey;
    this.baseUrl = TMDB_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    params: Record<string, string> = {},
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error(
        "TMDB API key is required. Please set your API key in src/lib/tmdb.ts",
      );
    }

    const url = new URL(`${this.baseUrl}${endpoint}`);
    url.searchParams.append("api_key", this.apiKey);

    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(
        `TMDB API error: ${response.status} ${response.statusText}`,
      );
    }

    return response.json();
  }

  // Movie endpoints
  async getTrendingMovies(
    timeWindow: "day" | "week" = "week",
  ): Promise<TMDBResponse<Movie>> {
    return this.request(`/trending/movie/${timeWindow}`);
  }

  async getPopularMovies(
    page: number = 1,
    region?: string,
  ): Promise<TMDBResponse<Movie>> {
    const params: Record<string, string> = { page: page.toString() };
    if (region) params.region = region;
    return this.request("/movie/popular", params);
  }

  async getTopRatedMovies(
    page: number = 1,
    region?: string,
  ): Promise<TMDBResponse<Movie>> {
    const params: Record<string, string> = { page: page.toString() };
    if (region) params.region = region;
    return this.request("/movie/top_rated", params);
  }

  async getUpcomingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.request("/movie/upcoming", { page: page.toString() });
  }

  async getNowPlayingMovies(page: number = 1): Promise<TMDBResponse<Movie>> {
    return this.request("/movie/now_playing", { page: page.toString() });
  }

  async getMovieDetails(movieId: number): Promise<Movie> {
    return this.request(`/movie/${movieId}`);
  }

  // TV Show endpoints
  async getTrendingTVShows(
    timeWindow: "day" | "week" = "week",
  ): Promise<TMDBResponse<TVShow>> {
    return this.request(`/trending/tv/${timeWindow}`);
  }

  async getPopularTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.request("/tv/popular", { page: page.toString() });
  }

  async getTopRatedTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.request("/tv/top_rated", { page: page.toString() });
  }

  async getOnTheAirTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.request("/tv/on_the_air", { page: page.toString() });
  }

  async getAiringTodayTVShows(page: number = 1): Promise<TMDBResponse<TVShow>> {
    return this.request("/tv/airing_today", { page: page.toString() });
  }

  async getTVShowDetails(tvId: number): Promise<TVShow> {
    return this.request(`/tv/${tvId}`);
  }

  // Search endpoints
  async searchMovies(
    query: string,
    page: number = 1,
  ): Promise<TMDBResponse<Movie>> {
    return this.request("/search/movie", { query, page: page.toString() });
  }

  async searchTVShows(
    query: string,
    page: number = 1,
  ): Promise<TMDBResponse<TVShow>> {
    return this.request("/search/tv", { query, page: page.toString() });
  }

  async searchMulti(
    query: string,
    page: number = 1,
  ): Promise<TMDBResponse<Movie | TVShow>> {
    return this.request("/search/multi", { query, page: page.toString() });
  }

  // Genre endpoints
  async getMovieGenres(): Promise<{ genres: Genre[] }> {
    return this.request("/genre/movie/list");
  }

  async getTVGenres(): Promise<{ genres: Genre[] }> {
    return this.request("/genre/tv/list");
  }

  // Utility methods for image URLs
  static getImageUrl(
    path: string,
    size:
      | "w200"
      | "w300"
      | "w400"
      | "w500"
      | "w780"
      | "w1280"
      | "original" = "w500",
  ): string {
    if (!path) return "";
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }

  static getBackdropUrl(
    path: string,
    size: "w300" | "w780" | "w1280" | "original" = "w1280",
  ): string {
    if (!path) return "";
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
  }
}

export const tmdbClient = new TMDBClient();
export { TMDBClient };
export default TMDBClient;
