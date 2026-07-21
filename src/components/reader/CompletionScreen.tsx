'use client';

import { Book } from '@/types';
import { RotateCw, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export function CompletionScreen({ book }: { book: Book }) {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-sky-900 to-indigo-900">
      <div className="text-center">
        {/* Star burst */}
        <div className="text-8xl animate-bounce mb-8">⭐</div>

        <h2 className="text-4xl font-bold text-white mb-2">The End!</h2>
        <p className="text-xl text-sky-200 mb-8">
          Great job finishing &ldquo;{book.title}&rdquo;!
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/read/${book.id}`}
            className="inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg transition-colors"
          >
            <RotateCw size={24} />
            Again!
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white text-xl font-bold px-8 py-4 rounded-2xl shadow-lg transition-colors"
          >
            <ArrowRight size={24} />
            Back to Library
          </Link>
        </div>
      </div>
    </div>
  );
}
