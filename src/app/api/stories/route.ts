import { NextRequest, NextResponse } from 'next/server';
import { getBooks } from '@/lib/books';
import { getLocalPresetBooks } from '@/data/preset-books';
import { BookLevel } from '@/types';

export async function GET(request: NextRequest) {
  const level = request.nextUrl.searchParams.get('level') as BookLevel | null;

  try {
    const books = await getBooks(level || undefined);
    if (books.length > 0) {
      return NextResponse.json(books);
    }
  } catch {
    // Supabase not configured — fall through to local presets
  }

  const localBooks = getLocalPresetBooks(level || undefined);
  return NextResponse.json(localBooks);
}
