import { NextRequest, NextResponse } from 'next/server';
import { generateStory } from '@/lib/ai/story';
import { createBook } from '@/lib/books';
import { CreateStoryInput } from '@/types';
import { nanoid } from 'nanoid';

export async function POST(request: NextRequest) {
  try {
    const input: CreateStoryInput = await request.json();

    if (!input.theme) {
      return NextResponse.json(
        { error: 'Theme is required' },
        { status: 400 }
      );
    }

    const aiOutput = await generateStory(input);

    const book = await createBook({
      id: nanoid(),
      title: aiOutput.title,
      level: input.level,
      theme: input.theme,
      coverImageUrl: '',
      pages: aiOutput.pages.map((p, i) => ({
        index: i,
        imageUrl: '',
        imagePrompt: `${aiOutput.visualTheme}. ${p.imagePrompt}`,
        text: p.text,
        rhythmText: p.rhythmText,
        rhythmBeats: p.rhythmBeats,
      })),
      isPreset: false,
      generationPrompt: {
        theme: input.theme,
        character: input.character,
        childName: input.childName,
        languageFocus: input.languageFocus,
        pageCount: input.pageCount,
      },
    });

    return NextResponse.json(book);
  } catch (error) {
    console.error('Story generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate story. Please try again.' },
      { status: 500 }
    );
  }
}
