'use client';

import { BookLevel } from '@/types';

const levels: { value: BookLevel | 'all'; label: string; emoji: string }[] = [
  { value: 'all', label: 'All', emoji: '📚' },
  { value: 'seed', label: 'Seeds', emoji: '🌱' },
  { value: 'sprout', label: 'Sprouts', emoji: '🌿' },
  { value: 'tree', label: 'Trees', emoji: '🌳' },
];

export function LevelFilter({
  selected,
  onChange,
}: {
  selected: BookLevel | 'all';
  onChange: (level: BookLevel | 'all') => void;
}) {
  return (
    <div className="flex gap-2">
      {levels.map(({ value, label, emoji }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-4 py-2 rounded-full text-lg font-medium transition-all ${
            selected === value
              ? 'bg-sky-500 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-sky-50'
          }`}
        >
          {emoji} {label}
        </button>
      ))}
    </div>
  );
}
