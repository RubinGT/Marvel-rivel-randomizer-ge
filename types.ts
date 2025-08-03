
export type PlayerId = 'N' | 'S';

export interface Character {
  name: string;
}

export type CustomIcons = Record<string, string>; // character name -> filename

export interface HistoryEntry {
  characterName: string;
  timestamp: number;
}
