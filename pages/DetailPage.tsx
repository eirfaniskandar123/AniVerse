
import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchAnimeById, fetchAnimeCharacters, clearSelectedAnime } from '../store/slices/animeSlice';
import Loader from '../components/Loader';
import CharacterCard from '../components/CharacterCard';

const DetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedAnime, characters, detailStatus } = useAppSelector((state) => state.anime);

  useEffect(() => {
    if (id) {
      const animeId = parseInt(id, 10);
      dispatch(fetchAnimeById(animeId));
      dispatch(fetchAnimeCharacters(animeId));
    }

    return () => {
      dispatch(clearSelectedAnime());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch]);

  if (detailStatus === 'loading' || !selectedAnime) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader />
      </div>
    );
  }

  if (detailStatus === 'failed') {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-400">Failed to load anime details.</h2>
        <Link to="/" className="mt-4 inline-block bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700">
          Back to Home
        </Link>
      </div>
    );
  }
  
  const InfoPill: React.FC<{ label: string; value?: string | number | null }> = ({ label, value }) => {
    if (!value) return null;
    return (
        <div className="flex flex-col bg-gray-800 p-2 rounded-lg text-center">
            <span className="text-xs text-gray-400 uppercase tracking-wider">{label}</span>
            <span className="text-base font-semibold text-white">{value}</span>
        </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="relative h-64 md:h-96 rounded-lg overflow-hidden mb-8">
        <img 
            src={selectedAnime.images.webp.large_image_url} 
            alt={`${selectedAnime.title} banner`}
            className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
      </div>
      
      <div className="flex flex-col md:flex-row gap-8 -mt-48 md:-mt-64 px-4 relative z-10">
        <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
          <img
            src={selectedAnime.images.webp.large_image_url}
            alt={selectedAnime.title}
            className="w-full rounded-lg shadow-2xl shadow-black/50"
          />
          {selectedAnime.trailer.url && (
            <a href={selectedAnime.trailer.url} target="_blank" rel="noopener noreferrer" className="mt-4 block w-full text-center bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors">
              Watch Trailer
            </a>
          )}
        </div>
        
        <div className="md:w-2/3 lg:w-3/4 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-2">{selectedAnime.title_english || selectedAnime.title}</h1>
          <p className="text-lg text-gray-400 mb-4">{selectedAnime.title_japanese}</p>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            <InfoPill label="Score" value={selectedAnime.score ? `${selectedAnime.score} ⭐` : 'N/A'}/>
            <InfoPill label="Episodes" value={selectedAnime.episodes}/>
            <InfoPill label="Status" value={selectedAnime.status}/>
            <InfoPill label="Season" value={`${selectedAnime.season} ${selectedAnime.year || ''}`}/>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            {selectedAnime.genres.map(g => <span key={g.mal_id} className="bg-purple-600/50 text-purple-200 text-xs px-2 py-1 rounded-full">{g.name}</span>)}
          </div>
          
          <h2 className="text-2xl font-semibold border-b-2 border-purple-500 pb-2 mb-4">Synopsis</h2>
          <p className="text-gray-300 leading-relaxed max-h-48 overflow-y-auto pr-2">{selectedAnime.synopsis || 'No synopsis available.'}</p>
        </div>
      </div>

      {characters.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold border-b-2 border-purple-500 pb-2 mb-4">Characters</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {characters.slice(0, 16).map(char => (
              <CharacterCard key={char.character.mal_id} character={char} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailPage;
