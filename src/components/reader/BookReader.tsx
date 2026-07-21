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

export function BookReader({ book }: BookReaderProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [audioMode, setAudioMode] = useState<'none' | 'read' | 'chant'>('read');
  const [isAnimating, setIsAnimating] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const totalPages = book.pages.length;
  const page = book.pages[currentPage];

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

  // Speak current page text or audio
  useEffect(() => {
    if (audioMode === 'none') return;

    // Try pre-generated audio first (Azure TTS)
    if (page.audioUrl) {
      const audio = new Audio(page.audioUrl);
      audio.play().catch(() => speakWithWebSpeech());
    } else {
      speakWithWebSpeech();
    }

    function speakWithWebSpeech() {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
      window.speechSynthesis.cancel();
      const text = audioMode === 'chant' && page.rhythmText
        ? page.rhythmText.replace(/\n/g, '. ')
        : page.text;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = audioMode === 'chant' ? 0.7 : 0.85;
      utterance.pitch = audioMode === 'chant' ? 1.2 : 1.0;
      // Try to pick a child-friendly voice
      const voices = window.speechSynthesis.getVoices();
      const englishVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Samantha'))
        || voices.find(v => v.lang.startsWith('en-US'))
        || voices.find(v => v.lang.startsWith('en'));
      if (englishVoice) utterance.voice = englishVoice;
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
      <div
        className={`flex-1 transition-opacity duration-300 ${
          isAnimating ? 'opacity-60' : 'opacity-100'
        }`}
      >
        <PageContent
          imageUrl={page.imageUrl}
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
