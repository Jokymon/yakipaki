export type Language = 'de' | 'en';

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type TravelCollection = {
  id: string;
  name: string;
};

export type TravelPhase = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  collectionId?: string;
};

export type PackingItem = {
  id: string;
  name: string;
  quantity: number;
  packed: boolean;
  owned: boolean;
  categoryIds: string[];
  phaseIds: string[];
  notes: string;
};

export type AppData = {
  language: Language;
  items: PackingItem[];
  categories: Category[];
  phases: TravelPhase[];
  collections: TravelCollection[];
};

export type Filter =
  | { kind: 'all' }
  | { kind: 'category'; id: string }
  | { kind: 'phase'; id: string }
  | { kind: 'collection'; id: string }
  | { kind: 'short-use' }
  | { kind: 'single-phase' };
