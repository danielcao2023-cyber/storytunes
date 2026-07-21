import { CreateStoryInput, AIStoryOutput } from '@/types';
import { TODDLER_VOCABULARY, LEVEL_CONSTRAINTS } from './prompts/toddler-vocab';
import { RHYTHM_PROMPT } from './prompts/rhythm';

const DEEPSEEK_API = 'https://api.deepseek.com/v1/chat/completions';

export async function generateStory(
  input: CreateStoryInput
): Promise<AIStoryOutput> {
  const config = LEVEL_CONSTRAINTS[input.level];

  const characterPrompt =
    input.character === 'boy'
      ? `The main character is a boy${input.childName ? ` named ${input.childName}` : ''}.`
      : input.character === 'girl'
        ? `The main character is a girl${input.childName ? ` named ${input.childName}` : ''}.`
        : input.character === 'animal'
          ? 'The main character is a cute animal.'
          : 'No specific character needed.';

  const focusPrompt =
    input.languageFocus === 'repetition'
      ? 'Use a repeating sentence pattern throughout (like "I see a ___").'
      : input.languageFocus === 'colors'
        ? 'Focus on color vocabulary.'
        : input.languageFocus === 'numbers'
          ? 'Focus on counting from 1 to 10.'
          : input.languageFocus === 'actions'
            ? 'Focus on action words (run, jump, eat, sleep, play).'
            : '';

  const systemPrompt = `You are a children's book author specializing in toddler English learning.
${TODDLER_VOCABULARY}
LEVEL: ${input.level.toUpperCase()}
${config.structure}
Max ${config.maxWords} unique words total.
Write exactly ${input.pageCount} pages.
${characterPrompt}
${focusPrompt}
Theme: ${input.theme}
${RHYTHM_PROMPT}

CRITICAL: For each page, also create a detailed visual "imagePrompt" describing a colorful, warm illustration scene in watercolor style suitable for toddlers. No text in the images.

Respond ONLY with valid JSON in this exact format:
{
  "title": "Book Title",
  "visualTheme": "description of visual style",
  "pages": [
    {
      "text": "page text",
      "imagePrompt": "visual description for illustrator",
      "rhythmText": "rhythm version with stress marks",
      "rhythmBeats": "● ● ○"
    }
  ]
}`;

  const response = await fetch(DEEPSEEK_API, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'system', content: systemPrompt },
        {
          role: 'user',
          content: `Create a ${config.maxWords}-word English picture book for a 2-year-old about: ${input.theme}. Return only valid JSON.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`DeepSeek API error: ${response.status} ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from DeepSeek');
  }

  const parsed: AIStoryOutput = JSON.parse(content);

  return {
    title: parsed.title,
    visualTheme: parsed.visualTheme,
    pages: parsed.pages.map((p) => ({
      text: p.text,
      imagePrompt: p.imagePrompt,
      rhythmText: p.rhythmText,
      rhythmBeats: p.rhythmBeats,
    })),
  };
}
