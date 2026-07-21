import { NextRequest, NextResponse } from 'next/server';
import { getBook } from '@/lib/books';
import { supabase } from '@/lib/supabase';
import { generateImage } from '@/lib/ai/image';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  const { bookId } = await request.json();

  const book = await getBook(bookId);
  if (!book) {
    return NextResponse.json({ error: 'Book not found' }, { status: 404 });
  }

  const updatedPages = [...book.pages];

  for (let i = 0; i < updatedPages.length; i++) {
    try {
      const imageUrl = await generateImage(updatedPages[i].imagePrompt);
      const cloudinaryUrl = await uploadToCloudinary(
        imageUrl,
        `storytunes/${bookId}/page-${i}`
      );
      updatedPages[i] = { ...updatedPages[i], imageUrl: cloudinaryUrl };
    } catch (err) {
      console.error(`Failed to generate image for page ${i}:`, err);
    }
  }

  const coverImageUrl = updatedPages[0]?.imageUrl || '';
  await supabase
    .from('books')
    .update({ pages: updatedPages, cover_image_url: coverImageUrl })
    .eq('id', bookId);

  return NextResponse.json({ ...book, pages: updatedPages, coverImageUrl });
}
