'use client';

interface PageContentProps {
  imageUrl: string;
  text: string;
  rhythmText?: string;
  rhythmBeats?: string;
  audioMode: 'none' | 'read' | 'chant';
  isActive: boolean;
  pageIndex?: number;
}

const GRADIENTS = [
  'from-amber-100 via-orange-50 to-yellow-100',
  'from-sky-100 via-blue-50 to-cyan-100',
  'from-emerald-100 via-green-50 to-teal-100',
  'from-rose-100 via-pink-50 to-purple-100',
  'from-violet-100 via-indigo-50 to-blue-100',
  'from-lime-100 via-green-50 to-emerald-100',
  'from-fuchsia-100 via-pink-50 to-rose-100',
  'from-teal-100 via-cyan-50 to-sky-100',
];

export function PageContent({
  imageUrl,
  text,
  rhythmText,
  rhythmBeats,
  audioMode,
  pageIndex = 0,
}: PageContentProps) {
  const displayText =
    audioMode === 'chant' && rhythmText ? rhythmText : text;
  const beats =
    audioMode === 'chant' && rhythmBeats ? rhythmBeats.split(' ') : [];
  const gradient = GRADIENTS[pageIndex % GRADIENTS.length];

  return (
    <div className="flex h-full">
      {/* Left: Illustration (60%) */}
      <div className="w-[60%] h-full relative bg-stone-100">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${gradient}`}>
            <span className="text-8xl opacity-30 select-none">
              {['🐱','🐕','🦖','🚗','🍎','🌈','🔢','🛁'][pageIndex % 8]}
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
