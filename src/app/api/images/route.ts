import { NextRequest, NextResponse } from 'next/server';
import { getBook } from '@/lib/books';
import { generateImage } from '@/lib/ai/image';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Book } from '@/types';

export async function POST(request: NextRequest) {
  const { bookId, book: bookInput } = await request.json();

  let book: Book | null = null;

  // Accept either bookId (lookup from DB) or full book object (no-DB mode)
  if (bookInput) {
    // Direct book object — works without Supabase
    book = { ...bookInput, pages: [...bookInput.pages] };
  } else if (bookId) {
    try {
      book = await getBook(bookId);
    } catch {
      // Supabase not configured
    }
  }

  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const updatedPages = [...book.pages];

  for (let i = 0; i < updatedPages.length; i++) {
    try {
      const imageUrl = await generateImage(updatedPages[i].imagePrompt);
      const cloudinaryUrl = await uploadToCloudinary(
        imageUrl,
        `storytunes/${book.id}/page-${i}`
      );
      updatedPages[i] = { ...updatedPages[i], imageUrl: cloudinaryUrl };
    } catch (err) {
      console.error(`Failed to generate image for page ${i}:`, err);
    }
  }

  const coverImageUrl = updatedPages[0]?.imageUrl || '';

  // Try to persist to Supabase if configured
  try {
    const { supabase } = await import('@/lib/supabase');
    await supabase
      .from('books')
      .update({ pages: updatedPages, cover_image_url: coverImageUrl })
      .eq('id', book.id);
  } catch {
    // Supabase not configured — skip persistence
  }

  return NextResponse.json({ ...book, pages: updatedPages, coverImageUrl });
}
