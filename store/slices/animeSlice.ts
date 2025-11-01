
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Anime, Genre, AnimeDetails, Character, PaginationData } from '../../types';
import { jikanService } from '../../services/jikanService';

interface AnimeState {
  list: Anime[];
  genres: Genre[];
  selectedAnime: AnimeDetails | null;
  characters: Character[];
  pagination: PaginationData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  detailStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

interface FetchAnimeParams {
  page?: number;
  query?: string;
  genreId?: number;
}

export const fetchAnime = createAsyncThunk(
  'anime/fetchAnime',
  async (params: FetchAnimeParams, { signal }) => {
    const { page = 1, query = '', genreId } = params;
    const response = await jikanService.searchAnime({
      page,
      q: query,
      genres: genreId ? genreId.toString() : undefined,
      limit: 24,
    }, signal);
    return response;
  }
);

export const fetchGenres = createAsyncThunk('anime/fetchGenres', async () => {
  const response = await jikanService.getGenres();
  return response.data;
});

export const fetchAnimeById = createAsyncThunk('anime/fetchAnimeById', async (id: number) => {
  const response = await jikanService.getAnimeById(id);
  return response.data;
});

export const fetchAnimeCharacters = createAsyncThunk('anime/fetchAnimeCharacters', async (id: number) => {
  const response = await jikanService.getAnimeCharacters(id);
  return response.data;
});

const initialState: AnimeState = {
  list: [],
  genres: [],
  selectedAnime: null,
  characters: [],
  pagination: null,
  status: 'idle',
  error: null,
  detailStatus: 'idle',
};

const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    clearSelectedAnime: (state) => {
      state.selectedAnime = null;
      state.characters = [];
      state.detailStatus = 'idle';
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Anime List
      .addCase(fetchAnime.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAnime.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAnime.rejected, (state, action) => {
        if (action.error.name !== 'AbortError') {
          state.status = 'failed';
          state.error = action.error.message || 'Failed to fetch anime';
        }
      })
      // Fetch Genres
      .addCase(fetchGenres.fulfilled, (state, action: PayloadAction<Genre[]>) => {
        state.genres = action.payload;
      })
      // Fetch Anime Details
      .addCase(fetchAnimeById.pending, (state) => {
        state.detailStatus = 'loading';
      })
      .addCase(fetchAnimeById.fulfilled, (state, action: PayloadAction<AnimeDetails>) => {
        state.detailStatus = 'succeeded';
        state.selectedAnime = action.payload;
      })
      .addCase(fetchAnimeById.rejected, (state) => {
        state.detailStatus = 'failed';
      })
      // Fetch Anime Characters
      .addCase(fetchAnimeCharacters.fulfilled, (state, action: PayloadAction<Character[]>) => {
        state.characters = action.payload;
      });
  },
});

export const { clearSelectedAnime } = animeSlice.actions;
export default animeSlice.reducer;
