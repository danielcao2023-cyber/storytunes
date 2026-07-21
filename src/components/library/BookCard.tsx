'use client';

import { Book } from '@/types';
import Link from 'next/link';

const levelEmoji: Record<string, string> = {
  seed: '🌱',
  sprout: '🌿',
  tree: '🌳',
};

export function BookCard({ book }: { book: Book }) {
  return (
    <Link
      href={`/read/${book.id}`}
      className="group block bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden no-select"
    >
      <div className="aspect-[4/3] bg-gradient-to-br from-sky-100 to-amber-50 relative overflow-hidden">
        {book.coverImageUrl ? (
          <img
            src={book.coverImageUrl}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            📖
          </div>
        )}
        {book.isPreset && (
          <span className="absolute top-2 right-2 bg-white/80 text-xs px-2 py-1 rounded-full">
            Built-in
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          <span>{levelEmoji[book.level]}</span>
          <span className="text-xs text-stone-400 uppercase font-medium">
            {book.level}
          </span>
        </div>
        <h3 className="font-bold text-lg text-stone-800 line-clamp-2 leading-tight">
          {book.title}
        </h3>
        <p className="text-sm text-stone-400 mt-1">
          {book.pages.length} pages
          {book.readCount > 0 && ` · Read ${book.readCount}×`}
        </p>
      </div>
    </Link>
  );
}
