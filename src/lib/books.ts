import { Book, BookLevel } from '@/types';
import { nanoid } from 'nanoid';

// Check if Supabase is actually configured
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const IS_SUPABASE_CONFIGURED =
  SUPABASE_URL &&
  !SUPABASE_URL.includes('your-project') &&
  !SUPABASE_URL.includes('placeholder');

// Lazy-load supabase only when configured
async function getSupabase() {
  if (!IS_SUPABASE_CONFIGURED) {
    throw new Error('Supabase not configured');
  }
  const { supabase } = await import('./supabase');
  return supabase;
}

export async function getBooks(level?: BookLevel): Promise<Book[]> {
  if (!IS_SUPABASE_CONFIGURED) return [];

  const supabase = await import('./supabase').then((m) => m.supabase);
  let query = supabase
    .from('books')
    .select('*')
    .order('created_at', { ascending: false });

  if (level) {
    query = query.eq('level', level);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Failed to fetch books:', error);
    return [];
  }
  return data as Book[];
}

export async function getBook(id: string): Promise<Book | null> {
  if (!IS_SUPABASE_CONFIGURED) return null;

  const supabase = await import('./supabase').then((m) => m.supabase);
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Failed to fetch book:', error);
    return null;
  }
  return data as Book;
}

export async function createBook(
  book: Omit<Book, 'createdAt' | 'lastReadAt' | 'readCount'>
): Promise<Book> {
  if (!IS_SUPABASE_CONFIGURED) {
    // Return the book as-is (no persistence in dev mode)
    const newBook: Book = {
      ...book,
      id: book.id || nanoid(),
      createdAt: new Date().toISOString(),
      readCount: 0,
    };
    return newBook;
  }

  const supabase = await import('./supabase').then((m) => m.supabase);
  const newBook: Book = {
    ...book,
    id: book.id || nanoid(),
    createdAt: new Date().toISOString(),
    readCount: 0,
  };

  const { error } = await supabase.from('books').insert(newBook);
  if (error) {
    console.error('Failed to create book:', error);
    throw new Error('Failed to save book');
  }
  return newBook;
}

export async function deleteBook(id: string): Promise<void> {
  if (!IS_SUPABASE_CONFIGURED) return;

  const supabase = await import('./supabase').then((m) => m.supabase);
  const { error } = await supabase.from('books').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete book:', error);
  }
}

export async function updateReadProgress(id: string): Promise<void> {
  if (!IS_SUPABASE_CONFIGURED) return;

  const supabase = await import('./supabase').then((m) => m.supabase);
  const { data: book } = await supabase
    .from('books')
    .select('read_count')
    .eq('id', id)
    .single();

  const { error } = await supabase
    .from('books')
    .update({
      last_read_at: new Date().toISOString(),
      read_count: (book?.read_count || 0) + 1,
    })
    .eq('id', id);

  if (error) {
    console.error('Failed to update read progress:', error);
  }
}
