import { Language } from '../domain/types';

const messages = {
  de: {
    title: 'Meine Packliste', items: 'Packen', shopping: 'Einkaufen', manage: 'Organisieren', travel: 'Reise', all: 'Alle',
    addItem: 'Gegenstand hinzufügen', editItem: 'Gegenstand bearbeiten', name: 'Name', quantity: 'Anzahl', notes: 'Notizen', color: 'Farbe', customColor: 'Eigene Farbe', moreColors: 'Weitere Farben', hexColor: 'Hex-Farbwert', apply: 'Übernehmen', edit: 'Bearbeiten',
    owned: 'Bereits vorhanden', packed: 'Eingepackt', categories: 'Kategorien', phases: 'Reisephasen', collections: 'Reisegruppen',
    save: 'Speichern', cancel: 'Abbrechen', delete: 'Löschen', empty: 'Hier ist noch nichts.', filters: 'Filter',
    shortUse: 'Unter 5 Tage', singlePhase: 'Nur eine Phase', startDate: 'Start (JJJJ-MM-TT)', endDate: 'Ende (JJJJ-MM-TT)', dateRange: 'Zeitraum', duration: 'Dauer', durationDays: 'Dauer in Tagen', days: 'Tage',
    add: 'Hinzufügen', language: 'Sprache', objects: 'Gegenstände', notOwned: 'Noch zu besorgen', packedCount: 'eingepackt', resetFilters: 'Filter zurücksetzen',
    collection: 'Reisegruppe (optional)', ungrouped: 'Keine Reisegruppe', uncategorized: 'Ohne Kategorie', invalidDates: 'Bitte gültige Daten im Format JJJJ-MM-TT eingeben.', invalidDuration: 'Bitte eine Dauer von mindestens einem ganzen Tag eingeben.',
    confirmDelete: 'Wirklich löschen?', deleteItemText: 'Dieser Gegenstand wird aus deiner Packliste entfernt.', usage: 'Nutzung', collapse: 'Einklappen', expand: 'Ausklappen', storageError: 'Lokale Daten konnten nicht sicher gelesen oder gespeichert werden. Änderungen sind möglicherweise nicht dauerhaft.'
  },
  en: {
    title: 'My packing list', items: 'Pack', shopping: 'Shopping', manage: 'Organize', travel: 'Travel', all: 'All',
    addItem: 'Add item', editItem: 'Edit item', name: 'Name', quantity: 'Quantity', notes: 'Notes', color: 'Color', customColor: 'Custom color', moreColors: 'More colors', hexColor: 'Hex color value', apply: 'Apply', edit: 'Edit',
    owned: 'Already owned', packed: 'Packed', categories: 'Categories', phases: 'Travel phases', collections: 'Travel groups',
    save: 'Save', cancel: 'Cancel', delete: 'Delete', empty: 'Nothing here yet.', filters: 'Filters',
    shortUse: 'Under 5 days', singlePhase: 'One phase only', startDate: 'Start (YYYY-MM-DD)', endDate: 'End (YYYY-MM-DD)', dateRange: 'Date range', duration: 'Duration', durationDays: 'Duration in days', days: 'days',
    add: 'Add', language: 'Language', objects: 'items', notOwned: 'Still to buy', packedCount: 'packed', resetFilters: 'Reset filters',
    collection: 'Travel group (optional)', ungrouped: 'No travel group', uncategorized: 'Uncategorized', invalidDates: 'Enter valid dates in YYYY-MM-DD format.', invalidDuration: 'Enter a duration of at least one whole day.',
    confirmDelete: 'Delete this item?', deleteItemText: 'This item will be removed from your packing list.', usage: 'Usage', collapse: 'Collapse', expand: 'Expand', storageError: 'Local data could not be read or saved safely. Changes may not be persistent.'
  }
} as const;

export type TranslationKey = keyof typeof messages.de;
export const translate = (language: Language, key: TranslationKey): string => messages[language][key];
