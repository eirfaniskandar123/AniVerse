
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../hooks/useDebounce';
import { jikanService } from '../services/jikanService';
import { Anime } from '../types';
import SearchBar from './SearchBar';

const SearchWithPreview: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<Anime[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    const navigate = useNavigate();
    const searchContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const abortController = new AbortController();

        if (debouncedSearchTerm) {
            setIsLoading(true);
            jikanService.searchAnime({ q: debouncedSearchTerm, limit: 5 }, abortController.signal)
                .then(response => {
                    setResults(response.data);
                    setIsLoading(false);
                    setIsOpen(true);
                })
                .catch(error => {
                    if (error.name !== 'AbortError') {
                        console.error('Search failed:', error);
                        setIsLoading(false);
                    }
                });
        } else {
            setResults([]);
            setIsOpen(false);
        }

        return () => {
            abortController.abort();
        };
    }, [debouncedSearchTerm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handleSelect = (id: number) => {
        setSearchTerm('');
        setResults([]);
        setIsOpen(false);
        navigate(`/anime/${id}`);
    };

    return (
        <div className="relative w-full md:w-96" ref={searchContainerRef}>
            <SearchBar
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search another anime..."
            />
            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {isLoading && <div className="p-4 text-center text-gray-400">Loading...</div>}
                    {!isLoading && results.length === 0 && debouncedSearchTerm && (
                        <div className="p-4 text-center text-gray-400">No results found.</div>
                    )}
                    {!isLoading && results.length > 0 && (
                        <ul>
                            {results.map(anime => (
                                <li key={anime.mal_id}>
                                    <button 
                                      onClick={() => handleSelect(anime.mal_id)}
                                      className="w-full text-left flex items-center p-3 hover:bg-gray-700 transition-colors"
                                    >
                                        <img src={anime.images.webp.small_image_url} alt={anime.title} className="w-10 h-14 object-cover rounded mr-3 flex-shrink-0" />
                                        <div className="flex-grow overflow-hidden">
                                            <p className="text-white font-semibold truncate">{anime.title_english || anime.title}</p>
                                            <p className="text-sm text-gray-400">{anime.year || 'N/A'}</p>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchWithPreview;
