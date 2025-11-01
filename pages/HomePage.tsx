
import React, { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAnime, fetchGenres } from '../store/slices/animeSlice';
import SearchBar from '../components/SearchBar';
import AnimeCard from '../components/AnimeCard';
import AnimeCardSkeleton from '../components/AnimeCardSkeleton';
import Pagination from '../components/Pagination';
import { useDebounce } from '../hooks/useDebounce';

const HomePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, status, pagination, genres } = useAppSelector((state) => state.anime);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const pageResetEffectRan = useRef(false);

  useEffect(() => {
    dispatch(fetchGenres());
  }, [dispatch]);

  useEffect(() => {
    const promise = dispatch(fetchAnime({ 
      query: debouncedSearchTerm, 
      page: currentPage, 
      genreId: selectedGenre ?? undefined 
    }));
    
    return () => {
      promise.abort();
    };
  }, [debouncedSearchTerm, selectedGenre, currentPage, dispatch]);
  
  // Reset page to 1 when search term or genre changes, but not on initial render
  useEffect(() => {
    if (pageResetEffectRan.current) {
        setCurrentPage(1);
    }
    pageResetEffectRan.current = true;
  }, [debouncedSearchTerm, selectedGenre]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  const handleGenreClick = (genreId: number) => {
    setSelectedGenre(prev => (prev === genreId ? null : genreId));
  };

  const renderContent = () => {
    if (status === 'loading') {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <AnimeCardSkeleton key={index} />
          ))}
        </div>
      );
    }
    if (status === 'succeeded' && list.length === 0) {
      return (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-400">No Anime Found</h2>
          <p className="text-gray-500 mt-2">Try a different search term or genre.</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        {list.map((anime) => (
          <AnimeCard key={anime.mal_id} anime={anime} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 items-center">
          <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      </div>
      
      <div className="flex flex-wrap gap-2 justify-center">
        {genres.slice(0, 10).map(genre => (
          <button 
            key={genre.mal_id} 
            onClick={() => handleGenreClick(genre.mal_id)}
            className={`px-3 py-1 text-sm font-medium rounded-full transition-all duration-200 ${selectedGenre === genre.mal_id ? 'bg-purple-600 text-white ring-2 ring-purple-400' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
          >
            {genre.name}
          </button>
        ))}
      </div>

      {renderContent()}

      <Pagination pagination={pagination} onPageChange={handlePageChange} />
    </div>
  );
};

export default HomePage;
