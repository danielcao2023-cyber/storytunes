'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { BookLevel, CharacterType, LanguageFocus } from '@/types';
import { ThemePicker } from '@/components/create/ThemePicker';
import { CharacterStep } from '@/components/create/CharacterStep';
import { PreviewConfirm } from '@/components/create/PreviewConfirm';

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [theme, setTheme] = useState('animals');
  const [customTheme, setCustomTheme] = useState('');
  const [level, setLevel] = useState<BookLevel>('seed');

  const [character, setCharacter] = useState<CharacterType>('animal');
  const [childName, setChildName] = useState('');
  const [focus, setFocus] = useState<LanguageFocus>('none');

  const [generating, setGenerating] = useState(false);

  const finalTheme = theme === 'custom' ? customTheme : theme;

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/stories/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          theme: finalTheme,
          level,
          character,
          childName: childName || undefined,
          languageFocus: focus,
          pageCount: level === 'seed' ? 6 : 8,
        }),
      });

      if (!res.ok) throw new Error('Generation failed');

      const book = await res.json();

      fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookId: book.id }),
      }).catch(console.error);

      router.push(`/read/${book.id}`);
    } catch (err) {
      console.error(err);
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                s <= step
                  ? 'bg-sky-500 text-white'
                  : 'bg-stone-200 text-stone-400'
              }`}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={`w-12 h-1 rounded ${
                  s < step ? 'bg-sky-500' : 'bg-stone-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step 1 */}
      {step === 1 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-800">Choose a Theme</h2>
          <ThemePicker
            selected={theme}
            onSelect={setTheme}
            customValue={customTheme}
            onCustomChange={setCustomTheme}
          />
          <div>
            <h3 className="text-lg font-bold text-stone-700 mb-3">
              Difficulty Level
            </h3>
            <div className="flex gap-2">
              {([
                ['seed', '🌱 Seeds'],
                ['sprout', '🌿 Sprouts'],
                ['tree', '🌳 Trees'],
              ] as const).map(([val, label]) => (
                <button
                  key={val}
                  onClick={() => setLevel(val)}
                  className={`flex-1 py-3 rounded-xl text-center font-medium transition-all ${
                    level === val
                      ? 'bg-sky-500 text-white shadow'
                      : 'bg-white text-stone-600 hover:bg-sky-50 shadow'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Link href="/" className="px-6 py-3 text-stone-400 hover:text-stone-600 font-medium">
              Cancel
            </Link>
            <button
              onClick={() => setStep(2)}
              disabled={theme === 'custom' && !customTheme.trim()}
              className="bg-sky-500 hover:bg-sky-600 disabled:bg-sky-200 text-white px-8 py-3 rounded-xl font-bold text-lg"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {step === 2 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-800">
            Character & Focus
          </h2>
          <CharacterStep
            character={character}
            onCharacter={setCharacter}
            childName={childName}
            onChildName={setChildName}
            focus={focus}
            onFocus={setFocus}
          />
          <div className="flex justify-between gap-3">
            <button
              onClick={() => setStep(1)}
              className="px-6 py-3 text-stone-400 hover:text-stone-600 font-medium"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-3 rounded-xl font-bold text-lg"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Step 3 */}
      {step === 3 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-stone-800">
            Preview & Create
          </h2>
          <PreviewConfirm
            input={{
              theme: finalTheme,
              level,
              character,
              childName: childName || undefined,
              languageFocus: focus,
              pageCount: level === 'seed' ? 6 : 8,
            }}
            onGenerate={handleGenerate}
            generating={generating}
          />
          <div className="flex justify-start">
            <button
              onClick={() => setStep(2)}
              className="px-6 py-3 text-stone-400 hover:text-stone-600 font-medium"
            >
              ← Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
