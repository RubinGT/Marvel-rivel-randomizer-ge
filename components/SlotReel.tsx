
import React from 'react';
import type { Character, CustomIcons } from '../types';

interface SlotReelProps {
  character: Character | null;
  customIcons: CustomIcons;
  isCenter: boolean;
  isSpinning: boolean;
  loadImage: (filename: string) => string;
}

export const SlotReel: React.FC<SlotReelProps> = ({ character, customIcons, isCenter, isSpinning, loadImage }) => {
  const iconSize = 'w-12 h-12 md:w-14 md:h-14';

  const renderCharacterIcon = (char: Character) => {
    const iconFilename = customIcons[char.name];
    if (iconFilename) {
      return <img src={loadImage(iconFilename)} alt={char.name} className={`${iconSize} object-cover rounded-md`} />;
    }
    // Fallback to initials
    const initials = char.name.split(' ').map(n => n[0]).join('').substring(0, 2);
    return (
      <div className={`${iconSize} bg-gray-700 flex items-center justify-center rounded-md text-lg font-bold`}>
        {initials}
      </div>
    );
  };

  return (
    <div className="h-20 flex items-center justify-center">
       {character ? renderCharacterIcon(character) : (
         isCenter && !isSpinning && <span className="text-3xl font-bold text-gray-500">?</span>
       )}
    </div>
  );
};
