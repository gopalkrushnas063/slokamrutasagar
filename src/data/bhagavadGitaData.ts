// src/data/bhagavadGitaData.ts
export const bhagavadGitaData = {
  id: "1",
  title: "Bhagavad Gita",
  author: "Sri Krishna",
  image: require("@/assets/images/categories/bhagavad-gita.jpeg"),
  rating: 4.8,
  language: "Sanskrit",
  chapters: [
    {
      chapter: 1,
      title: "Arjuna Vishada Yoga",
      verseCount: 47,
      verses: [
        {
          id: "1.1",
          verse: 1,
          sanskrit: `धृतराष्ट्र उवाच |
धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः |
मामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ||1||`,
          transliteration: `dhṛitarāśhtra uvācha
dharma-kṣhetre kuru-kṣhetre samavetā yuyutsavaḥ
māmakāḥ pāṇḍavāśhchaiva kimakurvata sañjaya`,
          translation: "Dhritarashtra said: O Sanjay, after gathering on the holy field of Kurukshetra, and desiring to fight, what did my sons and the sons of Pandu do?",
          commentary: `The two armies had gathered on the battlefield of Kurukshetra...`,
          audioUrl: require("@/assets/sounds/bg_2.mp3")
        },
        {
          id: "1.2",
          verse: 2,
          sanskrit: `संजय उवाच |
दृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा |
आचार्यमुपसंगम्य राजा वचनमब्रवीत् ||2||`,
          transliteration: `sañjaya uvācha
dṛiṣhṭvā tu pāṇḍavānīkaṁ vyūḍhaṁ duryodhanastadā
āchāryam upasaṅgamya rājā vachanam abravīt`,
          translation: "Sanjay said: On observing the Pandava army standing in military formation, King Duryodhana approached his teacher Drona and spoke these words:",
          commentary: `Duryodhana, on seeing the well-organized Pandava army...`,
          audioUrl: require("@/assets/sounds/bg_2.mp3")
        },
        // More verses for chapter 1...
      ]
    },
    {
      chapter: 2,
      title: "Sankhya Yoga",
      verseCount: 72,
      verses: [
        // Chapter 2 verses...
      ]
    },
    // More chapters...
  ]
};

export const getAllVerses = () => {
  const allVerses: any[] = [];
  bhagavadGitaData.chapters.forEach(ch => {
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