'use client';

import { Book } from '@/types';
import { PageContent } from './PageContent';
import { CompletionScreen } from './CompletionScreen';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';

interface BookReaderProps {
  book: Book;
}

export function BookReader({ book: initialBook }: BookReaderProps) {
  const [book, setBook] = useState(initialBook);
  const [currentPage, setCurrentPage] = useState(0);
  const [audioMode, setAudioMode] = useState<'none' | 'read' | 'chant'>('read');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isIllustrating, setIsIllustrating] = useState(false);
  const [illustrationProgress, setIllustrationProgress] = useState(0);

  const totalPages = book.pages.length;
  const page = book.pages[currentPage];
  const needsIllustration = book.pages.some((p) => !p.imageUrl) && !isIllustrating;

  // Check localStorage for cached illustrations on mount
  useEffect(() => {
    if (!book.pages.some((p) => !p.imageUrl)) return;
    try {
      const cached = localStorage.getItem(`storytunes-images-${book.id}`);
      if (cached) {
        const images = JSON.parse(cached) as string[];
        setBook((prev) => ({
          ...prev,
          pages: prev.pages.map((p, i) =>
            images[i] ? { ...p, imageUrl: images[i] } : p
          ),
        }));
      }
    } catch {
      // localStorage unavailable or corrupted, just generate fresh
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-generate illustrations for preset books that lack them, BUT
  // only after user explicitly confirms (don't spend API quota silently)
  const startIllustrating = useCallback(async () => {
    if (isIllustrating) return;
    setIsIllustrating(true);
    setIllustrationProgress(0);

    try {
      // Call /api/images with book object directly (no Supabase needed)
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book }),
      });
      if (!res.ok) throw new Error('Illustration generation failed');
      const result = await res.json();
      const newPages = result.pages as typeof book.pages;

      setBook((prev) => ({
        ...prev,
        pages: newPages,
        coverImageUrl: result.coverImageUrl || prev.coverImageUrl,
      }));
      setIllustrationProgress(newPages.length);

      // Cache in localStorage
      try {
        localStorage.setItem(
          `storytunes-images-${book.id}`,
          JSON.stringify(newPages.map((p) => p.imageUrl))
        );
      } catch {
        // localStorage full or unavailable — that's fine, just won't cache
      }
    } catch (err) {
      console.error('Failed to generate illustrations:', err);
    } finally {
      setIsIllustrating(false);
    }
  }, [book, isIllustrating]);

  // Show progress updates during generation
  useEffect(() => {
    if (!isIllustrating) return;
    const interval = setInterval(() => {
      setIllustrationProgress((p) => Math.min(p + 1, totalPages));
    }, 4000); // Rough estimate: ~4s per image
    return () => clearInterval(interval);
  }, [isIllustrating, totalPages]);

  const goToNext = useCallback(() => {
    if (currentPage < totalPages - 1 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage((p) => p + 1);
        setIsAnimating(false);
      }, 300);
    } else if (currentPage === totalPages - 1 && !isAnimating) {
      setIsComplete(true);
    }
  }, [currentPage, totalPages, isAnimating]);

  const goToPrev = useCallback(() => {
    if (currentPage > 0 && !isAnimating) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPage((p) => p - 1);
        setIsAnimating(false);
      }, 300);
    }
  }, [currentPage, isAnimating]);

  // Swipe support
  useEffect(() => {
    let touchStartX = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartX = e.touches[0].clientX;
    };
    const handleTouchEnd = (e: TouchEvent) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) goToNext();
        else goToPrev();
      }
    };
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goToNext, goToPrev]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goToNext, goToPrev]);

  // Mark as read on first open
  useEffect(() => {
    fetch(`/api/stories/${book.id}`, { method: 'PATCH' }).catch(() => {});
  }, [book.id]);

  // Speak current page — try Azure TTS first, fall back to Web Speech
  useEffect(() => {
    if (audioMode === 'none') return;

    let cancelled = false;

    // Pre-generated audio (from earlier TTS generation)
    if (page.audioUrl) {
      const audio = new Audio(page.audioUrl);
      audio.play().catch(() => {
        if (!cancelled) speakWithWebSpeech();
      });
      return () => { cancelled = true; };
    }

    // Fetch Azure TTS from server
    const text = audioMode === 'chant' && page.rhythmText
      ? page.rhythmText.replace(/\n/g, '. ')
      : page.text;

    fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, mode: audioMode }),
    })
      .then((res) => {
        if (!res.ok || !res.headers.get('Content-Type')?.includes('audio')) {
          throw new Error('TTS not available');
        }
        return res.blob();
      })
      .then((blob) => {
        if (cancelled) return;
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        audio.play().catch(() => speakWithWebSpeech());
        audio.onended = () => URL.revokeObjectURL(url);
      })
      .catch(() => {
        if (!cancelled) speakWithWebSpeech();
      });

    return () => { cancelled = true; };

    function speakWithWebSpeech() {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(
        audioMode === 'chant' && page.rhythmText
          ? page.rhythmText.replace(/\n/g, '. ')
          : page.text
      );
      utterance.lang = 'en-US';
      utterance.rate = audioMode === 'chant' ? 0.7 : 0.85;
      utterance.pitch = audioMode === 'chant' ? 1.2 : 1.0;
      // Try to pick the best English voice available
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find(
        (v) => v.lang === 'en-US' && v.name.includes('Samantha')
      );
      const fallback =
        voices.find((v) => v.lang === 'en-US' && !v.localService) ||
        voices.find((v) => v.lang === 'en-US') ||
        voices.find((v) => v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;
      else if (fallback) utterance.voice = fallback;
      window.speechSynthesis.speak(utterance);
    }
  }, [currentPage, audioMode, page.audioUrl, page.text, page.rhythmText]);

  if (isComplete) {
    return <CompletionScreen book={book} />;
  }

  return (
    <div className="h-screen flex flex-col bg-stone-900 no-select">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 bg-stone-900/90 backdrop-blur">
        <Link
          href="/"
          className="text-stone-300 hover:text-white text-lg font-medium flex items-center gap-2"
        >
          ← Library
        </Link>
        <h2 className="text-white text-xl font-bold truncate max-w-[50%]">
          {book.title}
        </h2>
        <div className="flex items-center gap-1 bg-stone-800 rounded-xl p-1">
          {([
            ['📖', 'none'],
            ['🎙️', 'read'],
            ['🎵', 'chant'],
          ] as const).map(([emoji, mode]) => (
            <button
              key={mode}
              onClick={() => setAudioMode(mode)}
              className={`text-2xl px-3 py-2 rounded-lg transition-colors ${
                audioMode === mode
                  ? 'bg-sky-500 text-white'
                  : 'text-stone-400 hover:text-white'
              }`}
              title={
                mode === 'none'
                  ? 'Silent'
                  : mode === 'read'
                  ? 'Read Aloud'
                  : 'Rhythm'
              }
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      {/* Page content */}
      {needsIllustration && (
        <div className="text-center py-2 bg-amber-900/40 border-b border-amber-500/20">
          <button
            onClick={startIllustrating}
            className="inline-flex items-center gap-2 px-6 py-2 bg-amber-500 hover:bg-amber-400 text-white rounded-full font-bold text-sm transition-colors"
          >
            🎨 Generate Illustrations
          </button>
          <span className="text-amber-300/60 text-xs ml-3">
            Uses AI to create pictures for every page
          </span>
        </div>
      )}
      {isIllustrating && (
        <div className="text-center py-2 bg-sky-900/40 border-b border-sky-500/20">
          <span className="inline-flex items-center gap-2 text-sky-300 text-sm">
            <span className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            Painting illustrations... {illustrationProgress}/{totalPages} pages
          </span>
        </div>
      )}
      <div
        className={`flex-1 transition-opacity duration-300 ${
          isAnimating ? 'opacity-60' : 'opacity-100'
        }`}
      >
        <PageContent
          imageUrl={page.imageUrl}
          imagePrompt={page.imagePrompt}
          text={page.text}
          rhythmText={page.rhythmText}
          rhythmBeats={page.rhythmBeats}
          audioMode={audioMode}
          isActive={true}
          pageIndex={currentPage}
        />
      </div>

      {/* Bottom navigation */}
      <div className="flex items-center justify-between px-8 py-4 bg-stone-900/90 backdrop-blur">
        <button
          onClick={goToPrev}
          disabled={currentPage === 0}
          className="p-4 rounded-full bg-stone-800 text-white disabled:opacity-30 hover:bg-stone-700 transition-colors"
        >
          <ChevronLeft size={36} />
        </button>

        <span className="text-stone-400 text-xl font-medium">
          {currentPage + 1} / {totalPages}
        </span>

        <button
          onClick={goToNext}
          disabled={currentPage === totalPages - 1}
          className="p-4 rounded-full bg-stone-800 text-white disabled:opacity-30 hover:bg-stone-700 transition-colors"
        >
          <ChevronRight size={36} />
        </button>
      </div>
    </div>
  );
}
