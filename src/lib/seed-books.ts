import { supabase } from './supabase';
import { PRESET_BOOKS } from '@/data/preset-books';

export async function seedPresetBooks(): Promise<void> {
  const { count } = await supabase
    .from('books')
    .select('*', { count: 'exact', head: true })
    .eq('is_preset', true);

  if (count && count >= 15) {
    return;
  }

  for (const book of PRESET_BOOKS) {
    const { error } = await supabase.from('books').upsert({
      ...book,
      created_at: new Date().toISOString(),
      read_count: 0,
    });

    if (error) {
      console.error(`Failed to seed book ${book.id}:`, error);
    }
  }

  console.log(`Seeded ${PRESET_BOOKS.length} preset books`);
}
