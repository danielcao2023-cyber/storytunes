'use client';

import { CharacterType, LanguageFocus } from '@/types';

const characters: { value: CharacterType; emoji: string; label: string }[] = [
  { value: 'boy', emoji: '👦', label: 'Boy' },
  { value: 'girl', emoji: '👧', label: 'Girl' },
  { value: 'animal', emoji: '🐰', label: 'Animal' },
  { value: 'none', emoji: '📖', label: 'No Character' },
];

const focuses: { value: LanguageFocus; label: string }[] = [
  { value: 'none', label: 'Auto (AI decides)' },
  { value: 'repetition', label: 'Repeating patterns' },
  { value: 'colors', label: 'Color words' },
  { value: 'numbers', label: 'Numbers 1-10' },
  { value: 'actions', label: 'Action words' },
];

export function CharacterStep({
  character,
  onCharacter,
  childName,
  onChildName,
  focus,
  onFocus,
}: {
  character: CharacterType;
  onCharacter: (c: CharacterType) => void;
  childName: string;
  onChildName: (n: string) => void;
  focus: LanguageFocus;
  onFocus: (f: LanguageFocus) => void;
}) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-bold text-stone-700 mb-3">
          Who is the main character?
        </h3>
        <div className="grid grid-cols-4 gap-3">
          {characters.map(({ value, emoji, label }) => (
            <button
              key={value}
              onClick={() => onCharacter(value)}
              className={`p-4 rounded-2xl text-center transition-all ${
                character === value
                  ? 'bg-sky-500 text-white shadow-lg'
                  : 'bg-white text-stone-600 hover:bg-sky-50 shadow'
              }`}
            >
              <div className="text-3xl mb-1">{emoji}</div>
              <div className="text-sm font-medium">{label}</div>
            </button>
          ))}
        </div>
      </div>

      {(character === 'boy' || character === 'girl') && (
        <div>
          <h3 className="text-lg font-bold text-stone-700 mb-3">
            Child&apos;s English name (optional)
          </h3>
          <input
            type="text"
            value={childName}
            onChange={(e) => onChildName(e.target.value)}
            placeholder="e.g. Leo"
            className="w-full text-lg border-2 border-sky-200 rounded-xl p-4 focus:border-sky-400 outline-none"
            maxLength={20}
          />
        </div>
      )}

      <div>
        <h3 className="text-lg font-bold text-stone-700 mb-3">
          Language focus (optional)
        </h3>
        <div className="flex flex-wrap gap-2">
          {focuses.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => onFocus(value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                focus === value
                  ? 'bg-sky-500 text-white'
                  : 'bg-white text-stone-600 hover:bg-sky-50'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
