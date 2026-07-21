import { NextRequest, NextResponse } from 'next/server';
import { getBook, deleteBook, updateReadProgress } from '@/lib/books';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const book = await getBook(id);
  if (!book) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }
  return NextResponse.json(book);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await deleteBook(id);
  return NextResponse.json({ ok: true });
}

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await updateReadProgress(id);
  return NextResponse.json({ ok: true });
}
