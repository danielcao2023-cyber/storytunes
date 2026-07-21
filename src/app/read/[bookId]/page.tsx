import { getBook } from '@/lib/books';
import { notFound } from 'next/navigation';
import { BookReaderClient } from './BookReaderClient';

export default async function ReadPage({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  const book = await getBook(bookId);

  if (!book) {
    notFound();
  }

  return <BookReaderClient book={book} />;
}
