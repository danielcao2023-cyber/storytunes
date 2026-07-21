import { supabase } from './supabase';
import { Book, BookLevel } from '@/types';
import { nanoid } from 'nanoid';

export async function getBooks(level?: BookLevel): Promise<Book[]> {
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
  const { error } = await supabase.from('books').delete().eq('id', id);
  if (error) {
    console.error('Failed to delete book:', error);
  }
}

export async function updateReadProgress(id: string): Promise<void> {
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
