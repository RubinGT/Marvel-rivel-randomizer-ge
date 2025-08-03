import React, { useState, useEffect, useCallback } from 'react';
import { PlayerSection } from './components/PlayerSection';
import { MasterControls } from './components/MasterControls';
import { AssetManagementModal } from './components/AssetManagementModal';
import { HistoryModal } from './components/HistoryModal';
import { useLocalStorage } from './hooks/useLocalStorage';
import { CHARACTER_ROSTER } from './constants';
import type { PlayerId, Character, HistoryEntry, CustomIcons } from './types';
import { loadImage } from './services/imageService';

const App: React.FC = () => {
  const [customIcons, setCustomIcons] = useLocalStorage<CustomIcons>('mr_custom_icons', {});
  const [historyN, setHistoryN] = useLocalStorage<HistoryEntry[]>('mr_history_N', []);
  const [historyS, setHistoryS] = useLocalStorage<HistoryEntry[]>('mr_history_S', []);

  const [playerNSelection, setPlayerNSelection] = useState<Character | null>(null);
  const [playerSSelection, setPlayerSSelection] = useState<Character | null>(null);
  
  const [isSpinningN, setIsSpinningN] = useState(false);
  const [isSpinningS, setIsSpinningS] = useState(false);
  
  const [targetCharacterN, setTargetCharacterN] = useState<Character | null>(null);
  const [targetCharacterS, setTargetCharacterS] = useState<Character | null>(null);

  const [availableCharacters, setAvailableCharacters] = useState<Character[]>(CHARACTER_ROSTER);

  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  const purgeAllHistory = useCallback(() => {
    setHistoryN([]);
    setHistoryS([]);
    setPlayerNSelection(null);
    setPlayerSSelection(null);
    setTargetCharacterN(null);
    setTargetCharacterS(null);
    setIsSpinningN(false);
    setIsSpinningS(false);
  }, [setHistoryN, setHistoryS]);

  useEffect(() => {
    const combinedHistoryNames = new Set([...historyN, ...historyS].map(h => h.characterName));
    const remaining = CHARACTER_ROSTER.filter(char => !combinedHistoryNames.has(char.name));
    setAvailableCharacters(remaining);
  }, [historyN, historyS]);

  const handleSpinEnd = useCallback((playerId: PlayerId) => {
    const targetCharacter = playerId === 'N' ? targetCharacterN : targetCharacterS;
    if (!targetCharacter) return;

    const setHistory = playerId === 'N' ? setHistoryN : setHistoryS;
    const setSelection = playerId === 'N' ? setPlayerNSelection : setPlayerSSelection;
    const setIsSpinning = playerId === 'N' ? setIsSpinningN : setIsSpinningS;

    const newEntry: HistoryEntry = { characterName: targetCharacter.name, timestamp: Date.now() };
    
    setSelection(targetCharacter);
    setHistory(prev => [newEntry, ...prev]);
    setIsSpinning(false);
  }, [targetCharacterN, targetCharacterS, setHistoryN, setHistoryS]);

  const handleSpin = useCallback((playerId: PlayerId) => {
    const isSpinning = playerId === 'N' ? isSpinningN : isSpinningS;
    const otherPlayerSelection = playerId === 'N' ? playerSSelection : playerNSelection;
    if (isSpinning) return;

    const possibleChars = availableCharacters.filter(c => c.name !== otherPlayerSelection?.name);
    if (possibleChars.length === 0) return;

    const randomIndex = Math.floor(Math.random() * possibleChars.length);
    const selected = possibleChars[randomIndex];
    
    if (playerId === 'N') {
        setTargetCharacterN(selected);
        setIsSpinningN(true);
    } else {
        setTargetCharacterS(selected);
        setIsSpinningS(true);
    }
  }, [isSpinningN, isSpinningS, availableCharacters, playerNSelection, playerSSelection]);

  const handleSpinBoth = useCallback(() => {
    if (isSpinningN || isSpinningS || availableCharacters.length < 2) return;

    const shuffled = [...availableCharacters].sort(() => 0.5 - Math.random());
    const [charN, charS] = shuffled;
    
    setTargetCharacterN(charN);
    setIsSpinningN(true);

    setTargetCharacterS(charS);
    setIsSpinningS(true);
  }, [isSpinningN, isSpinningS, availableCharacters]);
  
  const handleSkip = useCallback((playerId: PlayerId) => {
    const setSelection = playerId === 'N' ? setPlayerNSelection : setPlayerSSelection;
    const setTarget = playerId === 'N' ? setTargetCharacterN : setTargetCharacterS;
    const setIsSpinning = playerId === 'N' ? setIsSpinningN : setIsSpinningS;

    setSelection(null);
    setTarget(null);
    setIsSpinning(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-mono grid-background">
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <header className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-widest text-white uppercase">
            <span className="text-cyan-400 text-glow-cyan">Marvel Rivals</span>
            <span className="text-white mx-2">//</span>
            <span className="text-orange-400 text-glow-orange">Randomizer</span>
          </h1>
        </header>

        <main className="space-y-12">
          <PlayerSection
            playerId="N"
            theme="cyan"
            isSpinning={isSpinningN}
            targetCharacter={targetCharacterN}
            currentSelection={playerNSelection}
            onSpin={() => handleSpin('N')}
            onSpinEnd={() => handleSpinEnd('N')}
            onSkip={handleSkip}
            availableCharacters={availableCharacters.filter(c => c.name !== playerSSelection?.name)}
            customIcons={customIcons}
            loadImage={loadImage}
          />
          <PlayerSection
            playerId="S"
            theme="orange"
            isSpinning={isSpinningS}
            targetCharacter={targetCharacterS}
            currentSelection={playerSSelection}
            onSpin={() => handleSpin('S')}
            onSpinEnd={() => handleSpinEnd('S')}
            onSkip={() => handleSkip('S')}
            availableCharacters={availableCharacters.filter(c => c.name !== playerNSelection?.name)}
            customIcons={customIcons}
            loadImage={loadImage}
          />
        </main>

        <MasterControls 
            onOpenAssetManagement={() => setIsAssetModalOpen(true)}
            onOpenHistory={() => setIsHistoryModalOpen(true)}
            onSpinBoth={handleSpinBoth}
        />
      </div>

      <AssetManagementModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        customIcons={customIcons}
        onIconsUpdate={setCustomIcons}
      />
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        historyN={historyN}
        historyS={historyS}
        customIcons={customIcons}
        onPurgeAllHistory={purgeAllHistory}
      />
    </div>
  );
};

export default App;
