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

export function loadCourses(): StoredCourse[] {
  try {
    const raw = localStorage.getItem(COURSES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCourses(courses: StoredCourse[]) {
  localStorage.setItem(COURSES_KEY, JSON.stringify(courses));
}

export function loadHistory(): StoredHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveHistory(history: StoredHistoryItem[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function loadSession(): string | null {
  return localStorage.getItem(SESSION_KEY);
}

export function saveSession(username: string) {
  localStorage.setItem(SESSION_KEY, username);
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
