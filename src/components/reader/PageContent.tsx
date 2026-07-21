'use client';

interface PageContentProps {
  imageUrl: string;
  text: string;
  rhythmText?: string;
  rhythmBeats?: string;
  imagePrompt?: string;
  audioMode: 'none' | 'read' | 'chant';
  isActive: boolean;
  pageIndex?: number;
}

const COLOR_MAP: Record<string, { bg: string; emoji: string }> = {
  red:    { bg: 'from-red-200 via-red-100 to-rose-100', emoji: '🍎' },
  blue:   { bg: 'from-blue-300 via-blue-100 to-sky-100', emoji: '☁️' },
  green:  { bg: 'from-green-200 via-green-100 to-emerald-100', emoji: '🌳' },
  yellow: { bg: 'from-yellow-200 via-yellow-100 to-amber-100', emoji: '☀️' },
  orange: { bg: 'from-orange-200 via-orange-100 to-amber-100', emoji: '🍊' },
  pink:   { bg: 'from-pink-200 via-pink-100 to-rose-100', emoji: '🌸' },
  purple: { bg: 'from-purple-200 via-purple-100 to-violet-100', emoji: '🍇' },
  brown:  { bg: 'from-amber-300 via-amber-100 to-yellow-100', emoji: '🐻' },
  black:  { bg: 'from-stone-300 via-stone-100 to-gray-200', emoji: '🐧' },
  white:  { bg: 'from-stone-100 via-white to-sky-50', emoji: '☁️' },
};

const ANIMAL_MAP: Record<string, string> = {
  cat: '🐱', dog: '🐕', bird: '🐦', duck: '🦆', pig: '🐷', horse: '🐴',
  cow: '🐮', sheep: '🐑', bunny: '🐰', rabbit: '🐰', frog: '🐸', bear: '🐻',
  fish: '🐟', lion: '🦁', monkey: '🐵', elephant: '🐘', giraffe: '🦒',
  penguin: '🐧', chicken: '🐔', mouse: '🐭', tiger: '🐯', zebra: '🦓',
};

const OBJECT_EMOJI: Record<string, string> = {
  apple: '🍎', banana: '🍌', milk: '🥛', cookie: '🍪', bread: '🍞', egg: '🥚',
  ball: '⚽', car: '🚗', book: '📖', bed: '🛏️', chair: '🪑', table: '🪑',
  sun: '☀️', moon: '🌙', star: '⭐', tree: '🌳', flower: '🌸', house: '🏠',
  water: '💧', rain: '🌧️', snow: '❄️', rainbow: '🌈', cloud: '☁️',
  barn: '🏠', cake: '🎂', balloon: '🎈', boat: '⛵', towel: '🧴',
  lamp: '💡', teddy: '🧸', bubbles: '🫧', swing: '🎠', slide: '🛝',
  park: '🌳', zoo: '🦁', farm: '🐄', home: '🏠',
  bath: '🛁', food: '🍎', numbers: '🔢', colors: '🌈',
  body: '🧍', things: '📦', weather: '🌤️', actions: '🏃',
  birthday: '🎂', bedtime: '🌙',
};

function parsePrompt(prompt: string): { colorKey: string | null; emoji: string; theme: string } {
  const lower = prompt.toLowerCase();

  // 1. Find color word
  let colorKey: string | null = null;
  for (const color of Object.keys(COLOR_MAP)) {
    if (lower.includes(color)) {
      colorKey = color;
      break;
    }
  }

  // 2. Find animal
  let emoji = '📖';
  for (const [animal, e] of Object.entries(ANIMAL_MAP)) {
    if (lower.includes(animal)) {
      emoji = e;
      break;
    }
  }

  // 3. If no animal found, try objects
  if (emoji === '📖') {
    for (const [obj, e] of Object.entries(OBJECT_EMOJI)) {
      if (lower.includes(obj)) {
        emoji = e;
        break;
      }
    }
  }

  // 4. If still no match, check the page text
  if (emoji === '📖' && colorKey) {
    emoji = COLOR_MAP[colorKey].emoji;
  }

  const theme = colorKey || 'default';
  return { colorKey, emoji, theme };
}

export function PageContent({
  imageUrl,
  text,
  rhythmText,
  rhythmBeats,
  imagePrompt,
  audioMode,
  isActive,
  pageIndex = 0,
}: PageContentProps) {
  const displayText =
    audioMode === 'chant' && rhythmText ? rhythmText : text;
  const beats =
    audioMode === 'chant' && rhythmBeats ? rhythmBeats.split(' ') : [];

  const { colorKey, emoji } = imagePrompt
    ? parsePrompt(imagePrompt)
    : { colorKey: null, emoji: '📖' };

  const gradient = colorKey
    ? COLOR_MAP[colorKey]?.bg
    : 'from-amber-100 via-orange-50 to-yellow-100';

  const showEmoji = imageUrl ? null : emoji;

  return (
    <div className="flex h-full">
      {/* Left: Illustration (60%) */}
      <div className="w-[60%] h-full relative">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient}`}>
            <span className="text-[12rem] leading-none select-none opacity-80 drop-shadow-lg">
              {showEmoji}
            </span>
          </div>
        )}
      </div>

      {/* Right: Text (40%) */}
      <div className="w-[40%] h-full flex flex-col justify-center p-8 lg:p-12 bg-white">
        {audioMode === 'chant' ? (
          <div className="space-y-4">
            {displayText.split('\n').map((line, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-3xl lg:text-4xl font-bold text-stone-800 leading-relaxed">
                  {line}
                </span>
                {beats[i] && (
                  <span className="text-2xl text-amber-500">{beats[i]}</span>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-3xl lg:text-4xl font-bold text-stone-800 leading-relaxed">
            {displayText}
          </p>
        )}
      </div>
    </div>
  );
}
