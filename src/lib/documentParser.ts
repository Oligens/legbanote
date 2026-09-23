import * as pdfjsLib from 'pdfjs-dist';
import mammoth from 'mammoth/mammoth.browser';

export type ParsedDocument = { text: string; status: 'extracted' | 'stored-raw' | 'failed'; message?: string };

async function parsePdf(file: File): Promise<string> {
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages: string[] = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
  }
  return pages.join('\n\n').trim();
}

async function parseDocx(file: File): Promise<string> {
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value.trim();
}

export async function extractDocumentText(file: File): Promise<ParsedDocument> {
  const extension = file.name.toLowerCase().split('.').pop() || '';
  try {
    if (extension === 'pdf') return { text: await parsePdf(file), status: 'extracted' };
    if (extension === 'docx') return { text: await parseDocx(file), status: 'extracted' };
    if (['txt', 'md', 'csv', 'json', 'xml', 'html', 'htm'].includes(extension)) return { text: await file.text(), status: 'extracted' };
    const raw = new TextDecoder('utf-8', { fatal: false }).decode(await file.arrayBuffer());
    if (raw.trim()) return { text: raw, status: 'extracted', message: 'Format non reconnu ; contenu brut conservé.' };
    return { text: '', status: 'stored-raw', message: 'Fichier stocké, description textuelle à compléter.' };
  } catch (error) {
    return { text: '', status: 'failed', message: 'Extraction impossible ; le fichier est conservé comme ressource brute. ' + (error instanceof Error ? error.message : 'Erreur inconnue.') };
  }
}