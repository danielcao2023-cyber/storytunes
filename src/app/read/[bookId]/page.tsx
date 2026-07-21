import { getBook } from '@/lib/books';
import { getLocalPresetBook } from '@/data/preset-books';
import { notFound } from 'next/navigation';
import { BookReaderClient } from './BookReaderClient';

export default async function ReadPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  let book = null;

  try {
    book = await getBook(bookId);
  } catch {
    // Supabase not configured — use local preset fallback
  }

  if (!book) {
    book = getLocalPresetBook(bookId);
  }

  if (!book) {
    notFound();
  }

  return <BookReaderClient book={book} />;
}
