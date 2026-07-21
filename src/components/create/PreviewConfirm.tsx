'use client';

import { CreateStoryInput, BookLevel } from '@/types';

const levelInfo: Record<BookLevel, { emoji: string; desc: string }> = {
  seed: { emoji: '🌱', desc: '10-20 words · One sentence per page' },
  sprout: { emoji: '🌿', desc: '30-50 words · Repeating patterns' },
  tree: { emoji: '🌳', desc: '50-80 words · Simple story' },
};

export function PreviewConfirm({
  input,
  onGenerate,
  generating,
}: {
  input: CreateStoryInput;
  onGenerate: () => void;
  generating: boolean;
}) {
  const info = levelInfo[input.level];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow space-y-3">
        <h3 className="text-lg font-bold text-stone-700">Your Book Settings</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-stone-400">Theme:</span>{' '}
            <span className="font-medium text-stone-700">{input.theme}</span>
          </div>
          <div>
            <span className="text-stone-400">Level:</span>{' '}
            <span className="font-medium text-stone-700">
              {info.emoji} {input.level}
            </span>
          </div>
          <div>
            <span className="text-stone-400">Character:</span>{' '}
            <span className="font-medium text-stone-700">
              {input.character}
            </span>
          </div>
          <div>
            <span className="text-stone-400">Pages:</span>{' '}
            <span className="font-medium text-stone-700">
              {input.pageCount}
            </span>
          </div>
        </div>
        <p className="text-xs text-stone-400">{info.desc}</p>
      </div>

      <button
        onClick={onGenerate}
        disabled={generating}
        className="w-full bg-sky-500 hover:bg-sky-600 disabled:bg-sky-200 text-white text-2xl font-bold py-6 rounded-2xl shadow-lg transition-colors"
      >
        {generating ? (
          <span className="flex items-center justify-center gap-3">
            <span className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            Creating Your Book...
          </span>
        ) : (
          '✨ Create My Book!'
        )}
      </button>
    </div>
  );
}
