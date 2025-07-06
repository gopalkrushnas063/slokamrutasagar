export const krishnaLeelaData = {
  id: "4",
  title: "Krishna Leela",
  author: "Vyasa",
  image: require("@/assets/images/categories/krishna_leela.png"),
  rating: 4.9,
  language: "Sanskrit",
  chapters: [
    {
      chapter: 1,
      title: "Birth of Krishna",
      verseCount: 1,
      verses: [
        {
          id: "1.1",
          verse: 1,
          sanskrit: `वसुदेवसुतं देवं कंसचाणूरमर्दनम् | 
देवकीपरमानन्दं कृष्णं वन्दे जगद्गुरुम् ||`,
          transliteration: `vasudeva-sutaṁ devaṁ kaṁsa-cāṇūra-mardanam |
devakī-paramānandaṁ kṛṣṇaṁ vande jagad-gurum ||`,
          translation: "I bow to Lord Krishna, the son of Vasudeva, the destroyer of Kamsa and Chanura, the supreme bliss of Devaki, and the teacher of the world.",
          commentary: "This verse describes the divine birth of Lord Krishna and his purpose of coming to Earth.",
          audioUrl: require("@/assets/sounds/bg_2.mp3")
        }
        // Add more verses as needed
      ]
    }
    // Add more chapters as needed
  ]
};