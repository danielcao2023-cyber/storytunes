'use client';

const themes = [
  { id: 'animals', emoji: '🐱', label: 'Animals' },
  { id: 'pets', emoji: '🐕', label: 'Pets' },
  { id: 'dinosaurs', emoji: '🦖', label: 'Dinosaurs' },
  { id: 'vehicles', emoji: '🚗', label: 'Vehicles' },
  { id: 'food', emoji: '🍎', label: 'Food' },
  { id: 'colors', emoji: '🌈', label: 'Colors' },
  { id: 'numbers', emoji: '🔢', label: 'Numbers' },
  { id: 'daily', emoji: '🛁', label: 'Daily Life' },
  { id: 'bedtime', emoji: '🛏️', label: 'Bedtime' },
  { id: 'music', emoji: '🎵', label: 'Music' },
  { id: 'nature', emoji: '🌳', label: 'Nature' },
  { id: 'custom', emoji: '✨', label: 'Custom' },
] as const;

export function ThemePicker({
  selected,
  onSelect,
  customValue,
  onCustomChange,
}: {
  selected: string;
  onSelect: (theme: string) => void;
  customValue: string;
  onCustomChange: (val: string) => void;
}) {
  return (
    <div>
      <div className="grid grid-cols-4 gap-3">
        {themes.map(({ id, emoji, label }) => (
          <button
            key={id}
            onClick={() => onSelect(id)}
            className={`p-4 rounded-2xl text-center transition-all ${
              selected === id
                ? 'bg-sky-500 text-white shadow-lg scale-105'
                : 'bg-white text-stone-600 hover:bg-sky-50 shadow'
            }`}
          >
            <div className="text-3xl mb-1">{emoji}</div>
            <div className="text-sm font-medium">{label}</div>
          </button>
        ))}
      </div>
      {selected === 'custom' && (
        <input
          type="text"
          value={customValue}
          onChange={(e) => onCustomChange(e.target.value)}
          placeholder="Describe your story..."
          className="mt-4 w-full text-lg border-2 border-sky-200 rounded-xl p-4 focus:border-sky-400 outline-none"
          autoFocus
        />
      )}
    </div>
  );
}
