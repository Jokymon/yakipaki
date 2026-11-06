import { AppData } from '../domain/types';

export const seedData: AppData = {
  language: 'de',
  categories: [
    { id: 'clothes', name: 'Kleidung', color: '#D78A5C' },
    { id: 'documents', name: 'Dokumente', color: '#5E87A6' },
    { id: 'outdoors', name: 'Outdoor', color: '#55866A' }
  ],
  collections: [{ id: 'trekking', name: 'Trekking' }],
  phases: [
    { id: 'arrival', name: 'Anreise Zürich – Kathmandu', startDate: '2027-04-04', endDate: '2027-04-05' },
    { id: 'teahouse', name: 'Trekking Tea Houses', startDate: '2027-04-06', endDate: '2027-04-12', collectionId: 'trekking' },
    { id: 'camping', name: 'Trekking Camping', startDate: '2027-04-13', endDate: '2027-04-18', collectionId: 'trekking' }
  ],
  items: [
    { id: 'passport', name: 'Reisepass', quantity: 1, packed: true, owned: true, categoryIds: ['documents'], phaseIds: ['arrival', 'teahouse', 'camping'], notes: '' },
    { id: 'jacket', name: 'Daunenjacke', quantity: 1, packed: false, owned: true, categoryIds: ['clothes', 'outdoors'], phaseIds: ['teahouse', 'camping'], notes: 'Leichtes Modell' },
    { id: 'filter', name: 'Wasserfilter', quantity: 1, packed: false, owned: false, categoryIds: ['outdoors'], phaseIds: ['camping'], notes: '' }
  ]
};
