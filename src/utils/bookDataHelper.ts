// src/data/bookDataHelper.ts
import i18n from 'i18next';
import { bhagavadGitaData } from '@/src/data/books/bhagavadGitaData';
import { rigVedaMantrasData } from '@/src/data/books/rigVedaMantrasData';
import { laxmiPuranData } from '@/src/data/books/laxmiPuranData';
import { krishnaLeelaData } from '@/src/data/books/krishnaLeelaData';

type VerseTranslation = {
  verse?: number;
  sanskrit?: string;
  transliteration?: string;
  translation?: string;
  commentary?: string;
  audioUrl?: string;
};

type ChapterTranslation = {
  chapter?: number;
  title?: string;
  verses?: VerseTranslation[];
};

type BookTranslation = {
  title?: string;
  author?: string;
  language?: string;
  chapters?: ChapterTranslation[];
};

export const getLocalizedBookData = (bookId: string) => {
  // Get the base book data
  let bookData;
  switch(bookId) {
    case '1': 
      bookData = bhagavadGitaData; 
      break;
    case '2': 
      bookData = rigVedaMantrasData; 
      break;
    case '3': 
      bookData = laxmiPuranData; 
      break;
    case '4': 
      bookData = krishnaLeelaData; 
      break;
    default: 
      bookData = bhagavadGitaData;
  }

  // Determine which translation key to use based on book ID
  let translationKey;
  switch(bookId) {
    case '1': 
      translationKey = 'bhagavadGitaData'; 
      break;
    case '2': 
      translationKey = 'rigVedaMantrasData'; 
      break;
    case '3': 
      translationKey = 'laxmiPuranData'; 
      break;
    case '4': 
      translationKey = 'krishnaLeelaData'; 
      break;
    default: 
      translationKey = 'bhagavadGitaData';
  }

  // Get translations with error handling
  let translations: BookTranslation = {};
  try {
    translations = i18n.t(translationKey, { returnObjects: true }) as BookTranslation;
  } catch (error) {
    console.error(`Error loading translations for ${translationKey}:`, error);
  }

  // Merge the base data with translations
  return {
    ...bookData,
    id: bookId, // Ensure the ID is preserved
    title: translations?.title || bookData.title,
    author: translations?.author || bookData.author,
    language: translations?.language || bookData.language,
    chapters: bookData.chapters.map(chapter => {
      const translatedChapter = translations?.chapters?.find(
        tc => tc?.chapter === chapter.chapter
      ) || {};

      return {
        ...chapter,
        title: translatedChapter?.title || chapter.title,
        verses: chapter.verses.map(verse => {
          const translatedVerses = translatedChapter?.verses || [];
          const translatedVerse = translatedVerses.find(
            tv => tv?.verse === verse.verse
          ) || {};

          return {
            ...verse, // Keep all original fields
            // Only override if translation exists
            ...(translatedVerse?.sanskrit && { 
              sanskrit: translatedVerse.sanskrit 
            }),
            ...(translatedVerse?.translation && { 
              translation: translatedVerse.translation 
            }),
            ...(translatedVerse?.transliteration && {
              transliteration: translatedVerse.transliteration
            }),
            ...(translatedVerse?.commentary && {
              commentary: translatedVerse.commentary
            }),
            // Preserve audioUrl from original data if not in translation
            audioUrl: verse.audioUrl
          };
        })
      };
    })
  };
};

export const getAllLocalizedBooks = () => {
  return ['1', '2', '3', '4'].map(id => getLocalizedBookData(id));
};

export const getLocalizedBookById = (id: string) => {
  return getLocalizedBookData(id);
};

// Utility function to get all verses from a book with chapter info
export const getAllVerses = (book: ReturnType<typeof getLocalizedBookData>) => {
  const allVerses: (VerseTranslation & { 
    chapter: number; 
    chapterTitle: string;
    bookId: string;
    bookTitle: string;
  })[] = [];
  
  book.chapters.forEach(ch => {
    ch.verses.forEach(v => {
      allVerses.push({
        ...v,
        chapter: ch.chapter,
        chapterTitle: ch.title,
        bookId: book.id,
        bookTitle: book.title
      });
    });
  });
  
  return allVerses;
};