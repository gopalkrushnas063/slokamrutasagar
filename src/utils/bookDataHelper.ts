// src/data/bookDataHelper.ts
import i18n from 'i18next';
import { bhagavadGitaData } from '@/src/data/books/bhagavadGitaData';
import { rigVedaMantrasData } from '@/src/data/books/rigVedaMantrasData';

type VerseTranslation = {
  verse?: number;
  sanskrit?: string;  // Added Sanskrit field
  transliteration?: string;
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

  return {
    ...bookData,
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
            })
          };
        })
      };
    })
  };
};

export const getAllLocalizedBooks = () => {
  return [
    getLocalizedBookData('1'), // Bhagavad Gita
    getLocalizedBookData('2')  // Rig Veda Mantras
  ];
};

export const getLocalizedBookById = (id: string) => {
  return getLocalizedBookData(id);
};