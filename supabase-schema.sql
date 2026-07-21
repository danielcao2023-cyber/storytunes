-- Run this in Supabase SQL Editor to create the books table

CREATE TABLE IF NOT EXISTS books (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  level TEXT NOT NULL CHECK (level IN ('seed', 'sprout', 'tree')),
  theme TEXT NOT NULL,
  pages JSONB NOT NULL DEFAULT '[]',
  cover_image_url TEXT NOT NULL DEFAULT '',
  is_preset BOOLEAN NOT NULL DEFAULT false,
  generation_prompt JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_read_at TIMESTAMPTZ,
  read_count INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_books_level ON books(level);
CREATE INDEX IF NOT EXISTS idx_books_created_at ON books(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_books_is_preset ON books(is_preset);

-- Enable Row Level Security (family-only, allow all operations)
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Family access" ON books FOR ALL USING (true);
