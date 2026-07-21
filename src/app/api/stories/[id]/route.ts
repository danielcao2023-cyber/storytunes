import { NextRequest, NextResponse } from 'next/server';
import { getBook, deleteBook, updateReadProgress } from '@/lib/books';
import { getLocalPresetBook } from '@/data/preset-books';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const book = await getBook(id);
    if (book) {
      return NextResponse.json(book);
    }
  } catch {
    // Supabase not configured — fall through to local presets
  }

  const localBook = getLocalPresetBook(id);
  if (!localBook) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(localBook);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteBook(id);
  } catch {
    // Supabase not available — accept the deletion silently
  }
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await updateReadProgress(id);
  } catch {
    // Supabase not available — accept silently
  }
  return NextResponse.json({ ok: true });
}
