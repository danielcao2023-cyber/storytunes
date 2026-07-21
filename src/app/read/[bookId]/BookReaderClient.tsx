'use client';

import { Book } from '@/types';
import { BookReader } from '@/components/reader/BookReader';

export function BookReaderClient({ book }: { book: Book }) {
  return <BookReader book={book} />;
}
