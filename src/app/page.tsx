'use client';

import { useState, useEffect, useCallback } from 'react';
import { Book, BookLevel } from '@/types';
import { BookCard } from '@/components/library/BookCard';
import { LevelFilter } from '@/components/library/LevelFilter';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';

export default function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [level, setLevel] = useState<BookLevel | 'all'>('all');
  const [loading, setLoading] = useState(true);

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    const url = level === 'all' ? '/api/stories' : `/api/stories?level=${level}`;
    const res = await fetch(url);
    const data = await res.json();
    setBooks(data);
    setLoading(false);
  }, [level]);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-stone-800">My Library</h1>
          <p className="text-stone-400 text-lg mt-1">
            {books.length} book{books.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/create"
          className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white text-lg font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all no-select"
        >
          <PlusCircle size={24} />
          Create New Book
        </Link>
      </div>

      {/* Filters */}
      <div className="mb-6 overflow-x-auto pb-2">
        <LevelFilter selected={level} onChange={setLevel} />
      </div>

      {/* Book grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl animate-pulse aspect-[3/4]"
            />
          ))}
        </div>
      ) : books.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-stone-600 mb-2">
            No books yet
          </h2>
          <p className="text-stone-400 mb-6">
            Create your first picture book or check back later!
          </p>
          <Link
            href="/create"
            className="inline-flex items-center gap-2 bg-sky-500 text-white text-lg font-bold px-6 py-3 rounded-2xl"
          >
            <PlusCircle size={24} />
            Create Your First Book
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
