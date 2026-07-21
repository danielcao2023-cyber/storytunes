'use client';

interface PageContentProps {
  imageUrl: string;
  text: string;
  rhythmText?: string;
  rhythmBeats?: string;
  audioMode: 'none' | 'read' | 'chant';
  isActive: boolean;
}

export function PageContent({
  imageUrl,
  text,
  rhythmText,
  rhythmBeats,
  audioMode,
}: PageContentProps) {
  const displayText =
    audioMode === 'chant' && rhythmText ? rhythmText : text;
  const beats =
    audioMode === 'chant' && rhythmBeats ? rhythmBeats.split(' ') : [];

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
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-8xl animate-pulse">🎨</div>
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
