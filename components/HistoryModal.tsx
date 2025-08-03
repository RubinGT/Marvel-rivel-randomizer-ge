import React, { useMemo } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { CHARACTER_ROSTER, PLAYER_CONFIG } from '../constants';
import type { HistoryEntry, CustomIcons } from '../types';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  historyN: HistoryEntry[];
  historyS: HistoryEntry[];
  customIcons: CustomIcons;
  onPurgeAllHistory: () => void;
}

const CharacterHistoryItem: React.FC<{charName: string, icon: string | undefined}> = ({ charName, icon }) => (
    <div className="p-2 bg-gray-700/50 rounded-md text-center flex flex-col items-center justify-center">
        {icon ? (
            <img src={icon} alt={charName} className="w-20 h-20 object-cover mx-auto rounded-md" />
        ) : (
            <div className="w-20 h-20 bg-gray-800 flex items-center justify-center mx-auto rounded-md">
                <span className="text-gray-500 text-2xl font-bold">?</span>
            </div>
        )}
        <p className="mt-2 text-xs font-semibold truncate w-full text-gray-300">{charName}</p>
    </div>
);

const HistoryColumn: React.FC<{
    playerId: 'N' | 'S';
    history: HistoryEntry[];
    customIcons: CustomIcons;
}> = ({playerId, history, customIcons}) => {
    const config = PLAYER_CONFIG[playerId];
    return (
        <div className={`p-3 rounded-lg border-2 bg-gray-800/30 ${config.borderColor}`}>
            <h4 className={`text-lg font-bold tracking-wider uppercase mb-3 text-center ${config.textColor} ${config.glow}`}>
                {config.name}'s History
            </h4>
            {history.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-[40vh] overflow-y-auto p-1">
                    {history.map((entry, index) => (
                         <CharacterHistoryItem 
                            key={`${entry.characterName}-${index}`}
                            charName={entry.characterName}
                            icon={customIcons[entry.characterName]}
                         />
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 h-[40vh] flex items-center justify-center">
                    <p className="text-gray-500">No history</p>
                </div>
            )}
        </div>
    );
};


export const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, historyN, historyS, customIcons, onPurgeAllHistory }) => {
  const uniqueHistory = useMemo(() => {
    const combined = [...historyN, ...historyS];
    const uniqueNames = new Set(combined.map(entry => entry.characterName));
    return Array.from(uniqueNames);
  }, [historyN, historyS]);

  const handlePurge = () => {
    onPurgeAllHistory();
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="History">
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded-md">
          <h3 className="text-lg font-bold text-gray-300">Roster Completion</h3>
          <p className="text-xl font-bold text-cyan-400">
            {uniqueHistory.length} / {CHARACTER_ROSTER.length}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <HistoryColumn playerId="N" history={historyN} customIcons={customIcons} />
            <HistoryColumn playerId="S" history={historyS} customIcons={customIcons} />
        </div>

        <div className="pt-4 border-t border-gray-700 flex justify-end">
           <Button onClick={handlePurge} variant="secondary" className="bg-red-800/50 border-red-700 hover:bg-red-700/80">
                Purge All History
            </Button>
        </div>
      </div>
    </Modal>
  );
};