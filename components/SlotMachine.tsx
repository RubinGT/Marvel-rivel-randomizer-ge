import React, { useState, useEffect } from 'react';
import { SlotReel } from './SlotReel';
import type { Character, CustomIcons } from '../types';
import { PLAYER_CONFIG, CHARACTER_ROSTER } from '../constants';

interface SlotMachineProps {
  isSpinning: boolean;
  targetCharacter: Character | null;
  availableCharacters: Character[];
  customIcons: CustomIcons;
  onSpinEnd: () => void;
  theme: 'cyan' | 'orange';
  loadImage: (filename: string) => string;
}

const SPIN_DURATION_MS = 4000;

const shuffleArray = <T,>(array: T[]): T[] => {
    if (array.length === 0) return [];
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export const SlotMachine: React.FC<SlotMachineProps> = ({ isSpinning, targetCharacter, availableCharacters, customIcons, onSpinEnd, theme }) => {
  const [visibleChars, setVisibleChars] = useState<(Character | null)[]>([null, null, null]);
  const config = PLAYER_CONFIG[theme === 'cyan' ? 'N' : 'S'];
  const fallbackCharacter: Character = { name: '?' };

  useEffect(() => {
    let animationFrameId: number;

    if (!isSpinning) {
      if (targetCharacter) {
        // When not spinning, show the selected character in the center with random neighbors
        const sideChars = shuffleArray(CHARACTER_ROSTER.filter(c => c.name !== targetCharacter.name));
        setVisibleChars([sideChars[0] || fallbackCharacter, targetCharacter, sideChars[1] || fallbackCharacter]);
      } else {
        setVisibleChars([null, null, null]);
      }
      return;
    }

    // Animation logic
    if (isSpinning && targetCharacter) {
      // Create a long, shuffled list of characters for the animation reel
      const baseReel = shuffleArray(availableCharacters.length > 2 ? availableCharacters : CHARACTER_ROSTER);
      const animationReel = [...baseReel, ...baseReel, ...baseReel];

      // Determine the final state characters
      const finalRight = shuffleArray(baseReel.filter(c => c.name !== targetCharacter.name))[0] || fallbackCharacter;
      const finalLeft = shuffleArray(baseReel.filter(c => c.name !== targetCharacter.name && c.name !== finalRight.name))[0] || fallbackCharacter;
      const finalState = [finalLeft, targetCharacter, finalRight];

      let startTime: number | null = null;
      let lastUpdateTime = 0;
      let reelIndex = 0;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const elapsedTime = timestamp - startTime;

        // Calculate update interval, slowing down as it approaches the end
        const slowDownFactor = Math.pow(elapsedTime / SPIN_DURATION_MS, 2);
        const updateInterval = 50 + (150 * slowDownFactor);

        if (timestamp - lastUpdateTime > updateInterval) {
          lastUpdateTime = timestamp;
          const left = animationReel[reelIndex % animationReel.length];
          const center = animationReel[(reelIndex + 1) % animationReel.length];
          const right = animationReel[(reelIndex + 2) % animationReel.length];
          setVisibleChars([left, center, right]);
          reelIndex++;
        }

        if (elapsedTime < SPIN_DURATION_MS) {
          animationFrameId = requestAnimationFrame(animate);
        } else {
          // Animation finished
          setVisibleChars(finalState);
          onSpinEnd();
        }
      };

      animationFrameId = requestAnimationFrame(animate);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [isSpinning, targetCharacter, availableCharacters, onSpinEnd]);

  return (
    <div className={`grid grid-cols-3 gap-2 md:gap-4 p-2 md:p-3 rounded-lg border-2 bg-black/30 ${config.borderColor} ${config.slotShadow}`}>
      <SlotReel character={visibleChars[0]} customIcons={customIcons} isCenter={false} isSpinning={isSpinning} loadImage={loadImage} />
      <div className={`rounded-md ${!isSpinning && targetCharacter ? 'bg-black/40 ring-1 ring-inset ring-white/10' : ''}`}>
        <SlotReel character={visibleChars[1]} customIcons={customIcons} isCenter={true} isSpinning={isSpinning} loadImage={loadImage} />
      </div>
      <SlotReel character={visibleChars[2]} customIcons={customIcons} isCenter={false} isSpinning={isSpinning} loadImage={loadImage} />
    </div>
  );
};
