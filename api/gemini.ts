type ServerEnv = { env: Record<string, string | undefined> };
declare const process: ServerEnv;

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    res.status(500).json({
      error: 'Gemini API key is not configured on Vercel. Add GEMINI_API_KEY in Project Settings > Environment Variables and redeploy.',
      code: 'GEMINI_API_KEY_MISSING',
    });
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

  const model = process.env.GEMINI_MODEL || 'gemini-3.8-flash';

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);

    let response: Response;
    try {
      response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-goog-api-key': apiKey,
          },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: systemInstruction }] },
            contents: [{ role: 'user', parts: [{ text: question.trim() }] }],
            generationConfig: {
              thinkingConfig: { thinkingLevel: 'low' },
            },
          }),
          signal: controller.signal,
        }
      );
    } finally {
      clearTimeout(timeout);
    }

    const rawBody = await response.text();
    let data: any = null;
    try {
      data = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      data = null;
    }

    if (!response.ok) {
      const providerMessage =
        data?.error?.message ||
        rawBody ||
        `Gemini API returned HTTP ${response.status}`;

      console.error('[api/gemini] Gemini provider error', {
        status: response.status,
        model,
        message: providerMessage,
      });

      res.status(response.status >= 500 ? 502 : response.status).json({
        error: providerMessage,
        code: 'GEMINI_PROVIDER_ERROR',
      });
      return;
    }

    const answer =
      data?.candidates?.[0]?.content?.parts
        ?.map((part: any) => part?.text || '')
        .join('')
        .trim() || '';

    if (!answer) {
      console.error('[api/gemini] Gemini returned no text', { model, data });
      res.status(502).json({
        error: 'Gemini returned an empty response.',
        code: 'GEMINI_EMPTY_RESPONSE',
      });
      return;
    }

    res.status(200).json({
      answer,
      usedLocalContext: hasLocalContext,
      sources: Array.isArray(context)
        ? context.slice(0, 6).map((item: any) => item?.documentName).filter(Boolean)
        : [],
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.name === 'AbortError'
          ? 'Gemini request timed out after 30 seconds.'
          : error.message
        : 'Unexpected Gemini error';

    console.error('[api/gemini] Server error', error);
    res.status(500).json({
      error: message,
      code: 'GEMINI_SERVER_ERROR',
    });
  }
}
