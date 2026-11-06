import { Language } from '../domain/types';

const messages = {
  de: {
    title: 'Meine Packliste', items: 'Packen', shopping: 'Einkaufen', manage: 'Organisieren', travel: 'Reise', all: 'Alle',
    addItem: 'Gegenstand hinzufügen', editItem: 'Gegenstand bearbeiten', name: 'Name', quantity: 'Anzahl', notes: 'Notizen',
    owned: 'Bereits vorhanden', packed: 'Eingepackt', categories: 'Kategorien', phases: 'Reisephasen', collections: 'Reisegruppen',
    save: 'Speichern', cancel: 'Abbrechen', delete: 'Löschen', empty: 'Hier ist noch nichts.', filters: 'Filter',
    shortUse: 'Unter 5 Tage', singlePhase: 'Nur eine Phase', startDate: 'Start (JJJJ-MM-TT)', endDate: 'Ende (JJJJ-MM-TT)',
    add: 'Hinzufügen', language: 'Sprache', objects: 'Gegenstände', notOwned: 'Noch zu besorgen', packedCount: 'eingepackt', resetFilters: 'Filter zurücksetzen',
    collection: 'Reisegruppe (optional)', ungrouped: 'Keine Reisegruppe', invalidDates: 'Bitte gültige Daten im Format JJJJ-MM-TT eingeben.',
    confirmDelete: 'Wirklich löschen?', deleteItemText: 'Dieser Gegenstand wird aus deiner Packliste entfernt.', usage: 'Nutzung'
  },
  en: {
    title: 'My packing list', items: 'Pack', shopping: 'Shopping', manage: 'Organize', travel: 'Travel', all: 'All',
    addItem: 'Add item', editItem: 'Edit item', name: 'Name', quantity: 'Quantity', notes: 'Notes',
    owned: 'Already owned', packed: 'Packed', categories: 'Categories', phases: 'Travel phases', collections: 'Travel groups',
    save: 'Save', cancel: 'Cancel', delete: 'Delete', empty: 'Nothing here yet.', filters: 'Filters',
    shortUse: 'Under 5 days', singlePhase: 'One phase only', startDate: 'Start (YYYY-MM-DD)', endDate: 'End (YYYY-MM-DD)',
    add: 'Add', language: 'Language', objects: 'items', notOwned: 'Still to buy', packedCount: 'packed', resetFilters: 'Reset filters',
    collection: 'Travel group (optional)', ungrouped: 'No travel group', invalidDates: 'Enter valid dates in YYYY-MM-DD format.',
    confirmDelete: 'Delete this item?', deleteItemText: 'This item will be removed from your packing list.', usage: 'Usage'
  }
} as const;

export type TranslationKey = keyof typeof messages.de;
export const translate = (language: Language, key: TranslationKey): string => messages[language][key];
