
export interface Anime {
  mal_id: number;
  url: string;
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
  title: string;
  title_english: string;
  title_japanese: string;
  score: number;
  synopsis: string;
  year: number;
  genres: { mal_id: number; name: string }[];
}

export interface PaginationData {
  last_visible_page: number;
  has_next_page: boolean;
  current_page: number;
  items: {
    count: number;
    total: number;
    per_page: number;
  };
}

export interface AnimeApiResponse {
  data: Anime[];
  pagination: PaginationData;
}

export interface Genre {
  mal_id: number;
  name: string;
  count: number;
}

export interface GenreApiResponse {
  data: Genre[];
}

export interface Producer {
  mal_id: number;
  name: string;
}

export interface AnimeDetails extends Anime {
  episodes: number;
  status: string;
  rating: string;
  season: string;
  studios: { mal_id: number; name: string }[];
  producers: Producer[];
  trailer: {
    youtube_id: string | null;
    url: string | null;
  };
}

export interface AnimeDetailApiResponse {
  data: AnimeDetails;
}

export interface Character {
  character: {
    mal_id: number;
    url: string;
    images: {
      jpg: { image_url: string };
      webp: { image_url: string; small_image_url: string };
    };
    name: string;
  };
  role: string;
}

export interface CharacterApiResponse {
  data: Character[];
}
