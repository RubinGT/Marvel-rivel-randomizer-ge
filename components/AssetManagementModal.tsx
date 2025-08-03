import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { CHARACTER_ROSTER } from '../constants';
import { processImage, getLocalStorageSize, saveImage, loadImage } from '../services/imageService';
import type { CustomIcons } from '../types';

interface AssetManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  customIcons: CustomIcons;
  onIconsUpdate: (icons: CustomIcons) => void;
}

const CharacterAsset: React.FC<{
    charName: string;
    icon: string | undefined;
    onIconChange: (charName: string, filename: string) => void;
    onIconRemove: (charName: string) => void;
}> = ({ charName, icon, onIconChange, onIconRemove }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (file.size > 50 * 1024 * 1024) {
            alert(`File ${file.name} is too large (> 50MB) and will be skipped.`);
            if(fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setIsProcessing(true);
        try {
            await saveImage(file);
            onIconChange(charName, file.name);
        } catch (error) {
            console.error(`Error processing file ${file.name}:`, error);
            alert(`Could not process image for ${charName}.`);
        } finally {
            setIsProcessing(false);
             if(fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    return (
        <div className="relative group p-2 bg-gray-700/50 rounded-md text-center">
            <label htmlFor={`upload-${charName}`} className="cursor-pointer">
                {isProcessing ? (
                     <div className="w-24 h-24 bg-gray-800 flex items-center justify-center mx-auto rounded-md">
                        <svg className="animate-spin h-8 w-8 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                     </div>
                ) : icon ? (
                    <img src={loadImage(icon)} alt={charName} className="w-24 h-24 object-cover mx-auto rounded-md" />
                ) : (
                    <div className="w-24 h-24 bg-gray-800 flex items-center justify-center mx-auto rounded-md">
                        <span className="text-gray-500 text-3xl font-bold">?</span>
                    </div>
                )}
            </label>
            <input
                id={`upload-${charName}`}
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={isProcessing}
            />
             <p className="mt-2 text-xs font-semibold truncate text-gray-300">{charName}</p>
             {icon && !isProcessing && (
                <button
                    onClick={() => onIconRemove(charName)}
                    className="absolute top-0 right-0 m-1 bg-red-600/80 rounded-full p-1 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label={`Remove icon for ${charName}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
}


export const AssetManagementModal: React.FC<AssetManagementModalProps> = ({ isOpen, onClose, customIcons, onIconsUpdate }) => {
  const [filter, setFilter] = useState('');
  const [storageSize, setStorageSize] = useState(0);

  useEffect(() => {
    if(isOpen) {
        setStorageSize(getLocalStorageSize('mr_custom_icons'));
    }
  }, [isOpen, customIcons]);

  const handleIconChange = useCallback((characterName: string, filename: string) => {
      onIconsUpdate({ ...customIcons, [characterName]: filename });
  }, [customIcons, onIconsUpdate]);

  const handleIconRemove = (characterName: string) => {
    const newIcons = { ...customIcons };
    delete newIcons[characterName];
    onIconsUpdate(newIcons);
  };
  
  const filteredCharacters = useMemo(() => {
    return CHARACTER_ROSTER.filter(char => char.name.toLowerCase().includes(filter.toLowerCase()));
  }, [filter]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Asset Management">
      <div className="space-y-6">
        <div className="text-center p-2 rounded-md bg-gray-900/40">
            <p className="text-sm text-gray-300">Click on any character to upload a new custom icon.</p>
        </div>

        <div className="flex justify-between items-center">
             <input
                type="text"
                placeholder="Search/filter assets..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-gray-900/50 border-2 border-gray-600 rounded-md px-3 py-2 w-full max-w-xs focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="text-right">
                <p className="text-sm font-semibold text-gray-300">Storage Usage</p>
                <p className={`text-lg font-bold ${storageSize > 48 * 1024 ? 'text-red-500' : 'text-cyan-400'}`}>
                    {storageSize.toFixed(2)} KB / 51200 KB
                </p>
            </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-h-[50vh] overflow-y-auto p-2 bg-black/20 rounded-md">
          {filteredCharacters.map(char => (
            <CharacterAsset
                key={char.name}
                charName={char.name}
                icon={customIcons[char.name]}
                onIconChange={handleIconChange}
                onIconRemove={handleIconRemove}
            />
          ))}
        </div>
      </div>
    </Modal>
  );
};
