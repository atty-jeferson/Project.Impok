import { SavedScenario, CalculationInputs, AppMode } from '../types/mp2';

const STORAGE_KEY = 'mp2_financial_planner_saved_scenarios';
const NICKNAME_KEY = 'mp2_coach_user_nickname';
const APP_MODE_KEY = 'mp2_coach_app_mode';

export function getUserNickname(): string {
  try {
    const stored = localStorage.getItem(NICKNAME_KEY);
    if (stored && stored.trim()) return stored.trim();
  } catch (e) {
    // ignore
  }
  return 'Jef';
}

export function setUserNickname(nickname: string): void {
  try {
    localStorage.setItem(NICKNAME_KEY, nickname.trim());
  } catch (e) {
    // ignore
  }
}

export function getAppMode(): AppMode {
  try {
    const stored = localStorage.getItem(APP_MODE_KEY);
    if (stored === 'advanced' || stored === 'quick') return stored;
  } catch (e) {
    // ignore
  }
  return 'quick'; // Default to Quick Mode as specified
}

export function setAppMode(mode: AppMode): void {
  try {
    localStorage.setItem(APP_MODE_KEY, mode);
  } catch (e) {
    // ignore
  }
}

export function getSavedScenarios(): SavedScenario[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load saved scenarios from localStorage', err);
    return [];
  }
}

export function saveScenario(title: string, inputs: CalculationInputs, notes?: string): SavedScenario {
  const scenarios = getSavedScenarios();
  const newScenario: SavedScenario = {
    id: 'scen_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    title: title.trim() || 'My MP2 Scenario',
    createdAt: new Date().toISOString(),
    inputs,
    notes,
  };
  scenarios.unshift(newScenario);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  } catch (err) {
    console.error('Failed to write to localStorage', err);
  }
  return newScenario;
}

export function getLatestScenario(): SavedScenario | null {
  const scenarios = getSavedScenarios();
  return scenarios.length > 0 ? scenarios[0] : null;
}

export function deleteSavedScenario(id: string): void {
  const scenarios = getSavedScenarios().filter(s => s.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(scenarios));
  } catch (err) {
    console.error('Failed to remove from localStorage', err);
  }
}

export const deleteScenario = deleteSavedScenario;
