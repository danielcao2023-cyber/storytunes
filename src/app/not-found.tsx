import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-sky-50 to-amber-50 p-8">
      <div className="text-center">
        <div className="text-8xl mb-6">📖</div>
        <h1 className="text-3xl font-bold text-stone-700 mb-2">
          Book Not Found
        </h1>
        <p className="text-stone-400 mb-6">
          This book may have been deleted or never existed.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-sky-500 text-white px-6 py-3 rounded-xl font-bold hover:bg-sky-600 transition-colors"
        >
          ← Back to Library
        </Link>
      </div>
    </div>
  );
}
