import React from 'react';
import { SlotMachine } from './SlotMachine';
import { Button } from './ui/Button';
import type { PlayerId, Character, CustomIcons } from '../types';
import { PLAYER_CONFIG } from '../constants';

interface PlayerSectionProps {
  playerId: PlayerId;
  theme: 'cyan' | 'orange';
  availableCharacters: Character[];
  currentSelection: Character | null;
  customIcons: CustomIcons;
  isSpinning: boolean;
  targetCharacter: Character | null;
  onSpin: () => void;
  onSpinEnd: () => void;
  onSkip: () => void;
  loadImage: (filename: string) => string;
}

export const PlayerSection: React.FC<PlayerSectionProps> = ({
  playerId,
  theme,
  availableCharacters,
  currentSelection,
  onSpin,
  onSkip,
  customIcons,
  isSpinning,
  targetCharacter,
  onSpinEnd,
  loadImage,
}) => {
  const config = PLAYER_CONFIG[playerId];
  const displayedCharacter = isSpinning ? targetCharacter : currentSelection;

  return (
    <section className={`p-4 md:p-6 rounded-lg border-2 bg-gray-800/50 ${config.borderColor}`}>
      <h2 className={`text-2xl font-bold tracking-widest uppercase mb-4 ${config.textColor} ${config.glow}`}>
        {config.name}
      </h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
            <SlotMachine 
                isSpinning={isSpinning}
                targetCharacter={displayedCharacter}
                availableCharacters={availableCharacters}
                customIcons={customIcons}
                onSpinEnd={onSpinEnd}
                theme={theme}
                loadImage={loadImage}
            />
             <div className="mt-4 flex flex-wrap gap-2">
                <Button 
                    onClick={onSpin} 
                    disabled={isSpinning || availableCharacters.length === 0}
                    className={config.buttonClasses}
                >
                    {isSpinning ? 'Spinning...' : (availableCharacters.length === 0 ? 'Roster Exhausted' : 'Spin')}
                </Button>
                <Button 
                    onClick={onSkip}
                    disabled={isSpinning || !currentSelection}
                    className={config.buttonClasses}
                >
                   Skip
                </Button>
            </div>
        </div>

        <div className="space-y-4">
           <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Asset Status</h3>
                <div className={`p-3 rounded-md bg-black/30 min-h-[50px] flex items-center border ${config.borderColor}/50`}>
                    <p className={`font-semibold text-lg ${config.textColor}`}>
                        {currentSelection?.name || 'Awaiting Assignment'}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};                >
                   Skip
                </Button>
            </div>
        </div>

        <div className="space-y-4">
           <div>
                <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-1">Asset Status</h3>
                <div className={`p-3 rounded-md bg-black/30 min-h-[50px] flex items-center border ${config.borderColor}/50`}>
                    <p className={`font-semibold text-lg ${config.textColor}`}>
                        {currentSelection?.name || 'Awaiting Assignment'}
                    </p>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
};
