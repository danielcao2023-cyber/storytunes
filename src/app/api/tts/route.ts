import { NextRequest, NextResponse } from 'next/server';
import { generateAudio } from '@/lib/audio/tts';

export async function POST(request: NextRequest) {
  const { text, mode } = await request.json();

  if (!text) {
    return NextResponse.json({ error: 'Text is required' }, { status: 400 });
  }

  try {
    const audio = await generateAudio(text, mode || 'read');
    if (!audio) {
      return NextResponse.json({ error: 'TTS failed' }, { status: 500 });
    }

    return new NextResponse(new Uint8Array(audio), {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('TTS route error:', error);
    return NextResponse.json({ error: 'TTS failed' }, { status: 500 });
  }
}
