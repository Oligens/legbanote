export type StoredDocument = {
  id: string;
  name: string;
  text: string;
  createdAt: string;
};

export type StoredCourse = {
  id: string;
  title: string;
  icon: string;
  documents: StoredDocument[];
  createdAt: string;
};

export type StoredHistoryItem = {
  id: string;
  question: string;
  answer: string;
  sources: string[];
  createdAt: string;
};

const COURSES_KEY = 'legba-note:courses:v2';
const HISTORY_KEY = 'legba-note:history:v2';
const SESSION_KEY = 'legba-note:session:v2';

function readJson<T>(key: string, fallback: T, validate: (value: unknown) => value is T): T {
  if (typeof window === 'undefined') return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;

    const parsed: unknown = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    // Never replace valid persisted data with an empty in-memory state.
    return fallback;
  }
}

function isDocument(value: unknown): value is StoredDocument {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string'
    && typeof item.name === 'string'
    && typeof item.text === 'string'
    && typeof item.createdAt === 'string';
}

function isCourse(value: unknown): value is StoredCourse {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string'
    && typeof item.title === 'string'
    && typeof item.icon === 'string'
    && typeof item.createdAt === 'string'
    && Array.isArray(item.documents)
    && item.documents.every(isDocument);
}

function isHistoryItem(value: unknown): value is StoredHistoryItem {
  if (!value || typeof value !== 'object') return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string'
    && typeof item.question === 'string'
    && typeof item.answer === 'string'
    && typeof item.createdAt === 'string'
    && Array.isArray(item.sources)
    && item.sources.every((source) => typeof source === 'string');
}

function writeJson(key: string, value: unknown): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function loadCourses(): StoredCourse[] {
  return readJson(COURSES_KEY, [], (value): value is StoredCourse[] =>
    Array.isArray(value) && value.every(isCourse)
  );
}

export function saveCourses(courses: StoredCourse[]): void {
  writeJson(COURSES_KEY, courses);
}

export function loadHistory(): StoredHistoryItem[] {
  return readJson(HISTORY_KEY, [], (value): value is StoredHistoryItem[] =>
    Array.isArray(value) && value.every(isHistoryItem)
  );
}

export function saveHistory(history: StoredHistoryItem[]): void {
  writeJson(HISTORY_KEY, history);
}

export function loadSession(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    const value = window.localStorage.getItem(SESSION_KEY);
    return value?.trim() || null;
  } catch {
    return null;
  }
}

export function saveSession(username: string): void {
  const identity = username.trim();
  if (!identity) return;
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(SESSION_KEY, identity);
}

export function clearSession(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(SESSION_KEY);
}
