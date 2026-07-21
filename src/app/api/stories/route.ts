import { NextRequest, NextResponse } from 'next/server';
import { getBooks } from '@/lib/books';
import { BookLevel } from '@/types';

export async function GET(request: NextRequest) {
  const level = request.nextUrl.searchParams.get('level') as BookLevel | null;
  const books = await getBooks(level || undefined);
  return NextResponse.json(books);
}
