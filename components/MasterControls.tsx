import React from 'react';
import { Button } from './ui/Button';

interface MasterControlsProps {
  onOpenAssetManagement: () => void;
  onOpenHistory: () => void;
  onSpinBoth: () => void;
}

export const MasterControls: React.FC<MasterControlsProps> = ({ onOpenAssetManagement, onOpenHistory, onSpinBoth }) => {
  return (
    <footer className="mt-8 md:mt-12 pt-6 border-t-2 border-gray-700">
      <h3 className="text-center text-lg uppercase tracking-widest text-gray-400 mb-4">Master Command Center</h3>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        <Button onClick={onSpinBoth} variant="primary" className="bg-green-600/30 border-green-500 hover:bg-green-500/50 hover:text-green-300 text-green-300">
          Spin Both
        </Button>
        <Button onClick={onOpenAssetManagement} variant="secondary">
          Asset Management
        </Button>
        <Button onClick={onOpenHistory} variant="secondary">
          History
        </Button>
      </div>
    </footer>
  );
};