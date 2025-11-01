
import React from 'react';
import { Link } from 'react-router-dom';
import { Anime } from '../types';

interface AnimeCardProps {
  anime: Anime;
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z"
      clipRule="evenodd"
    />
  </svg>
);

const AnimeCard: React.FC<AnimeCardProps> = ({ anime }) => {
  return (
    <Link to={`/anime/${anime.mal_id}`} className="group block overflow-hidden rounded-lg shadow-lg relative">
      <div className="relative w-full h-96">
        <img
          src={anime.images.webp.large_image_url || anime.images.jpg.large_image_url}
          alt={anime.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
      </div>
      <div className="absolute bottom-0 left-0 p-4 w-full">
        {anime.score && (
          <div className="absolute top-0 right-0 m-2 bg-purple-600/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
            <StarIcon className="w-4 h-4 text-yellow-300" />
            <span>{anime.score.toFixed(2)}</span>
          </div>
        )}
        <h3 className="text-lg font-bold text-white truncate group-hover:text-purple-300 transition-colors duration-300">
          {anime.title_english || anime.title}
        </h3>
        <div className="mt-1 flex flex-wrap gap-1 max-h-12 overflow-hidden">
          {anime.genres.slice(0, 3).map((genre) => (
            <span key={genre.mal_id} className="text-xs bg-gray-700/80 text-gray-300 px-2 py-1 rounded-full">{genre.name}</span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default AnimeCard;
