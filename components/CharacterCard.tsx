
import React from 'react';
import { Character } from '../types';

interface CharacterCardProps {
  character: Character;
}

const CharacterCard: React.FC<CharacterCardProps> = ({ character }) => {
  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden text-center transition-transform transform hover:-translate-y-1">
      <img
        src={character.character.images.webp.image_url}
        alt={character.character.name}
        className="w-full h-40 object-cover"
        loading="lazy"
      />
      <div className="p-2">
        <h4 className="text-sm font-semibold text-white truncate">{character.character.name}</h4>
        <p className="text-xs text-gray-400">{character.role}</p>
      </div>
    </div>
  );
};

export default CharacterCard;
