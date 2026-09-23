export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    return;
  }

  const { question, context = [] } = req.body ?? {};
  if (typeof question !== 'string' || !question.trim()) {
    res.status(400).json({ error: 'question is required' });
    return;
  }

  const contextText = Array.isArray(context)
    ? context
        .filter((item: any) => item && typeof item.text === 'string')
        .slice(0, 6)
        .map((item: any, index: number) =>
          [
            '[SOURCE ' + (index + 1) + ']',
            'Cours: ' + String(item.courseTitle ?? ''),
            'Document: ' + String(item.documentName ?? ''),
            String(item.text),
          ].join('\n')
        )
        .join('\n\n')
    : '';

  const hasLocalContext = Boolean(contextText.trim());
  const systemInstruction = [
    'Tu es Legba Note, assistant académique vocal.',
    'Réponds en français, de façon claire, pédagogique et concise.',
    hasLocalContext
      ? 'Utilise prioritairement les extraits des cours personnels fournis ci-dessous. Ne prétends pas qu’un élément vient des notes s’il n’y figure pas.'
      : 'Aucun extrait personnel pertinent n’a été retrouvé. Réponds avec tes connaissances générales et indique explicitement que la réponse ne provient pas des notes personnelles.',
    'Si les notes sont incomplètes, complète avec tes connaissances générales et signale cette partie comme connaissance générale.',
    'Ne fabrique jamais de citation, de page ou de document.',
    'Contexte local RAG:\n' + (contextText || '[Aucun contexte local pertinent]'),
  ].join('\n\n');

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemInstruction }] },
          contents: [{ role: 'user', parts: [{ text: question.trim() }] }],
          generationConfig: { temperature: 0.25 },
        }),
      }
    );

    const data = await response.json();
    if (!response.ok) {
      res.status(response.status).json({
        error: data?.error?.message || 'Gemini request failed',
      });
      return;
    }

    const answer =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: any) => part?.text || '')
        .join('')
        .trim() || '';

    if (!answer) {
      res.status(502).json({ error: 'Gemini returned an empty response.' });
      return;
    }

    res.status(200).json({
      answer,
      usedLocalContext: hasLocalContext,
      sources: Array.isArray(context)
        ? context.slice(0, 6).map((item: any) => item.documentName).filter(Boolean)
        : [],
    });
  } catch (error) {
    res.status(500).json({
      error: error instanceof Error ? error.message : 'Unexpected Gemini error',
    });
  }
}
