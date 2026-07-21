export type BookLevel = 'seed' | 'sprout' | 'tree';
export type AudioMode = 'none' | 'read' | 'chant';
export type CharacterType = 'boy' | 'girl' | 'animal' | 'none';
export type LanguageFocus = 'repetition' | 'colors' | 'numbers' | 'actions' | 'none';

export interface GenerationPrompt {
  theme: string;
  character: CharacterType;
  childName?: string;
  languageFocus: LanguageFocus;
  pageCount: 4 | 6 | 8;
}

export interface Page {
  index: number;
  imageUrl: string;
  imagePrompt: string;
  text: string;
  rhythmText?: string;
  rhythmBeats?: string;
  audioUrl?: string;
}

export interface Book {
  id: string;
  title: string;
  level: BookLevel;
  theme: string;
  pages: Page[];
  coverImageUrl: string;
  isPreset: boolean;
  generationPrompt?: GenerationPrompt;
  createdAt: string;
  lastReadAt?: string;
  readCount: number;
}

export interface CreateStoryInput {
  theme: string;
  level: BookLevel;
  character: CharacterType;
  childName?: string;
  languageFocus: LanguageFocus;
  pageCount: 4 | 6 | 8;
}

export interface AIStoryOutput {
  title: string;
  visualTheme: string;
  pages: {
    text: string;
    imagePrompt: string;
    rhythmText: string;
    rhythmBeats: string;
  }[];
}

export interface UserSession {
  isLoggedIn: boolean;
}
