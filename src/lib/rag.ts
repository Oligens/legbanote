import type { StoredCourse } from './storage';

export type RagChunk = {
  courseId: string;
  courseTitle: string;
  documentId: string;
  documentName: string;
  text: string;
  score: number;
};

const CHUNK_SIZE = 1200;
const CHUNK_OVERLAP = 180;

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ');
}

function tokenize(value: string) {
  return normalize(value).split(/\s+/).filter((token) => token.length > 2);
}

function chunks(text: string) {
  const clean = text.replace(/\s+/g, ' ').trim();
  const result: string[] = [];
  for (let start = 0; start < clean.length; start += CHUNK_SIZE - CHUNK_OVERLAP) {
    const chunk = clean.slice(start, start + CHUNK_SIZE);
    if (chunk) result.push(chunk);
    if (start + CHUNK_SIZE >= clean.length) break;
  }
  return result;
}

export function retrieveRelevantChunks(courses: StoredCourse[], query: string, limit = 6): RagChunk[] {
  const queryTokens = tokenize(query);
  if (!queryTokens.length) return [];

  const candidates: RagChunk[] = [];

  for (const course of courses) {
    for (const document of course.documents) {
      for (const text of chunks(document.text)) {
        const normalized = normalize(text);
        let score = 0;
        for (const token of queryTokens) {
          const occurrences = normalized.split(token).length - 1;
          score += occurrences * (token.length >= 7 ? 2 : 1);
        }
        if (score > 0) {
          candidates.push({
            courseId: course.id,
            courseTitle: course.title,
            documentId: document.id,
            documentName: document.name,
            text,
            score,
          });
        }
      }
    }
  }

  return candidates.sort((a, b) => b.score - a.score).slice(0, limit);
}
