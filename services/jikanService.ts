
import { AnimeApiResponse, GenreApiResponse, AnimeDetailApiResponse, CharacterApiResponse } from '../types';

const API_BASE_URL = 'https://api.jikan.moe/v4';

interface SearchParams {
  page?: number;
  q?: string;
  genres?: string; // genre IDs comma separated
  limit?: number;
}

export const jikanService = {
  searchAnime: async (params: SearchParams, signal: AbortSignal): Promise<AnimeApiResponse> => {
    const urlParams = new URLSearchParams();
    if (params.page) urlParams.append('page', params.page.toString());
    if (params.q) urlParams.append('q', params.q);
    if (params.genres) urlParams.append('genres', params.genres);
    if (params.limit) urlParams.append('limit', params.limit.toString());
    
    const response = await fetch(`${API_BASE_URL}/anime?${urlParams.toString()}`, { signal });
    if (!response.ok) {
      throw new Error('Failed to fetch anime');
    }
    return response.json();
  },

  getGenres: async (): Promise<GenreApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/genres/anime`);
     if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }
    return response.json();
  },

  getAnimeById: async (id: number): Promise<AnimeDetailApiResponse> => {
    const response = await fetch(`${API_BASE_URL}/anime/${id}/full`);
     if (!response.ok) {
      throw new Error(`Failed to fetch anime with id ${id}`);
    }
    return response.json();
  },

  getAnimeCharacters: async (id: number): Promise<CharacterApiResponse> => {
     const response = await fetch(`${API_BASE_URL}/anime/${id}/characters`);
     if (!response.ok) {
      throw new Error(`Failed to fetch characters for anime with id ${id}`);
    }
    return response.json();
  }
};
