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
          commentary: `The Bhagavad Gita begins with King Dhritarashtra inquiring about the battle that was about to take place between his sons (the Kauravas) and the sons of Pandu (the Pandavas) on the sacred plain of Kurukshetra. This opening verse sets the stage for the spiritual dialogue that follows between Arjuna and Lord Krishna.`,
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
          commentary: `Duryodhana, the eldest Kaurava, observes the well-organized Pandava army and immediately goes to consult his teacher Dronacharya. This shows his anxiety despite having a larger army. The verse highlights Duryodhana's state of mind as the battle is about to begin.`,
          audioUrl: require("@/assets/sounds/bg_2.mp3")
        },
        {
          id: "1.3",
          verse: 3,
          sanskrit: `पश्यैतां पाण्डुपुत्राणामाचार्य महतीं चमूम् |
व्यूढां द्रुपदपुत्रेण तव शिष्येण धीमता ||3||`,
          transliteration: `paśhyaitāṁ pāṇḍu-putrāṇām āchārya mahatīṁ chamūm
vyūḍhāṁ drupada-putreṇa tava śhiṣhyeṇa dhīmatā`,
          translation: "Behold, O Teacher, this mighty army of the sons of Pandu, arrayed by the son of Drupada, your wise disciple!",
          commentary: `Duryodhana points out to Dronacharya that the Pandava army has been strategically arranged by Drishtadyumna, who was born from the fire sacrifice specifically to kill Drona. This reveals the complex relationships and destiny at play in the Mahabharata war.`,
          audioUrl: require("@/assets/sounds/bg_2.mp3")
        },
        // More verses can be added similarly...
      ]
    },
    {
      chapter: 2,
      title: "Sankhya Yoga",
      verseCount: 72,
      verses: [
        {
          id: "2.1",
          verse: 1,
          sanskrit: `संजय उवाच |
तं तथा कृपयाविष्टमश्रुपूर्णाकुलेक्षणम् |
विषीदन्तमिदं वाक्यमुवाच मधुसूदनः ||1||`,
          transliteration: `sañjaya uvācha
taṁ tathā kṛipayāviṣhṭam aśhru-pūrṇākulekṣhaṇam
viṣhīdantam idaṁ vākyam uvācha madhusūdanaḥ`,
          translation: "Sanjay said: To him who was thus overcome with pity and despondency, with eyes full of tears and agitated, Madhusudana (Krishna) spoke these words.",
          commentary: `This verse marks the beginning of Lord Krishna's teachings. Arjuna is overwhelmed with grief at the thought of fighting his relatives, and Krishna begins his divine discourse to remove Arjuna's delusion. The chapter introduces the concepts of the eternal soul and the temporary nature of the physical body.`,
          audioUrl: require("@/assets/sounds/bg_2.mp3")
        },
        {
          id: "2.2",
          verse: 2,
          sanskrit: `श्रीभगवानुवाच |
कुतस्त्वा कश्मलमिदं विषमे समुपस्थितम् |
अनार्यजुष्टमस्वर्ग्यमकीर्तिकरमर्जुन ||2||`,
          transliteration: `śhrī bhagavān uvācha
kutas tvā kaśhmalam idaṁ viṣhame samupasthitam
anārya-juṣhṭam asvargyam akīrti-karam arjuna`,
          translation: "The Supreme Lord said: O Arjuna, how has this delusion overcome you in this hour of crisis? It is not befitting an honorable person. It leads not to higher planets but to disgrace.",
          commentary: `Lord Krishna chastises Arjuna for his weakness, calling it unworthy of a noble person. He points out that such behavior won't lead to heavenly planets but will instead bring dishonor. This marks the beginning of Krishna's attempt to lift Arjuna from his despondency.`,
          audioUrl: require("@/assets/sounds/bg_2.mp3")
        }
        // More verses can be added similarly...
      ]
    }
    // More chapters can be added similarly...
  ]
};