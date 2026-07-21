import { NextResponse } from 'next/server';
import { seedPresetBooks } from '@/lib/seed-books';

export async function POST() {
  try {
    await seedPresetBooks();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Seed error:', error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
