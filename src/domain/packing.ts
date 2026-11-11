import { AppData, Filter, PackingItem, TravelPhase } from './types';

export function phaseDays(phase: TravelPhase): number {
  if (phase.durationDays !== undefined) return Math.max(0, Math.floor(phase.durationDays));
  if (!phase.startDate || !phase.endDate) return 0;
  const start = Date.parse(phase.startDate);
  const end = Date.parse(phase.endDate);
  if (!Number.isFinite(start) || !Number.isFinite(end) || end < start) return 0;
  return Math.floor((end - start) / 86_400_000) + 1;
}

export function itemUsageDays(item: PackingItem, phases: TravelPhase[]): number {
  return item.phaseIds.reduce((sum, id) => {
    const phase = phases.find((candidate) => candidate.id === id);
    return sum + (phase ? phaseDays(phase) : 0);
  }, 0);
}

export function matchesFilter(item: PackingItem, filter: Filter, data: AppData): boolean {
  switch (filter.kind) {
    case 'all':
      return true;
    case 'phase':
      return item.phaseIds.includes(filter.id);
    case 'collection': {
      const phaseIds = data.phases
        .filter((phase) => phase.collectionId === filter.id)
        .map((phase) => phase.id);
      return item.phaseIds.some((id) => phaseIds.includes(id));
    }
    case 'short-use':
      return itemUsageDays(item, data.phases) < 5;
    case 'single-phase':
      return item.phaseIds.length === 1;
  }
}

export function safeQuantity(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? Math.max(1, parsed) : 1;
}
