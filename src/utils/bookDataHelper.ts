// src/data/bookDataHelper.ts
import i18n from 'i18next';
import { bhagavadGitaData } from '@/src/data/books/bhagavadGitaData';
import { rigVedaMantrasData } from '@/src/data/books/rigVedaMantrasData';

type VerseTranslation = {
  verse?: number;
  transliteration?: string;  // Now in local script
  translation?: string;
  commentary?: string;
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
  const bookData = bookId === '1' ? bhagavadGitaData : rigVedaMantrasData;
  
  // Get translations - add error handling
  let translations: BookTranslation;
  try {
    translations = bookId === '1' 
      ? i18n.t('bhagavadGitaData', { returnObjects: true }) as BookTranslation
      : i18n.t('rigVedaMantrasData', { returnObjects: true }) as BookTranslation;
  } catch (error) {
    console.error('Error loading translations:', error);
    translations = {};
  }

  // Debug: Log the raw translation structure
  console.log('RAW TRANSLATIONS:', translations);

  return {
    ...bookData,
    title: translations?.title || bookData.title,
    author: translations?.author || bookData.author,
    language: translations?.language || bookData.language,
    chapters: bookData.chapters.map(chapter => {
      // Find translated chapter - more defensive
      const translatedChapter = translations?.chapters?.find(
        tc => tc?.chapter === chapter.chapter
      ) || {};

      // Debug chapter match
      console.log(`MATCHING CHAPTER ${chapter.chapter}:`, {
        translatedTitle: translatedChapter?.title,
        hasVerses: !!translatedChapter?.verses
      });

      return {
        ...chapter,
        title: translatedChapter?.title || chapter.title,
        verses: chapter.verses.map(verse => {
          // Find translated verse - handle missing arrays
          const translatedVerses = translatedChapter?.verses || [];
          const translatedVerse = translatedVerses.find(
            tv => tv?.verse === verse.verse
          ) || {};

          // Debug verse match
          console.log(`MATCHING VERSE ${verse.verse}:`, {
            foundTranslation: !!translatedVerse?.translation,
            foundTransliteration: !!translatedVerse?.transliteration,
            foundCommentary: !!translatedVerse?.commentary
          });

          return {
            ...verse, // Keep all original fields
            // Only override if translation exists
            ...(translatedVerse?.translation && { 
              translation: translatedVerse.translation 
            }),
            ...(translatedVerse?.transliteration && {
              transliteration: translatedVerse.transliteration
            }),
            ...(translatedVerse?.commentary && {
              commentary: translatedVerse.commentary
            })
          };
        })
      };
    })
  };
};

// Helper function to get all books with translations
export const getAllLocalizedBooks = () => {
  return [
    getLocalizedBookData('1'), // Bhagavad Gita
    getLocalizedBookData('2')  // Rig Veda Mantras
  ];
};

// Helper function to get book by ID with translations
export const getLocalizedBookById = (id: string) => {
  return getLocalizedBookData(id);
};