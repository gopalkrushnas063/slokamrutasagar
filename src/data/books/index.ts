// Import all book data files
import { bhagavadGitaData } from "./bhagavadGitaData";
import { rigVedaMantrasData } from "./rigVedaMantrasData";
import { laxmiPuranData } from "./laxmiPuranData";
import { krishnaLeelaData } from "./krishnaLeelaData";


// Type definition for Book data structure
export type Book = {
  id: string;
  title: string;
  author: string;
  image: any;
  rating: number;
  language: string;
  chapters: Chapter[];
};

export type Chapter = {
  chapter: number;
  title: string;
  verseCount: number;
  verses: Verse[];
};

export type Verse = {
  id: string;
  verse: number;
  sanskrit: string;
  transliteration: string;
  translation: string;
  commentary: string;
  audioUrl?: any;
};

// Array of all books
export const allBooks: Book[] = [
  bhagavadGitaData,
  rigVedaMantrasData,
  laxmiPuranData,
  krishnaLeelaData
];

// Function to get book data by ID
export const getBookDataById = (id: string): Book => {
  const book = allBooks.find(book => book.id === id);
  if (!book) {
    throw new Error(`Book with id ${id} not found`);
  }
  return book;
};

// Function to get all verses from a book
export const getAllVerses = (book: Book): (Verse & { chapter: number; chapterTitle: string })[] => {
  const allVerses: (Verse & { chapter: number; chapterTitle: string })[] = [];
  
  book.chapters.forEach(ch => {
    ch.verses.forEach(v => {
      allVerses.push({
        ...v,
        chapter: ch.chapter,
        chapterTitle: ch.title
      });
    });
  });
  
  return allVerses;
};

// Export all individual book data
export {
  bhagavadGitaData,
  rigVedaMantrasData,
  laxmiPuranData,
  krishnaLeelaData
};