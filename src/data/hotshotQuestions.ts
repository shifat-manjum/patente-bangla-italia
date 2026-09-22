import type { QuizQuestion } from './quizData';

export const HOTSHOT_QUESTIONS: QuizQuestion[] = [
  {
    "id": "hot-01",
    "chapterId": "strada",
    "chapterTitleIt": "Definizioni Stradali Trabocchetto",
    "chapterTitleBn": "রাস্তার সংজ্ঞা ও ফাঁদ প্রশ্ন",
    "questionIt": "La carreggiata è destinata alla sosta di emergenza dei veicoli.",
    "questionBn": "ক্যারেজিয়াটা (Carreggiata) মূলত যানবাহনের জরুরি পার্কিংয়ের (Sosta di emergenza) জন্য নির্ধারিত।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! ক্যারেজিয়াটা কেবল যানবাহন চলাচলের (Transito dei veicoli) জন্য নির্ধারিত। জরুরি পার্কিংয়ের জায়গা হলো করসিয়া দি এমার্জেনসা (Corsia di emergenza) বা বানকিনা (Banchina), ক্যারেজিয়াটা নয়।",
    "trapTipBn": "ফাঁদ: প্রশ্নে \"Carreggiata è destinata alla sosta\" থাকলে সবসময় সতর্ক হবেন। Carreggiata শুধুমাত্র চলাচলের জন্য!",
    "vocabulary": [
      {
        "wordIt": "Carreggiata",
        "meaningBn": "চলাচলের মূল পিচঢালা সড়ক"
      },
      {
        "wordIt": "Destinata",
        "meaningBn": "উদ্দেশ্যে নির্ধারিত"
      },
      {
        "wordIt": "Sosta di emergenza",
        "meaningBn": "জরুরি পার্কিং"
      }
    ]
  },
  {
    "id": "hot-02",
    "chapterId": "strada",
    "chapterTitleIt": "Definizioni Stradali Trabocchetto",
    "chapterTitleBn": "রাস্তার সংজ্ঞা ও ফাঁদ প্রশ্ন",
    "questionIt": "I marciapiedi fanno parte della carreggiata.",
    "questionBn": "ফুটপাত (Marciapiede) হলো ক্যারেজিয়াটার (Carreggiata) অংশ।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! ফুটপাত রাস্তার (Strada) অংশ হতে পারে, কিন্তু ক্যারেজিয়াটার (Carreggiata) অংশ কখনোই নয়।",
    "trapTipBn": "ফাঁদ শব্দ: Strada বনাম Carreggiata। ফুটপাত Strada-র অংশ, কিন্তু Carreggiata-র অংশ নয়।",
    "vocabulary": [
      {
        "wordIt": "Marciapiedi",
        "meaningBn": "ফুটপাত / পথচারীদের হাঁটার স্থান"
      },
      {
        "wordIt": "Fanno parte",
        "meaningBn": "অংশ হওয়া"
      }
    ]
  },
  {
    "id": "hot-03",
    "chapterId": "strada",
    "chapterTitleIt": "Definizioni Stradali Trabocchetto",
    "chapterTitleBn": "রাস্তার সংজ্ঞা ও ফাঁদ প্রশ্ন",
    "questionIt": "La banchina fa parte della carreggiata.",
    "questionBn": "বানকিনা (Banchina / রাস্তার কাঁধ বা কিনারা) ক্যারেজিয়াটার অংশ।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! বানকিনা ক্যারেজিয়াটার বাইরে অবস্থিত। এটি রাস্তার (Strada) অংশ হলেও ক্যারেজিয়াটার অংশ নয়।",
    "trapTipBn": "Banchina e Marciapiede NON fanno parte della carreggiata!",
    "vocabulary": [
      {
        "wordIt": "Banchina",
        "meaningBn": "রাস্তার কিনারা বা ফুটপাথহীন সাইড"
      }
    ]
  },
  {
    "id": "hot-04",
    "chapterId": "strada",
    "chapterTitleIt": "Definizioni Stradali Trabocchetto",
    "chapterTitleBn": "রাস্তার সংজ্ঞা ও ফাঁদ প্রশ্ন",
    "questionIt": "L'isola di traffico è una piazzola destinata alla sosta dei veicoli.",
    "questionBn": "আইল্যান্ড অফ ট্রাফিক (Isola di traffico) যানবাহন পার্কিং করার নির্ধারিত স্থান।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! আইল্যান্ড অফ ট্রাফিক গাড়ি চলাচলের দিক নির্দেশ ও ট্রাফিক পৃথক করার জন্য তৈরি, এখানে গাড়ি চালানো বা পার্কিং করা সম্পূর্ণ নিষিদ্ধ।",
    "trapTipBn": "Isola di traffico-তে পার্কিং বা গাড়ি ওঠানো সবসময় নিষিদ্ধ।",
    "vocabulary": [
      {
        "wordIt": "Isola di traffico",
        "meaningBn": "ট্রাফিক চ্যানেল আইল্যান্ড"
      },
      {
        "wordIt": "Piazzola di sosta",
        "meaningBn": "পার্কিং বে"
      }
    ]
  },
  {
    "id": "hot-05",
    "chapterId": "strada",
    "chapterTitleIt": "Definizioni Stradali Trabocchetto",
    "chapterTitleBn": "রাস্তার সংজ্ঞা ও ফাঁদ প্রশ্ন",
    "questionIt": "La corsia può essere destinata alla sosta di emergenza.",
    "questionBn": "একটি লেন (Corsia) জরুরি পার্কিংয়ের উদ্দেশ্যে নির্ধারিত হতে পারে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! হাইওয়েতে করসিয়া দি এমার্জেনসা (Corsia di emergenza) গাড়ি বিকল হলে বা জরুরি পার্কিংয়ের জন্য নির্দিষ্ট লেন।",
    "trapTipBn": "Corsia জরুরি পার্কিংয়ের জন্য হতে পারে (Corsia di emergenza), কিন্তু সাধারণ Carreggiata নয়।",
    "vocabulary": [
      {
        "wordIt": "Corsia",
        "meaningBn": "রাস্তার লেন"
      },
      {
        "wordIt": "Può essere",
        "meaningBn": "হতে পারে"
      }
    ]
  },
  {
    "id": "hot-06",
    "chapterId": "strada",
    "chapterTitleIt": "Definizioni Stradali Trabocchetto",
    "chapterTitleBn": "রাস্তার সংজ্ঞা ও ফাঁদ প্রশ্ন",
    "questionIt": "La corsia di accelerazione serve per rientrare nella corsia di marcia dopo una sosta.",
    "questionBn": "এক্সিলারেশন লেন (Corsia di accelerazione) পার্কিং শেষে আবার রাস্তায় ফিরে আসার জন্য ব্যবহৃত হয়।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! করসিয়া দি অ্যাক্সিলারেশন হাইওয়েতে প্রবেশের সময় গতি বাড়ানোর জন্য ব্যবহৃত হয়, পার্কিং বা সস্তা থেকে ফেরার জন্য নয়।",
    "trapTipBn": "Corsia di accelerazione serve per ENTRARE in autostrada, non per la sosta!",
    "vocabulary": [
      {
        "wordIt": "Accelerazione",
        "meaningBn": "গতি বৃদ্ধি"
      },
      {
        "wordIt": "Rientrare",
        "meaningBn": "পুনরায় প্রবেশ করা"
      }
    ]
  },
  {
    "id": "hot-07",
    "chapterId": "strada",
    "chapterTitleIt": "Definizioni Stradali Trabocchetto",
    "chapterTitleBn": "রাস্তার সংজ্ঞা ও ফাঁদ প্রশ্ন",
    "questionIt": "Il salvagente serve al riparo o alla sosta dei pedoni che attraversano la strada.",
    "questionBn": "সালভাজেন্তে (Salvagente / নিরাপত্তা আইল্যান্ড) পথচারীদের রাস্তা পারাপারের সময় দাঁড়ানো বা আশ্রয়ের জন্য ব্যবহৃত হয়।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! সালভাজেন্তে হলো ট্রাম লাইন বা চওড়া রাস্তায় পথচারীদের নিরাপদে দাঁড়িয়ে থাকার উঁচু প্ল্যাটফর্ম।",
    "trapTipBn": "Salvagente pedoni-দের জন্য নিরাপদ আশ্রয় (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Salvagente",
        "meaningBn": "পথচারী সুরক্ষা প্ল্যাটফর্ম"
      },
      {
        "wordIt": "Riparo",
        "meaningBn": "আশ্রয়"
      }
    ]
  },
  {
    "id": "hot-08",
    "chapterId": "strada",
    "chapterTitleIt": "Definizioni Stradali Trabocchetto",
    "chapterTitleBn": "রাস্তার সংজ্ঞা ও ফাঁদ প্রশ্ন",
    "questionIt": "Una strada può essere suddivisa in più carreggiate.",
    "questionBn": "একটি রাস্তা একাধিক ক্যারেজিয়াটায় (Carreggiate) বিভক্ত হতে পারে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! স্পার্তিত্রাফিকো (Spartitraffico) দিয়ে একটি বড় রাস্তা দুই বা ততোধিক ক্যারেজিয়াটায় বিভক্ত হতে পারে।",
    "trapTipBn": "Strada-র ভেতর একাধিক Carreggiata থাকতে পারে (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Suddivisa",
        "meaningBn": "বিভক্ত"
      },
      {
        "wordIt": "Più carreggiate",
        "meaningBn": "একাধিক ক্যারেজিয়াটা"
      }
    ]
  },
  {
    "id": "hot-09",
    "chapterId": "pericolo",
    "chapterTitleIt": "Segnali di Pericolo Trabocchetto",
    "chapterTitleBn": "বিপদ সংকেতের সূক্ষ্ম ফাঁদ",
    "questionIt": "Il segnale di pericolo viene posto, di norma, a 150 metri dal punto di inizio del pericolo.",
    "questionBn": "বিপদজনক সংকেত সাধারণত বিপদ শুরুর স্থান থেকে ১৫০ মিটার পূর্বে স্থাপন করা হয়।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! ইতালির ট্রাফিক কোড অনুযায়ী যেকোনো ত্রিভুজাকার বিপদ সংকেত নিয়মমাফিক (Di norma) ১৫০ মিটার আগে বসানো হয়।",
    "trapTipBn": "Di norma (সাধারণ নিয়ম) থাকলে এবং ১৫০ মিটার উল্লেখ থাকলে এটি VERO।",
    "image": 1,
    "vocabulary": [
      {
        "wordIt": "Viene posto",
        "meaningBn": "বসানো বা স্থাপন করা হয়"
      },
      {
        "wordIt": "Di norma",
        "meaningBn": "সাধারণ নিয়মে"
      }
    ]
  },
  {
    "id": "hot-10",
    "chapterId": "pericolo",
    "chapterTitleIt": "Segnali di Pericolo Trabocchetto",
    "chapterTitleBn": "বিপদ সংকেতের সূক্ষ্ম ফাঁদ",
    "questionIt": "In presenza del segnale di CUNETTA è consentito sempre il sorpasso.",
    "questionBn": "কুনেত্তা (Cunetta / নিচু রাস্তা) সংকেতের উপস্থিতিতে সবসময় ওভারটেক করা অনুমোদিত।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! এখানে \"Sempre\" শব্দটি আছে। কুনেত্তায় পর্যাপ্ত দৃশ্যমানতা না থাকলে বা বিপরীতমুখী দুই লেনের রাস্তায় ওভারটেক করা ঝুঁকিপূর্ণ ও নিষিদ্ধ হতে পারে।",
    "trapTipBn": "ফাঁদ শব্দ: \"Sempre\" (সবসময়)। ট্রাফিকে নিঃশর্ত \"Sempre\" থাকলে ৯৫% ক্ষেত্রে FALSO হয়।",
    "vocabulary": [
      {
        "wordIt": "Cunetta",
        "meaningBn": "মাঝখানে নিচু রাস্তা"
      },
      {
        "wordIt": "Sempre",
        "meaningBn": "সবসময় (ফাঁদ শব্দ)"
      }
    ]
  },
  {
    "id": "hot-11",
    "chapterId": "pericolo",
    "chapterTitleIt": "Segnali di Pericolo Trabocchetto",
    "chapterTitleBn": "বিপদ সংকেতের সূক্ষ্ম ফাঁদ",
    "questionIt": "In presenza del segnale di DOSSO è vietata l'inversione di marcia.",
    "questionBn": "দসসো (Dosso / উঁচু সড়ক ঢিবি) থাকলে সেখানে ইউ-টার্ন (Inversione di marcia) করা সম্পূর্ণ নিষিদ্ধ।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! দসসোতে সামনের রাস্তা দেখা যায় না (Visibilità limitata), তাই ইউ-টার্ন, রিভার্স বা পার্কিং করা সম্পূর্ণ নিষিদ্ধ।",
    "trapTipBn": "Dosso-তে Inversione, Sosta, Fermata এবং বিপরীত লেনে Sorpasso সম্পূর্ণ নিষিদ্ধ!",
    "vocabulary": [
      {
        "wordIt": "Dosso",
        "meaningBn": "উঁচু ঢিবি / অন্ধ বাঁক"
      },
      {
        "wordIt": "Inversione di marcia",
        "meaningBn": "গাড়ির দিক পরিবর্তন বা ইউ-টার্ন"
      }
    ]
  },
  {
    "id": "hot-12",
    "chapterId": "pericolo",
    "chapterTitleIt": "Segnali di Pericolo Trabocchetto",
    "chapterTitleBn": "বিপদ সংকেতের সূক্ষ্ম ফাঁদ",
    "questionIt": "In presenza del segnale di DOSSO è sempre vietato il sorpasso.",
    "questionBn": "দসসো (Dosso) সংকেত দেখলে ওভারটেক করা সবসময় নিষিদ্ধ।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! যদি রাস্তাটি একমুখী (Senso unico) হয় অথবা যাওয়ার দিকে অন্তত ২টি লেন থাকে এবং বিপরীত লেনে না যেতে হয়, তবে দসসোতেও ওভারটেক করা বৈধ!",
    "trapTipBn": "ফাঁদ শব্দ: \"Sempre vietato\"। একইমুখী একাধিক লেন থাকলে দসসোতেও ওভারটেক সম্ভব।",
    "vocabulary": [
      {
        "wordIt": "Sempre vietato",
        "meaningBn": "সবসময় নিষিদ্ধ (ফাঁদ শব্দ)"
      }
    ]
  },
  {
    "id": "hot-13",
    "chapterId": "pericolo",
    "chapterTitleIt": "Segnali di Pericolo Trabocchetto",
    "chapterTitleBn": "বিপদ সংকেতের সূক্ষ্ম ফাঁদ",
    "questionIt": "Il segnale di PASSAGGIO A LIVELLO CON BARRIERE è integrato da un dispositivo a luci rosse lampeggianti alternate.",
    "questionBn": "ব্যারিয়ারযুক্ত রেল ক্রসিং সংকেতটিতে দুটি পর্যায়ক্রমিক জ্বলন্ত লাল বাতি থাকে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! ব্যারিয়ারযুক্ত (Con barriere) রেল ক্রসিংয়ে থাকে একটি ফিক্সড লাল বাতি (Luce rossa fissa)। দুটি ফ্ল্যাশিং লাল বাতি থাকে সেমি-ব্যারিয়ার (Semibarriere) বা ব্যারিয়ারবিহীন (Senza barriere) ক্রসিংয়ে!",
    "trapTipBn": "Con barriere = ১টি Luce rossa fissa; Senza barriere / Semibarriere = ২টি Luci rosse lampeggianti!",
    "vocabulary": [
      {
        "wordIt": "Passaggio a livello",
        "meaningBn": "রেল ক্রসিং"
      },
      {
        "wordIt": "Luci rosse lampeggianti",
        "meaningBn": "ফ্ল্যাশিং লাল বাতি"
      }
    ]
  },
  {
    "id": "hot-14",
    "chapterId": "pericolo",
    "chapterTitleIt": "Segnali di Pericolo Trabocchetto",
    "chapterTitleBn": "বিপদ সংকেতের সূক্ষ্ম ফাঁদ",
    "questionIt": "Il segnale di DISCESA PERICOLOSA comporta una diminuzione dello spazio di frenatura.",
    "questionBn": "খাড়া ঢালু নিম্নমুখী রাস্তা (Discesa pericolosa) সংকেতটির কারণে ব্রেকিং দূরত্ব কমে যায়।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! নিচে নামার সময় মাধ্যাকর্ষণের কারণে গাড়ির ব্রেকিং দূরত্ব বৃদ্ধি পায় (Aumenta), কমে না (Non diminuisce)!",
    "trapTipBn": "Discesa-তে spazio di frenatura AUMENTA (বৃদ্ধি পায়), কখনো diminuisce নয়!",
    "vocabulary": [
      {
        "wordIt": "Discesa pericolosa",
        "meaningBn": "বিপদজনক খাড়া ঢালু রাস্তা"
      },
      {
        "wordIt": "Spazio di frenatura",
        "meaningBn": "ব্রেকিং দূরত্ব"
      },
      {
        "wordIt": "Diminuzione",
        "meaningBn": "হ্রাস পাওয়া (ভুল)"
      }
    ]
  },
  {
    "id": "hot-15",
    "chapterId": "pericolo",
    "chapterTitleIt": "Segnali di Pericolo Trabocchetto",
    "chapterTitleBn": "বিপদ সংকেতের সূক্ষ্ম ফাঁদ",
    "questionIt": "Il segnale di DOPPIA CURVA PERICOLOSA preannuncia una serie di curve.",
    "questionBn": "ডাবল বাঁক (Doppia curva) সংকেতটি একাধারে একাধিক অনেকগুলো বাঁকের পূর্বাভাস দেয়।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! ডাবল কার্ভ সংকেতটি কেবল দুটি ধারাবাহিক বিপজ্জনক বাঁকের (Due sole curve) পূর্বাভাস দেয়। যদি ৩ বা ততোধিক বাঁক থাকে, তবে নিচে সম্পূরক ফলক থাকতে হয়।",
    "trapTipBn": "Doppia curva = ঠিক দুটি বাঁক, \"una serie di curve\" নয়।",
    "vocabulary": [
      {
        "wordIt": "Doppia curva",
        "meaningBn": "দ্বৈত বিপজ্জনক বাঁক"
      },
      {
        "wordIt": "Serie di curve",
        "meaningBn": "ধারাবাহিক বহু বাঁক (ফাঁদ)"
      }
    ]
  },
  {
    "id": "hot-16",
    "chapterId": "pericolo",
    "chapterTitleIt": "Segnali di Pericolo Trabocchetto",
    "chapterTitleBn": "বিপদ সংকেতের সূক্ষ্ম ফাঁদ",
    "questionIt": "In presenza del segnale di STRADA SDRUCCIOLEVOLE lo spazio di frenatura aumenta.",
    "questionBn": "পিচ্ছিল সড়ক (Strada sdrucciolevole) সংকেতের উপস্থিতিতে গাড়ির ব্রেকিং দূরত্ব বৃদ্ধি পায়।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! রাস্তা পিচ্ছিল বা ভেজা থাকলে টায়ারের গ্রিপ কমে যায়, ফলে গাড়ি থামাতে অনেক বেশি দূরত্বের প্রয়োজন হয়।",
    "trapTipBn": "পিচ্ছিল রাস্তায় Aderenza কমে এবং Spazio di frenatura বৃদ্ধি পায় (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Strada sdrucciolevole",
        "meaningBn": "পিচ্ছিল রাস্তা"
      },
      {
        "wordIt": "Aumenta",
        "meaningBn": "বৃদ্ধি পায়"
      }
    ]
  },
  {
    "id": "hot-17",
    "chapterId": "pericolo",
    "chapterTitleIt": "Segnali di Pericolo Trabocchetto",
    "chapterTitleBn": "বিপদ সংকেতের সূক্ষ্ম ফাঁদ",
    "questionIt": "Il segnale di VENTO LATERALE preannuncia un pericolo maggiore all'uscita da una galleria.",
    "questionBn": "পার্শ্ববর্তী তীব্র বাতাস (Vento laterale) সংকেতটি টানেল থেকে বের হওয়ার মুখে বড় বিপদের ইঙ্গিত দেয়।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! টানেল বা ব্রিজের মুখ থেকে বের হওয়ার সময় বাতাসের তীব্র ঝাপটা হঠাৎ গাড়িকে দিক পরিবর্তন করিয়ে দিতে পারে।",
    "trapTipBn": "Vento laterale টানেল থেকে বের হওয়া এবং ফ্লাইওভারে বেশি বিপজ্জনক (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Vento laterale",
        "meaningBn": "পার্শ্ববর্তী বাতাস"
      },
      {
        "wordIt": "Uscita da galleria",
        "meaningBn": "টানেল থেকে বের হওয়ার মুখ"
      }
    ]
  },
  {
    "id": "hot-18",
    "chapterId": "pericolo",
    "chapterTitleIt": "Segnali di Pericolo Trabocchetto",
    "chapterTitleBn": "বিপদ সংকেতের সূক্ষ্ম ফাঁদ",
    "questionIt": "Il segnale di CADUTA MASSI preannuncia il pericolo di caduta di pietre dalla sinistra.",
    "questionBn": "পাহাড় থেকে পাথর পড়ার সংকেতটি বাম পাশ থেকে পাথর পড়ার বিপদ নির্দেশ করে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! সংকেতের ছবিতে যে পাশ থেকে পাথর পড়ছে (ডান বা বাম), পাথর সেই পাশ থেকেই গড়িয়ে নামার সম্ভাবনা বোঝায়। এটি অন্ধভাবে সবসময় বাম পাশ নয়।",
    "trapTipBn": "চিহ্নের গ্রাফিক্সে পাহাড়ের অবস্থান লক্ষ্য করুন।",
    "vocabulary": [
      {
        "wordIt": "Caduta massi",
        "meaningBn": "পাহাড় ধস / পাথর পড়া"
      }
    ]
  },
  {
    "id": "hot-19",
    "chapterId": "precedenza",
    "chapterTitleIt": "Precedenze e Incroci Trabocchetto",
    "chapterTitleBn": "অগ্রাধিকার ও মোড়ের ফাঁদ",
    "questionIt": "Negli incroci regolati da semaforo, il tram ha la precedenza solo se proviene da destra.",
    "questionBn": "ট্রাফিক সিগন্যাল লাইটযুক্ত মোড়ে ট্রাম কেবল তখনই অগ্রাধিকার পাবে যদি তা ডানদিক থেকে আসে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! ট্রাম একটি রেল যান (Veicolo su rotaie)। ট্রাফিক কোড অনুযায়ী ট্রাম যেকোনো দিক (ডান বা বাম) থেকেই আসুক না কেন তাকে অগ্রাধিকার দিতে হবে, যদি না ট্রাফিক লাইট তাকে থামার নির্দেশ দেয়।",
    "trapTipBn": "ফাঁদ শব্দ: \"Solo se proviene da destra\"। ট্রামের সাধারণ নিয়ম হলো যেকোনো দিক থেকেই অগ্রাধিকার পাওয়া।",
    "vocabulary": [
      {
        "wordIt": "Tram",
        "meaningBn": "রেলচালিত ট্রামগাড়ি"
      },
      {
        "wordIt": "Solo se",
        "meaningBn": "কেবলমাত্র যদি"
      }
    ]
  },
  {
    "id": "hot-20",
    "chapterId": "precedenza",
    "chapterTitleIt": "Precedenze e Incroci Trabocchetto",
    "chapterTitleBn": "অগ্রাধিকার ও মোড়ের ফাঁদ",
    "questionIt": "In presenza del segnale DARE PRECEDENZA è obbligatorio fermarsi sempre all'incrocio.",
    "questionBn": "অগ্রাধিকার দিন (Dare Precedenza) সাইন থাকলে মোড়ে সবসময় গাড়ি পুরোপুরি থামানো বাধ্যতামূলক।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! \"Dare precedenza\" চিহ্নে কোনো গাড়ি না আসলে গতি কমিয়ে চলে যাওয়া যায়। গাড়ি পুরোপুরি থামানো বাধ্যতামূলক শুধুমাত্র \"STOP\" চিহ্নে!",
    "trapTipBn": "Dare Precedenza = গাড়ি আসলে থামুন; STOP = ফাঁকা থাকলেও ১ সেকেন্ডের জন্য পুরোপুরি থামুন (Obbligo di arresto)!",
    "vocabulary": [
      {
        "wordIt": "Fermarsi sempre",
        "meaningBn": "সবসময় থামতে হবে (ফাঁদ শব্দ)"
      }
    ]
  },
  {
    "id": "hot-21",
    "chapterId": "precedenza",
    "chapterTitleIt": "Precedenze e Incroci Trabocchetto",
    "chapterTitleBn": "অগ্রাধিকার ও মোড়ের ফাঁদ",
    "questionIt": "I veicoli delle forze di polizia con sirena accesa e lampeggiante blu hanno sempre la precedenza.",
    "questionBn": "নীল বাতি ও সাইরেন বাজিয়ে চলা পুলিশের গাড়ি সবসময় মোড়ে অগ্রাধিকার পাবে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! জরুরি সেবায় নিয়োজিত গাড়ি (জরুরি সাইরেন ও ব্লু ফ্ল্যাশার সক্রিয় থাকলে) ট্রাফিক লাইট বা অগ্রাধিকার নিয়মের ঊর্ধ্বে অগ্রাধিকার পায়।",
    "trapTipBn": "Sirena + Lampeggiante blu থাকলে সবাইকে পথ ছেড়ে দিতে হবে (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Sirena accesa",
        "meaningBn": "সাইরেন বাজানো"
      },
      {
        "wordIt": "Lampeggiante blu",
        "meaningBn": "নীল বাতি"
      }
    ]
  },
  {
    "id": "hot-22",
    "chapterId": "precedenza",
    "chapterTitleIt": "Precedenze e Incroci Trabocchetto",
    "chapterTitleBn": "অগ্রাধিকার ও মোড়ের ফাঁদ",
    "questionIt": "Chi esce da una proprietà privata deve dare la precedenza a tutti i veicoli in transito.",
    "questionBn": "ব্যক্তিগত গ্যারেজ বা রাস্তা থেকে বের হওয়া গাড়িকে প্রধান রাস্তার সকল গাড়িকে অগ্রাধিকার দিতে হবে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! ব্যক্তিগত ড্রাইভওয়ে বা সম্পত্তি থেকে মূল সড়কে প্রবেশের সময় ডান ও বাম উভয় দিকের সকল গাড়িকে অগ্রাধিকার দেওয়া বাধ্যতামূলক।",
    "trapTipBn": "Proprietà privata বা Sentiero থেকে উঠলে সবাইকে অগ্রাধিকার দিতে হবে (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Proprietà privata",
        "meaningBn": "ব্যক্তিগত জায়গা / গ্যারেজ"
      },
      {
        "wordIt": "Tutti i veicoli",
        "meaningBn": "সকল যানবাহন"
      }
    ]
  },
  {
    "id": "hot-23",
    "chapterId": "precedenza",
    "chapterTitleIt": "Precedenze e Incroci Trabocchetto",
    "chapterTitleBn": "অগ্রাধিকার ও মোড়ের ফাঁদ",
    "questionIt": "Nelle rotatorie i veicoli che sono già all'interno hanno sempre la precedenza su quelli che entrano.",
    "questionBn": "গোলচত্বরে (Rotatoria) যারা ইতোমধ্যে ভেতরে ঘুরছে তারা প্রবেশকারী গাড়ির ওপর সবসময় অগ্রাধিকার পায়।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! সাধারণ নিয়মে ডানদিক অগ্রাধিকার পায়, যদি না গোলচত্বরের প্রবেশমুখে \"Dare Precedenza\" সাইন লাগানো থাকে। তাই নিঃশর্ত \"Sempre\" ভুল!",
    "trapTipBn": "সাধারণ ইউরোপীয় রোতাতোরিয়ায় Dare Precedenza সাইন থাকলেই কেবল ভেতরের গাড়ি অগ্রাধিকার পায়।",
    "vocabulary": [
      {
        "wordIt": "Rotatoria",
        "meaningBn": "গোলচত্বর"
      }
    ]
  },
  {
    "id": "hot-24",
    "chapterId": "precedenza",
    "chapterTitleIt": "Precedenze e Incroci Trabocchetto",
    "chapterTitleBn": "অগ্রাধিকার ও মোড়ের ফাঁদ",
    "questionIt": "Il conducente che svolta a sinistra deve dare la precedenza ai veicoli provenienti da destra e di fronte.",
    "questionBn": "যে চালক বামে মোড় নেবে তাকে ডানদিক ও সামনাসামনি আসা গাড়িকে অগ্রাধিকার দিতে হবে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! বামে মোড় নেওয়ার সময় সামনের এবং ডানদিকের গাড়ির পথ কেটে যেতে হয়, তাই উভয়কে অগ্রাধিকার দেওয়া বাধ্যতামূলক।",
    "trapTipBn": "Svolta a sinistra করলে ডান এবং সোজা আসা গাড়িকে অগ্রাধিকার দিতে হয় (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Svolta a sinistra",
        "meaningBn": "বামে মোড় নেওয়া"
      },
      {
        "wordIt": "Di fronte",
        "meaningBn": "সামনাসামনি"
      }
    ]
  },
  {
    "id": "hot-25",
    "chapterId": "precedenza",
    "chapterTitleIt": "Precedenze e Incroci Trabocchetto",
    "chapterTitleBn": "অগ্রাধিকার ও মোড়ের ফাঁদ",
    "questionIt": "In un incrocio senza segnali, i veicoli a trazione animale hanno la precedenza sui veicoli a motore.",
    "questionBn": "সংকেতবিহীন মোড়ে ঘোড়ার গাড়ি মোটরযানের ওপর অগ্রাধিকার পায়।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! পশুচালিত যান বা ঘোড়ার গাড়ির জন্য কোনো বিশেষ অগ্রাধিকার নেই। সাধারণ নিয়মে ডানদিকের গাড়ি অগ্রাধিকার পায়।",
    "trapTipBn": "Trazione animale-র কোনো অতিরিক্ত অগ্রাধিকার নেই।",
    "vocabulary": [
      {
        "wordIt": "Trazione animale",
        "meaningBn": "পশুচালিত গাড়ি"
      }
    ]
  },
  {
    "id": "hot-26",
    "chapterId": "precedenza",
    "chapterTitleIt": "Precedenze e Incroci Trabocchetto",
    "chapterTitleBn": "অগ্রাধিকার ও মোড়ের ফাঁদ",
    "questionIt": "Chi deve dare la precedenza deve rallentare e, se occorre, fermarsi.",
    "questionBn": "যাকে অগ্রাধিকার দিতে হবে তাকে গতি কমাতে হবে এবং প্রয়োজনে থামতে হবে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! অগ্রাধিকার দেওয়ার নিয়ম হলো গতি কমানো এবং প্রয়োজন হলে গাড়ি থামিয়ে পথ ছেড়ে দেওয়া।",
    "trapTipBn": "\"Se occorre, fermarsi\" (প্রয়োজনে থামা) সবসময় সত্য।",
    "vocabulary": [
      {
        "wordIt": "Se occorre",
        "meaningBn": "প্রয়োজন হলে"
      }
    ]
  },
  {
    "id": "hot-27",
    "chapterId": "precedenza",
    "chapterTitleIt": "Precedenze e Incroci Trabocchetto",
    "chapterTitleBn": "অগ্রাধিকার ও মোড়ের ফাঁদ",
    "questionIt": "Il segnale di DIRITTO DI PRECEDENZA comporta l'obbligo di dare la precedenza ai veicoli provenienti da destra.",
    "questionBn": "অগ্রাধিকার অধিকার (Diritto di precedenza) সাইনটি ডানদিকের গাড়িকে অগ্রাধিকার দেওয়ার বাধ্যবাধকতা তৈরি করে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! এই সাইনটি থাকলে আপনি নিজেই অগ্রাধিকার পাবেন, অন্য কাউকে অগ্রাধিকার দিতে হবে না।",
    "trapTipBn": "Diritto di precedenza মানে আপনার নিজস্ব অগ্রাধিকার রয়েছে।",
    "vocabulary": [
      {
        "wordIt": "Diritto di precedenza",
        "meaningBn": "অগ্রাধিকারের অধিকার"
      }
    ]
  },
  {
    "id": "hot-28",
    "chapterId": "precedenza",
    "chapterTitleIt": "Precedenze e Incroci Trabocchetto",
    "chapterTitleBn": "অগ্রাধিকার ও মোড়ের ফাঁদ",
    "questionIt": "Prima di impegnare un incrocio, bisogna accertarsi che si possa proseguire senza bloccare il traffico.",
    "questionBn": "মোড়ে প্রবেশের আগে নিশ্চিত হতে হবে যেন মোড়ের ভেতর আটকে ট্রাফিক জ্যাম তৈরি না হয়।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! আপনার অগ্রাধিকার থাকলেও যদি মোড়ের ওপারে জ্যাম থাকে, তবে মোড় ফাঁকা না হওয়া পর্যন্ত প্রবেশ করা যাবে না।",
    "trapTipBn": "মোড় ব্লক করা যাবে না, অগ্রাধিকার থাকলেও অপেক্ষা করতে হবে (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Impegnare l'incrocio",
        "meaningBn": "মোড়ে প্রবেশ করা"
      }
    ]
  },
  {
    "id": "hot-29",
    "chapterId": "divieto",
    "chapterTitleIt": "Segnali di Divieto Trabocchetto",
    "chapterTitleBn": "নিষেধাজ্ঞামূলক সংকেতের ফাঁদ",
    "questionIt": "Il segnale di SENSO VIETATO vieta la circolazione nei due sensi.",
    "questionBn": "সেনসো ভিয়েতাতো (Senso vietato / লাল বৃত্তে সাদা বার) উভয় দিকে চলাচল নিষিদ্ধ করে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! সেনসো ভিয়েতাতো শুধুমাত্র একদিক থেকে প্রবেশ নিষিদ্ধ করে (একমুখী রাস্তা), অপর দিক থেকে গাড়ি আসতে পারে। উভয় দিকে নিষিদ্ধের সাইন হলো Divieto di Transito!",
    "trapTipBn": "Senso Vietato = একমুখী (Entrata vietata); Divieto di Transito = উভয় দিকে নিষিদ্ধ!",
    "vocabulary": [
      {
        "wordIt": "Senso vietato",
        "meaningBn": "একমুখী রাস্তায় প্রবেশ নিষেধ"
      },
      {
        "wordIt": "Nei due sensi",
        "meaningBn": "উভয় দিকে (ভুল)"
      }
    ]
  },
  {
    "id": "hot-30",
    "chapterId": "divieto",
    "chapterTitleIt": "Segnali di Divieto Trabocchetto",
    "chapterTitleBn": "নিষেধাজ্ঞামূলক সংকেতের ফাঁদ",
    "questionIt": "Il segnale di DIVIETO DI TRANSITO vieta la circolazione a tutti i veicoli, compresi i pedoni.",
    "questionBn": "ডিভিয়েতো দি ট্রানজিতো (Divieto di transito) পথচারীসহ সবার চলাচল নিষিদ্ধ করে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! এটি সকল যানবাহনের (Veicoli) জন্য নিষিদ্ধ, কিন্তু পথচারীরা (Pedoni) ফুটপাত দিয়ে নিরাপদে চলাচল করতে পারে।",
    "trapTipBn": "Divieto di Transito যানবাহনের জন্য, পথচারীদের নিষিদ্ধ করে না।",
    "vocabulary": [
      {
        "wordIt": "Divieto di transito",
        "meaningBn": "গাড়ি চলাচল সম্পূর্ণ নিষেধ"
      },
      {
        "wordIt": "Compresi i pedoni",
        "meaningBn": "পথচারীসহ (ফাঁদ শব্দ)"
      }
    ]
  },
  {
    "id": "hot-31",
    "chapterId": "divieto",
    "chapterTitleIt": "Segnali di Divieto Trabocchetto",
    "chapterTitleBn": "নিষেধাজ্ঞামূলক সংকেতের ফাঁদ",
    "questionIt": "Il segnale di DIVIETO DI SORPASSO vieta il sorpasso dei veicoli a due ruote non a motore.",
    "questionBn": "ওভারটেকিং নিষেধ সাইনটি সাধারণ সাইকেল (Veicoli a due ruote non a motore) ওভারটেক করতেও নিষেধ করে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! যদি ক্যারেজিয়াটার দাগ না ডিঙিয়ে নিরাপদ দূরত্ব রেখে সাইকেল বা ইঞ্জিনবিহীন দুই চাকার যান অতিক্রম করা যায়, তবে তা বৈধ।",
    "trapTipBn": "দাগ না ডিঙিয়ে সাইকেল ও মোটরবিহীন যান ওভারটেক করা যায়।",
    "vocabulary": [
      {
        "wordIt": "Due ruote non a motore",
        "meaningBn": "ইঞ্জিনবিহীন দুই চাকার বাহন (সাইকেল)"
      }
    ]
  },
  {
    "id": "hot-32",
    "chapterId": "divieto",
    "chapterTitleIt": "Segnali di Divieto Trabocchetto",
    "chapterTitleBn": "নিষেধাজ্ঞামূলক সংকেতের ফাঁদ",
    "questionIt": "Il segnale di DIVIETO DI SORPASSO PER GLI AUTOCARRI si riferisce a tutti gli autocarri.",
    "questionBn": "ট্রাকের ওভারটেকিং নিষেধ সাইনটি সব ধরনের ছোট-বড় ট্রাকের জন্য প্রযোজ্য।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! এটি কেবল ৩.৫ টনের বেশি ওজনের (Massa a pieno carico superiore a 3,5 t) মালবাহী ট্রাকের জন্য প্রযোজ্য। ছোট ভ্যান বা ৩.৫ টনের নিচের ট্রাক ওভারটেক করতে পারে।",
    "trapTipBn": "Autocarri divieto = শুধুমাত্র ৩.৫ টনের বেশি ওজনের ট্রাক!",
    "vocabulary": [
      {
        "wordIt": "Autocarri",
        "meaningBn": "পণ্যবাহী ট্রাক"
      },
      {
        "wordIt": "Superiore a 3,5 t",
        "meaningBn": "৩.৫ টনের বেশি"
      }
    ]
  },
  {
    "id": "hot-33",
    "chapterId": "divieto",
    "chapterTitleIt": "Segnali di Divieto Trabocchetto",
    "chapterTitleBn": "নিষেধাজ্ঞামূলক সংকেতের ফাঁদ",
    "questionIt": "Il segnale di DIVIETO DI SOSTA consente la fermata.",
    "questionBn": "পার্কিং নিষেধ (Divieto di sosta) সাইনটিতে সাময়িক থামা (Fermata) অনুমোদিত।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! ডিভিয়েতো দি সোস্তা থাকলে পার্কিং নিষিদ্ধ কিন্তু যাত্রী ওঠানামার জন্য সাময়িক থামা (Fermata) শতভাগ বৈধ।",
    "trapTipBn": "Divieto di sosta-তে Fermata বৈধ; কিন্তু Divieto di fermata-তে Sosta ও Fermata দুটোই নিষিদ্ধ!",
    "vocabulary": [
      {
        "wordIt": "Divieto di sosta",
        "meaningBn": "পার্কিং নিষেধ"
      },
      {
        "wordIt": "Consente la fermata",
        "meaningBn": "থামা অনুমোদিত"
      }
    ]
  },
  {
    "id": "hot-34",
    "chapterId": "divieto",
    "chapterTitleIt": "Segnali di Divieto Trabocchetto",
    "chapterTitleBn": "নিষেধাজ্ঞামূলক সংকেতের ফাঁদ",
    "questionIt": "Il segnale di LIMITE MASSIMO DI VELOCITÀ 50 obbliga a marciare ad almeno 50 km/h.",
    "questionBn": "সর্বোচ্চ গতিসীমা ৫০ সাইনটি অন্তত ৫০ কিমি/ঘণ্টা গতিতে চলতে বাধ্য করে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! লাল বৃত্তের ভেতরের ৫০ হলো \"সর্বোচ্চ গতিসীমা\" (Limite massimo), এর বেশি যাওয়া যাবে না। নীল বৃত্তের ৫০ হলো \"সর্বনিম্ন গতিসীমা\" (Limite minimo)।",
    "trapTipBn": "লাল বৃত্ত = সর্বোচ্চ সীমা; নীল বৃত্ত = সর্বনিম্ন বাধ্যতামূলক গতিসীমা!",
    "vocabulary": [
      {
        "wordIt": "Limite massimo",
        "meaningBn": "সর্বোচ্চ সীমা"
      },
      {
        "wordIt": "Almeno",
        "meaningBn": "অন্তত / কমপেক্ষ (ফাঁদ শব্দ)"
      }
    ]
  },
  {
    "id": "hot-35",
    "chapterId": "divieto",
    "chapterTitleIt": "Segnali di Divieto Trabocchetto",
    "chapterTitleBn": "নিষেধাজ্ঞামূলক সংকেতের ফাঁদ",
    "questionIt": "In presenza del segnale di VIA LIBERA terminano tutti i divieti precedentemente imposti.",
    "questionBn": "ভিয়া লিবেরা (সাদা বৃত্তে কালো তির্যক দাগ) থাকলে পূর্বের সমস্ত নিষেধাজ্ঞা সমাপ্ত হয়।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! ভিয়া লিবেরা কেবল গতিসীমা ও ওভারটেকিংয়ের মতো নির্দিষ্ট মুভিং নিষেধাজ্ঞা শেষ করে, তবে পার্কিং নিষেধ (Divieto di sosta) বা অন্য কোনো নিষেধাজ্ঞা বাতিল করে না।",
    "trapTipBn": "Via Libera পার্কিং বা স্টপ সাইন বাতিল করে না।",
    "vocabulary": [
      {
        "wordIt": "Via libera",
        "meaningBn": "নিষেধাজ্ঞা সমাপ্তি সংকেত"
      },
      {
        "wordIt": "Tutti i divieti",
        "meaningBn": "সকল নিষেধাজ্ঞা (ফাঁদ শব্দ)"
      }
    ]
  },
  {
    "id": "hot-36",
    "chapterId": "divieto",
    "chapterTitleIt": "Segnali di Divieto Trabocchetto",
    "chapterTitleBn": "নিষেধাজ্ঞামূলক সংকেতের ফাঁদ",
    "questionIt": "Il segnale di DIVIETO DI TRANSITO AI VEICOLI A TRAZIONE ANIMALE consente il transito alle biciclette.",
    "questionBn": "পশুচালিত যান চলাচল নিষেধ সাইনটিতে সাইকেল চলাচল অনুমোদিত।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! এই সংকেতটি শুধুমাত্র পশুচালিত গাড়ির জন্য, এটি সাইকেল চলাচলে কোনো বাধা দেয় না।",
    "trapTipBn": "একটি নির্দিষ্ট ক্যাটাগরির সাইন অন্য নিরীহ বাহনকে নিষিদ্ধ করে না।",
    "vocabulary": [
      {
        "wordIt": "Consente il transito",
        "meaningBn": "চলাচল অনুমোদিত"
      }
    ]
  },
  {
    "id": "hot-37",
    "chapterId": "obbligo",
    "chapterTitleIt": "Segnali di Obbligo Trabocchetto",
    "chapterTitleBn": "বাধ্যতামূলক সংকেতের ফাঁদ",
    "questionIt": "Il segnale di DIREZIONE OBBLIGATORIA A DESTRA preannuncia una curva pericolosa a destra.",
    "questionBn": "ডানে বাধ্যতামূলক দিক নির্দেশক সাইনটি ডানে একটি বিপজ্জনক বাঁকের পূর্বাভাস দেয়।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! এটি মোড়ে ডানে মোড় নেওয়ার বাধ্যবাধকতা নির্দেশ করে (Segnale di obbligo), কোনো বাঁকের সংকেত (Pericolo) নয়।",
    "trapTipBn": "Direzione obbligatoria হলো Obbligo, Curva pericolosa হলো Pericolo (ত্রিভুজাকার)।",
    "vocabulary": [
      {
        "wordIt": "Direzione obbligatoria",
        "meaningBn": "বাধ্যতামূলক দিক"
      },
      {
        "wordIt": "Curva pericolosa",
        "meaningBn": "বিপজ্জনক বাঁক (ভুল)"
      }
    ]
  },
  {
    "id": "hot-38",
    "chapterId": "obbligo",
    "chapterTitleIt": "Segnali di Obbligo Trabocchetto",
    "chapterTitleBn": "বাধ্যতামূলক সংকেতের ফাঁদ",
    "questionIt": "Il segnale di CATENE DA NEVE OBBLIGATORIE consente la circolazione con pneumatici invernali.",
    "questionBn": "চেইনের বাধ্যতামূলক সাইন থাকলে উইন্টার টায়ার (Pneumatici invernali) লাগানো গাড়িও চলতে পারে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! অনুমোদিত শীতকালীন টায়ার (M+S চিহ্নিত) থাকলে চেইনের বিকল্প হিসেবে বৈধভাবে গাড়ি চালানো যায়।",
    "trapTipBn": "Pneumatici invernali থাকলে চেইন না বাঁধলেও চলে (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Catene da neve",
        "meaningBn": "বরফের চেইন"
      },
      {
        "wordIt": "Pneumatici invernali",
        "meaningBn": "শীতকালীন টায়ার"
      }
    ]
  },
  {
    "id": "hot-39",
    "chapterId": "velocita",
    "chapterTitleIt": "Limiti di Velocità Trabocchetto",
    "chapterTitleBn": "গতিসীমা ও দূরত্বের ফাঁদ",
    "questionIt": "Sulle autostrade, per i primi tre anni dal conseguimento della patente B, il limite massimo è di 100 km/h.",
    "questionBn": "লাইসেন্স পাওয়ার প্রথম তিন বছর হাইওয়েতে (Autostrada) সর্বোচ্চ গতিসীমা ১০০ কিমি/ঘণ্টা।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! নতুন চালকদের (Neopatentati) জন্য হাইওয়েতে গতিসীমা ১০০ কিমি/ঘণ্টা (সাধারণ চালকদের ১৩০ কিমি) এবং প্রধান অতিরিক্ত নগর সড়কে (Extraurbana principale) ৯০ কিমি/ঘণ্টা।",
    "trapTipBn": "Neopatentati: Autostrada = 100 km/h; Extraurbana principale = 90 km/h!",
    "vocabulary": [
      {
        "wordIt": "Autostrade",
        "meaningBn": "হাইওয়ে"
      },
      {
        "wordIt": "Primi tre anni",
        "meaningBn": "প্রথম তিন বছর"
      },
      {
        "wordIt": "100 km/h",
        "meaningBn": "১০০ কিমি/ঘণ্টা"
      }
    ]
  },
  {
    "id": "hot-40",
    "chapterId": "velocita",
    "chapterTitleIt": "Limiti di Velocità Trabocchetto",
    "chapterTitleBn": "গতিসীমা ও দূরত্বের ফাঁদ",
    "questionIt": "Sulle strade extraurbane secondarie il limite massimo di velocità è di 110 km/h.",
    "questionBn": "সেকেন্ডারি গ্রামীণ সড়কে (Extraurbana secondaria) সর্বোচ্চ গতিসীমা ১১০ কিমি/ঘণ্টা।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! সেকেন্ডারি অতিরিক্ত নগর সড়কে সর্বোচ্চ গতিসীমা ৯০ কিমি/ঘণ্টা। ১১০ কিমি/ঘণ্টা হলো প্রধান অতিরিক্ত নগর সড়কের (Extraurbana principale) সীমা।",
    "trapTipBn": "Extraurbana secondaria = 90 km/h; Extraurbana principale = 110 km/h!",
    "vocabulary": [
      {
        "wordIt": "Strade extraurbane secondarie",
        "meaningBn": "দ্বিতীয় শ্রেণির গ্রামীণ সড়ক"
      }
    ]
  },
  {
    "id": "hot-41",
    "chapterId": "velocita",
    "chapterTitleIt": "Limiti di Velocità Trabocchetto",
    "chapterTitleBn": "গতিসীমা ও দূরত্বের ফাঁদ",
    "questionIt": "La distanza di sicurezza deve essere di almeno 100 metri a qualunque velocità.",
    "questionBn": "যেকোনো গতিতেই নিরাপদ দূরত্ব অন্তত ১০০ মিটার হতে হবে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! নিরাপদ দূরত্ব গতির ওপর নির্ভর করে পরিবর্তিত হয়। কম গতিতে ১০০ মিটার রাখার কোনো নিয়ম নেই।",
    "trapTipBn": "ফাঁদ শব্দ: \"A qualunque velocità\" (যেকোনো গতিতে)। নিরাপদ দূরত্ব সবসময় গতির সাথে বাড়ে।",
    "vocabulary": [
      {
        "wordIt": "Distanza di sicurezza",
        "meaningBn": "নিরাপদ দূরত্ব"
      },
      {
        "wordIt": "A qualunque velocità",
        "meaningBn": "যেকোনো গতিতে (ফাঁদ)"
      }
    ]
  },
  {
    "id": "hot-42",
    "chapterId": "velocita",
    "chapterTitleIt": "Limiti di Velocità Trabocchetto",
    "chapterTitleBn": "গতিসীমা ও দূরত্বের ফাঁদ",
    "questionIt": "La distanza di sicurezza deve essere almeno uguale allo spazio percorso durante il tempo di reazione.",
    "questionBn": "নিরাপদ দূরত্ব কমপক্ষে রিঅ্যাকশন টাইমে অতিক্রান্ত দূরত্বের সমান হওয়া বাধ্যতামূলক।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! ন্যূনতম নিরাপদ দূরত্ব হলো চালকের বিপদ দেখে ব্রেক চাপতে যে সময় লাগে (Tempo di reazione, প্রায় ১ সেকেন্ড), সেই ১ সেকেন্ডে গাড়ি যত পথ চলে।",
    "trapTipBn": "ন্যূনতম নিরাপদ দূরত্ব = Spazio percorso nel tempo di reazione (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Tempo di reazione",
        "meaningBn": "প্রতিক্রিয়া সময় (প্রায় ১ সেকেন্ড)"
      },
      {
        "wordIt": "Almeno uguale",
        "meaningBn": "কমপক্ষে সমান"
      }
    ]
  },
  {
    "id": "hot-43",
    "chapterId": "velocita",
    "chapterTitleIt": "Limiti di Velocità Trabocchetto",
    "chapterTitleBn": "গতিসীমা ও দূরত্বের ফাঁদ",
    "questionIt": "Se la velocità raddoppia, lo spazio di frenatura raddoppia anch'esso.",
    "questionBn": "যদি গতি দ্বিগুণ হয়, তবে ব্রেকিং দূরত্বও দ্বিগুণ হবে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! ব্রেকিং দূরত্ব গতির বর্গের সমানুপাতিক (Quadrato della velocità)। গতি দ্বিগুণ হলে ব্রেকিং দূরত্ব ৪ গুণ (Quadruplica) বৃদ্ধি পায়, দ্বিগুণ নয়!",
    "trapTipBn": "গতি দ্বিগুণ হলে ব্রেকিং দূরত্ব ৪ গুণ হয় (Quadruplica, non raddoppia)!",
    "vocabulary": [
      {
        "wordIt": "Raddoppia",
        "meaningBn": "দ্বিগুণ হয়"
      },
      {
        "wordIt": "Spazio di frenatura",
        "meaningBn": "ব্রেকিং দূরত্ব"
      }
    ]
  },
  {
    "id": "hot-44",
    "chapterId": "velocita",
    "chapterTitleIt": "Limiti di Velocità Trabocchetto",
    "chapterTitleBn": "গতিসীমা ও দূরত্বের ফাঁদ",
    "questionIt": "Il tempo di reazione di un conducente medio è di circa 1 secondo.",
    "questionBn": "একজন সাধারণ চালকের প্রতিক্রিয়া সময় (Tempo di reazione) প্রায় ১ সেকেন্ড।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! স্বাভাবিক ও সুস্থ চালকের গড় রিঅ্যাকশন টাইম হলো ১ সেকেন্ড। ক্লান্তি বা মদ্যপানে এটি বৃদ্ধি পায়।",
    "trapTipBn": "Tempo di reazione约为 1 secondo (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Circa 1 secondo",
        "meaningBn": "প্রায় ১ সেকেন্ড"
      }
    ]
  },
  {
    "id": "hot-45",
    "chapterId": "velocita",
    "chapterTitleIt": "Limiti di Velocità Trabocchetto",
    "chapterTitleBn": "গতিসীমা ও দূরত্বের ফাঁদ",
    "questionIt": "La stanchezza o l'uso di farmaci sedativi riduce il tempo di reazione.",
    "questionBn": "ক্লান্তি বা ঘুমের ওষুধ সেবনের ফলে চালকের প্রতিক্রিয়া সময় (Tempo di reazione) কমে যায়।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! ক্লান্তি বা ওষুধে প্রতিক্রিয়া সময় বৃদ্ধি পায় (Aumenta), কমে না (Non riduce)! সময় বাড়ার অর্থ হলো দেরিতে ব্রেক করা, যা মারাত্মক বিপজ্জনক।",
    "trapTipBn": "ক্লান্তিতে tempo di reazione AUMENTA (সময় বাড়ে), কখনোই riduce নয়!",
    "vocabulary": [
      {
        "wordIt": "Stanchezza",
        "meaningBn": "ক্লান্তি"
      },
      {
        "wordIt": "Riduce",
        "meaningBn": "কমায় (ফাঁদ শব্দ)"
      }
    ]
  },
  {
    "id": "hot-46",
    "chapterId": "velocita",
    "chapterTitleIt": "Limiti di Velocità Trabocchetto",
    "chapterTitleBn": "গতিসীমা ও দূরত্বের ফাঁদ",
    "questionIt": "In caso di pioggia battente, il limite massimo in autostrada scende a 110 km/h.",
    "questionBn": "তীব্র বৃষ্টির সময় হাইওয়েতে সর্বোচ্চ গতিসীমা নেমে ১১০ কিমি/ঘণ্টা হয়।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! হাইওয়েতে সাধারণ গতিসীমা ১৩০ কিমি/ঘণ্টা হলেও বৃষ্টি বা ঝড়ের সময় তা স্বয়ংক্রিয়ভাবে ১১০ কিমি/ঘণ্টায় নেমে আসে।",
    "trapTipBn": "বৃষ্টি হলে: Autostrada = 110 km/h; Extraurbana principale = 90 km/h (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Pioggia battente",
        "meaningBn": "ভারী বৃষ্টি"
      },
      {
        "wordIt": "Scende a 110 km/h",
        "meaningBn": "১১০ কিমিতে নেমে আসে"
      }
    ]
  },
  {
    "id": "hot-47",
    "chapterId": "sorpasso",
    "chapterTitleIt": "Regole sul Sorpasso Trabocchetto",
    "chapterTitleBn": "ওভারটেকিংয়ের নিয়ম ও ফাঁদ",
    "questionIt": "È consentito il sorpasso a destra quando il conducente che precede ha segnalato l'intenzione di svoltare a sinistra.",
    "questionBn": "সামনের গাড়ি বামে মোড় নেওয়ার সিগন্যাল দিলে তাকে ডান পাশ দিয়ে ওভারটেক করা বৈধ।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! সামনের গাড়ি বামে মোড় নেওয়ার জন্য ইন্ডিকেটর দিয়ে রাস্তার মাঝে থামলে, পর্যাপ্ত জায়গা থাকলে ডানপাশ দিয়ে ওভারটেক করা বৈধ।",
    "trapTipBn": "ডানে ওভারটেক বৈধ: ১) সামনের গাড়ি বামে গেলে, ২) ট্রাম লাইনে ক্যারেজিয়াটা থাকলে।",
    "vocabulary": [
      {
        "wordIt": "Sorpasso a destra",
        "meaningBn": "ডান পাশ দিয়ে ওভারটেক"
      },
      {
        "wordIt": "Svoltare a sinistra",
        "meaningBn": "বামে মোড় নেওয়া"
      }
    ]
  },
  {
    "id": "hot-48",
    "chapterId": "sorpasso",
    "chapterTitleIt": "Regole sul Sorpasso Trabocchetto",
    "chapterTitleBn": "ওভারটেকিংয়ের নিয়ম ও ফাঁদ",
    "questionIt": "Il sorpasso è vietato in tutti i passaggi a livello.",
    "questionBn": "সমস্ত রেল ক্রসিংয়ে ওভারটেক করা নিষিদ্ধ।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! যদি রেল ক্রসিংয়ে ব্যারিয়ার থাকে (Con barriere) এবং বিপরীতমুখী লেন অতিক্রম না করে নিজের লেনের ভেতর ওভারটেক করা যায়, তবে তা বৈধ!",
    "trapTipBn": "ব্যারিয়ারযুক্ত ক্রসিংয়ে লেনের দাগ না ডিঙিয়ে ওভারটেক বৈধ (FALSO to \"tutti\")!",
    "vocabulary": [
      {
        "wordIt": "In tutti i passaggi a livello",
        "meaningBn": "সমস্ত রেল ক্রসিংয়ে (ফাঁদ)"
      }
    ]
  },
  {
    "id": "hot-49",
    "chapterId": "sorpasso",
    "chapterTitleIt": "Regole sul Sorpasso Trabocchetto",
    "chapterTitleBn": "ওভারটেকিংয়ের নিয়ম ও ফাঁদ",
    "questionIt": "È vietato il sorpasso di veicoli fermi ai passaggi pedonali per consentire l'attraversamento dei pedoni.",
    "questionBn": "পথচারী পারাপারের জন্য জেব্রা ক্রসিংয়ে দাঁড়িয়ে থাকা গাড়িকে ওভারটেক করা নিষিদ্ধ।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! পথচারীদের রাস্তা দিতে দাঁড়ানো গাড়িকে ওভারটেক করলে পথচারীকে ধাক্কা দেওয়ার প্রবল ঝুঁকি থাকে, তাই এটি সম্পূর্ণ নিষিদ্ধ।",
    "trapTipBn": "জেব্রা ক্রসিংয়ে দাঁড়ানো গাড়িকে ওভারটেক করা কঠোরভাবে নিষিদ্ধ (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Passaggi pedonali",
        "meaningBn": "পথচারী পারাপার (জেব্রা ক্রসিং)"
      }
    ]
  },
  {
    "id": "hot-50",
    "chapterId": "sorpasso",
    "chapterTitleIt": "Regole sul Sorpasso Trabocchetto",
    "chapterTitleBn": "ওভারটেকিংয়ের নিয়ম ও ফাঁদ",
    "questionIt": "Il sorpasso è consentito sui dossi delle strade a senso unico.",
    "questionBn": "একমুখী রাস্তায় (Senso unico) অন্ধ ঢিবির (Dosso) ওপরেও ওভারটেক করা অনুমোদিত।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! একমুখী রাস্তায় বিপরীত দিক থেকে কোনো গাড়ি আসার সুযোগ নেই, তাই দসসো হলেও ওভারটেক করা বৈধ।",
    "trapTipBn": "Senso unico-তে দসসোর উপরেও ওভারটেক করা যায় (VERO)!",
    "vocabulary": [
      {
        "wordIt": "Senso unico",
        "meaningBn": "একমুখী সড়ক"
      }
    ]
  },
  {
    "id": "hot-51",
    "chapterId": "sorpasso",
    "chapterTitleIt": "Regole sul Sorpasso Trabocchetto",
    "chapterTitleBn": "ওভারটেকিংয়ের নিয়ম ও ফাঁদ",
    "questionIt": "Chi viene sorpassato deve accelerare per liberare la corsia.",
    "questionBn": "যাকে ওভারটেক করা হচ্ছে তাকে লেন খালি করার জন্য গতি বাড়াতে হবে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! যাকে ওভারটেক করা হচ্ছে তার গতি বাড়ানো নিষেধ (Non deve accelerare), বরং ডানে ঘেঁষে অপর গাড়িকে সহজে ওভারটেক করতে সাহায্য করতে হবে।",
    "trapTipBn": "ওভারটেক হওয়ার সময় গতি বাড়ানো সম্পূর্ণ অবৈধ ও বিপজ্জনক।",
    "vocabulary": [
      {
        "wordIt": "Chi viene sorpassato",
        "meaningBn": "যাকে ওভারটেক করা হচ্ছে"
      },
      {
        "wordIt": "Accelerare",
        "meaningBn": "গতি বাড়ানো (ভুল পদক্ষেপ)"
      }
    ]
  },
  {
    "id": "hot-52",
    "chapterId": "sorpasso",
    "chapterTitleIt": "Regole sul Sorpasso Trabocchetto",
    "chapterTitleBn": "ওভারটেকিংয়ের নিয়ম ও ফাঁদ",
    "questionIt": "Prima di iniziare il sorpasso, il conducente deve accertarsi che nessun veicolo che segue abbia già iniziato il sorpasso.",
    "questionBn": "ওভারটেক শুরু করার আগে দেখতে হবে পেছনের কোনো গাড়ি ইতোমধ্যে ওভারটেক শুরু করেছে কি না।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! পেছনের গাড়ি যদি আগে থেকেই ওভারটেক করা শুরু করে দেয়, তবে আপনি লেন পরিবর্তন করতে পারবেন না।",
    "trapTipBn": "পেছনে খেয়াল করা বাধ্যতামূলক (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Nessun veicolo che segue",
        "meaningBn": "পেছনের কোনো গাড়ি"
      }
    ]
  },
  {
    "id": "hot-53",
    "chapterId": "sosta",
    "chapterTitleIt": "Sosta e Fermata Trabocchetto",
    "chapterTitleBn": "থামা ও পার্কিংয়ের কঠিন ফাঁদ",
    "questionIt": "Durante la fermata il conducente può allontanarsi dal veicolo per brevissimo tempo.",
    "questionBn": "সাময়িক থামার (Fermata) সময় চালক খুব অল্প সময়ের জন্য গাড়ি ছেড়ে দূরে যেতে পারেন।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! ফেরমাতার প্রধান নিয়ম হলো চালককে সবসময় স্টিয়ারিং বা গাড়িতে প্রস্তুত থাকতে হবে (Pronto a riprendere la marcia)। গাড়ি ছেড়ে চলে গেলে তা সোস্তা (Sosta / পার্কিং) হয়ে যায়।",
    "trapTipBn": "Fermata-তে চালক গাড়ি ছেড়ে দূরে যেতে পারে না (Mai allontanarsi)!",
    "vocabulary": [
      {
        "wordIt": "Fermata",
        "meaningBn": "যাত্রী ওঠানামায় সাময়িক থামা"
      },
      {
        "wordIt": "Allontanarsi",
        "meaningBn": "গাড়ি ছেড়ে দূরে যাওয়া (ফাঁদ)"
      }
    ]
  },
  {
    "id": "hot-54",
    "chapterId": "sosta",
    "chapterTitleIt": "Sosta e Fermata Trabocchetto",
    "chapterTitleBn": "থামা ও পার্কিংয়ের কঠিন ফাঁদ",
    "questionIt": "La fermata è vietata in corrispondenza dei passaggi a livello.",
    "questionBn": "রেল ক্রসিংয়ের ওপর গাড়ি সাময়িক থামানো (Fermata) নিষিদ্ধ।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! রেললাইনে কোনো অবস্থাতেই গাড়ি থামানো (Sosta বা Fermata) যাবে না।",
    "trapTipBn": "রেললাইনে Sosta ও Fermata দুটোই নিষিদ্ধ (VERO)।",
    "vocabulary": [
      {
        "wordIt": "In corrispondenza",
        "meaningBn": "সরাসরি স্থানে"
      }
    ]
  },
  {
    "id": "hot-55",
    "chapterId": "sosta",
    "chapterTitleIt": "Sosta e Fermata Trabocchetto",
    "chapterTitleBn": "থামা ও পার্কিংয়ের কঠিন ফাঁদ",
    "questionIt": "La sosta è vietata a meno di 15 metri dai cartelli di fermata degli autobus, se non delimitata da strisce.",
    "questionBn": "বাস স্টপ চিহ্নের দাগ না থাকলে তার থেকে ১৫ মিটারের মধ্যে পার্কিং করা নিষিদ্ধ।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! বাস স্টপের হলুদ দাগ না থাকলে সাইনবোর্ডের আগে ও পরে ১৫ মিটার পর্যন্ত পার্কিং সম্পূর্ণ নিষিদ্ধ।",
    "trapTipBn": "Fermata autobus = ১৫ মিটার দূরত্ব মনে রাখবেন (VERO)।",
    "vocabulary": [
      {
        "wordIt": "A meno di 15 metri",
        "meaningBn": "১৫ মিটারের চেয়ে কমে"
      }
    ]
  },
  {
    "id": "hot-56",
    "chapterId": "sosta",
    "chapterTitleIt": "Sosta e Fermata Trabocchetto",
    "chapterTitleBn": "থামা ও পার্কিংয়ের কঠিন ফাঁদ",
    "questionIt": "In autostrada, la sosta d'emergenza non può durare più di 3 ore.",
    "questionBn": "হাইওয়েতে জরুরি পার্কিংয়ের (Sosta d'emergenza) সময়কাল সর্বোচ্চ ৩ ঘণ্টা হতে পারে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! হাইওয়ের করসিয়া দি এমার্জেনসায় বা পার্কিং বে-তে জরুরি গাড়ি বিকল হলে সর্বোচ্চ ৩ ঘণ্টার মধ্যে গাড়ি অপসারণ করতে হবে।",
    "trapTipBn": "Autostrada sosta emergenza = সর্বোচ্চ ৩ ঘণ্টা (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Non più di 3 ore",
        "meaningBn": "৩ ঘণ্টার বেশি নয়"
      }
    ]
  },
  {
    "id": "hot-57",
    "chapterId": "sosta",
    "chapterTitleIt": "Sosta e Fermata Trabocchetto",
    "chapterTitleBn": "থামা ও পার্কিংয়ের কঠিন ফাঁদ",
    "questionIt": "L'arresto del veicolo è la sospensione della marcia dovuta a motivi di traffico.",
    "questionBn": "আরেস্তো (Arresto) হলো ট্রাফিক জ্যাম বা সিগন্যালের কারণে গাড়ির গতি সাময়িক থেমে যাওয়া।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! ট্রাফিক লাইট লাল থাকা, ট্রাফিক পুলিশ হাত দেখানো বা জ্যামে গাড়ি আটকে থাকাকে ট্রাফিক পরিভাষায় Arresto বলা হয়।",
    "trapTipBn": "Arresto = ট্রাফিকের প্রয়োজনে গাড়ি থামা (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Arresto",
        "meaningBn": "ট্রাফিকের প্রয়োজনে অনিচ্ছাকৃত থামা"
      },
      {
        "wordIt": "Sospensione della marcia",
        "meaningBn": "চলাচল বন্ধ থাকা"
      }
    ]
  },
  {
    "id": "hot-58",
    "chapterId": "sosta",
    "chapterTitleIt": "Sosta e Fermata Trabocchetto",
    "chapterTitleBn": "থামা ও পার্কিংয়ের কঠিন ফাঁদ",
    "questionIt": "La sosta è vietata davanti ai cassonetti dei rifiuti solidi urbani.",
    "questionBn": "রাস্তার আবর্জনার বিনের (ডাস্টবিন) সামনে গাড়ি পার্কিং করা নিষিদ্ধ।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! ডাস্টবিনের সামনে গাড়ি পার্ক করলে পরিচ্ছন্নতাকর্মীদের ট্রাশ ডাম্পিং ট্রাকে সমস্যা হয়, তাই এখানে পার্কিং অবৈধ।",
    "trapTipBn": "Cassonetti dei rifiuti-র সামনে পার্কিং নিষিদ্ধ (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Cassonetti dei rifiuti",
        "meaningBn": "ময়লা ফেলার ডাস্টবিন"
      }
    ]
  },
  {
    "id": "hot-59",
    "chapterId": "alcol",
    "chapterTitleIt": "Alcol e Droghe Trabocchetto",
    "chapterTitleBn": "অ্যালকোহল ও পয়েন্টের ফাঁদ",
    "questionIt": "Per i conducenti di età inferiore a 21 anni e per i neopatentati nei primi tre anni il tasso alcolemico deve essere zero.",
    "questionBn": "২১ বছরের কম বয়সী চালক এবং প্রথম ৩ বছরের নতুন চালকদের জন্য রক্তের অ্যালকোহল লেভেল শূন্য (Zero) হতে হবে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! নতুন চালক এবং ২১ বছরের কম বয়সীদের জন্য \"Tolleranza Zero\" নিয়ম প্রযোজ্য, অর্থাৎ সামান্য পরিমাণ (0,0 g/l) মদ পান করেও গাড়ি চালানো সম্পূর্ণ বেআইনি।",
    "trapTipBn": "Neopatentati ও ২১ বছরের কম বয়সীদের জন্য Tasso alcolemico = ZERO (0,0 g/l)!",
    "vocabulary": [
      {
        "wordIt": "Età inferiore a 21 anni",
        "meaningBn": "২১ বছরের নিচে বয়স"
      },
      {
        "wordIt": "Tasso alcolemico zero",
        "meaningBn": "অ্যালকোহলের মাত্রা শূন্য"
      }
    ]
  },
  {
    "id": "hot-60",
    "chapterId": "alcol",
    "chapterTitleIt": "Alcol e Droghe Trabocchetto",
    "chapterTitleBn": "অ্যালকোহল ও পয়েন্টের ফাঁদ",
    "questionIt": "Bere caffè dopo aver assunto alcolici elimina gli effetti dell'alcol e consente di guidare.",
    "questionBn": "অ্যালকোহল পানের পর কফি পান করলে মদের প্রভাব দূর হয়ে যায় এবং গাড়ি চালানো সম্ভব হয়।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! কফি সাময়িকভাবে কিছুটা ঘুম কাটাতে পারলেও রক্তে অ্যালকোহলের ঘনত্ব কমায় না এবং রিফ্লেক্স ফিরিয়ে আনে না। এটি সম্পূর্ণ ভ্রান্ত ধারণা।",
    "trapTipBn": "কফি বা ঠান্ডা গোসল মদের প্রভাব দূর করে না (FALSO)।",
    "vocabulary": [
      {
        "wordIt": "Elimina gli effetti",
        "meaningBn": "প্রভাব দূর করে (ভুল)"
      }
    ]
  },
  {
    "id": "hot-61",
    "chapterId": "alcol",
    "chapterTitleIt": "Alcol e Droghe Trabocchetto",
    "chapterTitleBn": "অ্যালকোহল ও পয়েন্টের ফাঁদ",
    "questionIt": "Per i primi tre anni dal rilascio della patente, i punti persi per infrazioni sono raddoppiati.",
    "questionBn": "লাইসেন্স পাওয়ার প্রথম তিন বছর কোনো ট্রাফিক আইন অমান্য করলে দ্বিগুণ পয়েন্ট (Punti raddoppiati) কাটা যায়।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! নতুন চালকদের (Neopatentati) জন্য প্রথম ৩ বছর যেকোনো পয়েন্ট কাটার শাস্তিতে দ্বিগুণ পয়েন্ট কাটা হয়।",
    "trapTipBn": "Neopatentati-দের পয়েন্ট ডিডাকশন দ্বিগুণ (Raddoppiati) হয় প্রথম ৩ বছর (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Infrazioni",
        "meaningBn": "আইন অমান্য"
      },
      {
        "wordIt": "Raddoppiati",
        "meaningBn": "দ্বিগুণ"
      }
    ]
  },
  {
    "id": "hot-62",
    "chapterId": "alcol",
    "chapterTitleIt": "Alcol e Droghe Trabocchetto",
    "chapterTitleBn": "অ্যালকোহল ও পয়েন্টের ফাঁদ",
    "questionIt": "Chi guida sotto l'effetto di sostanze stupefacenti è punito solo con una sanzione amministrativa pecuniaria.",
    "questionBn": "মাদকদ্রব্য সেবন করে গাড়ি চালালে শাস্তি হিসেবে শুধুমাত্র আর্থিক জরিমানা (Pecuniaria) করা হয়।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! মাদক বা ড্রাগ সেবন করে গাড়ি চালানো একটি ফৌজদারি অপরাধ (Reato penale)। এর জন্য জরিমানা ছাড়াও জেল, লাইসেন্স বাতিল এবং গাড়ি বাজেয়াপ্ত হতে পারে।",
    "trapTipBn": "ফাঁদ শব্দ: \"Solo con sanzione pecuniaria\"। এটি ফৌজদারি অপরাধ!",
    "vocabulary": [
      {
        "wordIt": "Sostanze stupefacenti",
        "meaningBn": "মাদকদ্রব্য / ড্রাগস"
      },
      {
        "wordIt": "Solo con sanzione pecuniaria",
        "meaningBn": "শুধুমাত্র টাকার জরিমানা (ফাঁদ)"
      }
    ]
  },
  {
    "id": "hot-63",
    "chapterId": "alcol",
    "chapterTitleIt": "Alcol e Droghe Trabocchetto",
    "chapterTitleBn": "অ্যালকোহল ও পয়েন্টের ফাঁদ",
    "questionIt": "Il conducente che esaurisce tutti i punti della patente deve sottoporsi a revisione della patente.",
    "questionBn": "যে চালকের লাইসেন্সের সমস্ত পয়েন্ট কেটে শূন্য হয়ে যায়, তাকে পুনরায় লাইসেন্স রিভিশন (পরীক্ষা) দিতে হবে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! মোট ২০টি পয়েন্ট শেষ হয়ে গেলে চালককে ৩০ দিনের মধ্যে থিওরি ও প্র্যাকটিক্যাল পরীক্ষা (Revisione) দিয়ে যোগ্যতা প্রমাণ করতে হয়।",
    "trapTipBn": "পয়েন্ট শূন্য হলে Revisione di patente দিতে হয় (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Esaurisce tutti i punti",
        "meaningBn": "সকল পয়েন্ট শেষ হয়ে যাওয়া"
      },
      {
        "wordIt": "Revisione della patente",
        "meaningBn": "লাইসেন্স পুনর্মূল্যায়ন পরীক্ষা"
      }
    ]
  },
  {
    "id": "hot-64",
    "chapterId": "sicurezza",
    "chapterTitleIt": "Dispositivi e Sicurezza Trabocchetto",
    "chapterTitleBn": "নিরাপত্তা ডিভাইসের ফাঁদ",
    "questionIt": "Il triangolo mobile di pericolo deve essere posto ad almeno 50 metri dal veicolo fermo sulle strade extraurbane.",
    "questionBn": "গ্রামীণ রাস্তায় নষ্ট গাড়ির পেছনে লাল ট্রায়াঙ্গল সংকেতটি অন্তত ৫০ মিটার দূরে রাখতে হবে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! শহরের বাইরে এক্সট্রাউরবানা রাস্তায় ট্রায়াঙ্গলটি গাড়ি থেকে কমপক্ষে ৫০ মিটার পেছনে এবং পেছনে আসা গাড়ির চালকদের অন্তত ১০০ মিটার দূর থেকে দৃশ্যমান হতে হবে।",
    "trapTipBn": "গাড়ি থেকে দূরত্ব = কমপক্ষে ৫০ মিটার; দূর থেকে দৃশ্যমান = ১০০ মিটার!",
    "vocabulary": [
      {
        "wordIt": "Triangolo mobile di pericolo",
        "meaningBn": "পোর্টেবল লাল বিপদ ত্রিভুজ"
      },
      {
        "wordIt": "Almeno 50 metri",
        "meaningBn": "কমপক্ষে ৫০ মিটার"
      }
    ]
  },
  {
    "id": "hot-65",
    "chapterId": "sicurezza",
    "chapterTitleIt": "Dispositivi e Sicurezza Trabocchetto",
    "chapterTitleBn": "নিরাপত্তা ডিভাইসের ফাঁদ",
    "questionIt": "Il triangolo mobile di pericolo deve essere usato solo di notte.",
    "questionBn": "বিপদকালীন ট্রায়াঙ্গল সংকেতটি শুধুমাত্র রাতের বেলা ব্যবহার করতে হবে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! দিনের বেলাতেও যদি গাড়ি এমন জায়গায় নষ্ট হয়ে দাঁড়ায় যেখানে ১০০ মিটার দূর থেকে দেখা যায় না, তবে ট্রায়াঙ্গল রাখা বাধ্যতামূলক।",
    "trapTipBn": "ফাঁদ শব্দ: \"Solo di notte\"। দিনেও দৃশ্যমানতা কম থাকলে ট্রায়াঙ্গল আবশ্যক।",
    "vocabulary": [
      {
        "wordIt": "Solo di notte",
        "meaningBn": "শুধুমাত্র রাতে (ফাঁদ শব্দ)"
      }
    ]
  },
  {
    "id": "hot-66",
    "chapterId": "sicurezza",
    "chapterTitleIt": "Dispositivi e Sicurezza Trabocchetto",
    "chapterTitleBn": "নিরাপত্তা ডিভাইসের ফাঁদ",
    "questionIt": "Il giubbotto retroriflettente ad alta visibilità deve essere indossato prima di scendere dal veicolo fermo sulla carreggiata di notte.",
    "questionBn": "রাতে ক্যারেজিয়াটায় নষ্ট গাড়ি থেকে নামার আগেই হাই-ভিজিবিলিটি রিফ্লেক্টিভ জ্যাকেট পরিধান করতে হবে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! রাস্তায় নামার পরেই জ্যাকেট পরা নয়, গাড়ি থেকে বের হওয়ার আগেই গাড়ির ভেতরে থাকতেই এটি গায়ে পরা বাধ্যতামূলক।",
    "trapTipBn": "জ্যাকেট গাড়ি থেকে নামার আগেই পরতে হয় (Prima di scendere)!",
    "vocabulary": [
      {
        "wordIt": "Giubbotto retroriflettente",
        "meaningBn": "হাই-ভিজিবিলিটি রিফ্লেক্টিভ জ্যাকেট"
      },
      {
        "wordIt": "Prima di scendere",
        "meaningBn": "নামার আগেই"
      }
    ]
  },
  {
    "id": "hot-67",
    "chapterId": "sicurezza",
    "chapterTitleIt": "Dispositivi e Sicurezza Trabocchetto",
    "chapterTitleBn": "নিরাপত্তা ডিভাইসের ফাঁদ",
    "questionIt": "L'uso delle cinture di sicurezza non è obbligatorio per chi viaggia sui sedili posteriori.",
    "questionBn": "গাড়ির পেছনের সিটে বসা যাত্রীদের জন্য সিটবেল্ট পরা বাধ্যতামূলক নয়।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! গাড়ির সামনের ও পেছনের সকল সিটে সিটবেল্ট থাকলে প্রত্যেকের জন্যই সিটবেল্ট বাঁধা আইনত বাধ্যতামূলক।",
    "trapTipBn": "Sedili posteriori-তেও সিটবেল্ট শতভাগ বাধ্যতামূলক!",
    "vocabulary": [
      {
        "wordIt": "Sedili posteriori",
        "meaningBn": "পেছনের সিট"
      },
      {
        "wordIt": "Non è obbligatorio",
        "meaningBn": "বাধ্যতামূলক নয় (ভুল)"
      }
    ]
  },
  {
    "id": "hot-68",
    "chapterId": "sicurezza",
    "chapterTitleIt": "Dispositivi e Sicurezza Trabocchetto",
    "chapterTitleBn": "নিরাপত্তা ডিভাইসের ফাঁদ",
    "questionIt": "Le donne in stato di gravidanza sono sempre esentate dall'obbligo di indossare la cintura di sicurezza.",
    "questionBn": "গর্ভবতী নারীরা সবসময় সিটবেল্ট পরার বাধ্যবাধকতা থেকে মুক্ত থাকেন।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! গর্ভবতী নারীরা শুধুমাত্র তখনই সিটবেল্ট ছাড়া চলতে পারবেন যদি স্ত্রীরোগ বিশেষজ্ঞ ডাক্তারের (Certificato ginecologico) লিখিত ছাড়পত্র সঙ্গে থাকে।",
    "trapTipBn": "ফাঁদ শব্দ: \"Sempre esentate\"। মেডিকেল সার্টিফিকেট ছাড়া গর্ভবতী নারীদেরও বেল্ট পরা বাধ্যতামূলক।",
    "vocabulary": [
      {
        "wordIt": "Donne in stato di gravidanza",
        "meaningBn": "গর্ভবতী নারী"
      },
      {
        "wordIt": "Sempre esentate",
        "meaningBn": "সবসময় ছাড়প্রাপ্ত (ফাঁদ)"
      }
    ]
  },
  {
    "id": "hot-69",
    "chapterId": "sicurezza",
    "chapterTitleIt": "Dispositivi e Sicurezza Trabocchetto",
    "chapterTitleBn": "নিরাপত্তা ডিভাইসের ফাঁদ",
    "questionIt": "Di notte, incrociando un altro veicolo, è obbligatorio passare dagli abbaglianti agli anabbaglianti.",
    "questionBn": "রাতে বিপরীত দিক থেকে কোনো গাড়ি এলে হাই বিম (Abbaglianti) বন্ধ করে লো বিম (Anabbaglianti) জ্বালাতে হবে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! বিপরীতমুখী চালকের চোখে যাতে তীব্র আলোর ঝলক না লাগে, তাই দেখা মাত্রই লো বিম বাতি জ্বালাতে হবে।",
    "trapTipBn": "গাড়ি সামনাসামনি এলে Abbaglianti থেকে Anabbaglianti-তে যেতে হবে (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Abbaglianti",
        "meaningBn": "হাই বিম বাতি (দূরপাল্লার)"
      },
      {
        "wordIt": "Anabbaglianti",
        "meaningBn": "লো বিম বাতি"
      }
    ]
  },
  {
    "id": "hot-70",
    "chapterId": "sicurezza",
    "chapterTitleIt": "Dispositivi e Sicurezza Trabocchetto",
    "chapterTitleBn": "নিরাপত্তা ডিভাইসের ফাঁদ",
    "questionIt": "I proiettori anabbaglianti devono essere tenuti accesi anche di giorno su autostrade e strade extraurbane.",
    "questionBn": "হাইওয়ে এবং অতিরিক্ত নগর সড়কে দিনের বেলাতেও লো বিম হেডলাইট জ্বালিয়ে রাখা বাধ্যতামূলক।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! ইতালির আইন অনুযায়ী শহরের বাইরে হাইওয়ে ও গ্রামীণ সড়কে দিনেও গাড়ির সামনের বাতি জ্বালানো বাধ্যতামূলক।",
    "trapTipBn": "দিনের বেলাতেও শহরের বাইরে আলো জ্বালানো বাধ্যতামূলক (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Anche di giorno",
        "meaningBn": "দিনের বেলাতেও"
      }
    ]
  },
  {
    "id": "hot-71",
    "chapterId": "sicurezza",
    "chapterTitleIt": "Dispositivi e Sicurezza Trabocchetto",
    "chapterTitleBn": "নিরাপত্তা ডিভাইসের ফাঁদ",
    "questionIt": "Il casco protettivo deve essere allacciato correttamente prima di partire.",
    "questionBn": "মোটরসাইকেল স্টার্ট করার আগেই সুরক্ষা হেলমেট সঠিকভাবে বেল্ট দিয়ে বাঁধতে হবে।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! হেলমেট মাথায় দিয়ে বেল্ট না বাঁধলে দুর্ঘটনার সময় তা খুলে পড়ে মারাত্মক আঘাত হতে পারে।",
    "trapTipBn": "হেলমেট টাইটভাবে বাঁধা বাধ্যতামূলক (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Casco protettivo",
        "meaningBn": "সুরক্ষা হেলমেট"
      },
      {
        "wordIt": "Allacciato correttamente",
        "meaningBn": "সঠিকভাবে বাঁধা"
      }
    ]
  },
  {
    "id": "hot-72",
    "chapterId": "sicurezza",
    "chapterTitleIt": "Dispositivi e Sicurezza Trabocchetto",
    "chapterTitleBn": "নিরাপত্তা ডিভাইসের ফাঁদ",
    "questionIt": "La pressione dei pneumatici deve essere controllata solo quando sono caldi.",
    "questionBn": "টায়ারের প্রেশার শুধুমাত্র টায়ার গরম থাকা অবস্থায় পরীক্ষা করতে হবে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! টায়ারের প্রেশার সবসময় টায়ার ঠান্ডা থাকা অবস্থায় (Pneumatici freddi) পরিমাপ করতে হয়। গরম অবস্থায় ভেতরের বাতাস প্রসারিত থাকে বিধায় ভুল রিডিং দেখায়।",
    "trapTipBn": "Pressione pneumatici পরীক্ষা করতে হয় ঠান্ডা অবস্থায় (A freddo)!",
    "vocabulary": [
      {
        "wordIt": "Pressione dei pneumatici",
        "meaningBn": "টায়ারের বাতাসের চাপ"
      },
      {
        "wordIt": "Solo quando sono caldi",
        "meaningBn": "শুধুমাত্র গরম অবস্থায় (ভুল)"
      }
    ]
  },
  {
    "id": "hot-73",
    "chapterId": "soccorso",
    "chapterTitleIt": "Primo Soccorso Trabocchetto",
    "chapterTitleBn": "প্রাথমিক চিকিৎসার কঠিন ফাঁদ",
    "questionIt": "In caso di incidente con ferito in stato di shock, bisogna farlo bere un po' di alcol per farlo riprendere.",
    "questionBn": "দুর্ঘটনায় আহত ব্যক্তি শকে থাকলে তাকে সুস্থ করার জন্য সামান্য অ্যালকোহল বা মদ পান করাতে হবে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! আহত বা শকড ব্যক্তিকে কখনোই কোনো খাবার বা পানীয়, বিশেষ করে অ্যালকোহল দেওয়া যাবে না। এতে রক্তচাপ মারাত্মকভাবে নেমে গিয়ে মৃত্যু হতে পারে।",
    "trapTipBn": "আহত রোগীকে পানি বা অ্যালকোহল দেওয়া সম্পূর্ণ নিষিদ্ধ (Assolutamente vietato)!",
    "vocabulary": [
      {
        "wordIt": "Stato di shock",
        "meaningBn": "শক অবস্থা"
      },
      {
        "wordIt": "Farlo bere alcol",
        "meaningBn": "মদ পান করানো (মারাত্মক ভুল)"
      }
    ]
  },
  {
    "id": "hot-74",
    "chapterId": "soccorso",
    "chapterTitleIt": "Primo Soccorso Trabocchetto",
    "chapterTitleBn": "প্রাথমিক চিকিৎসার কঠিন ফাঁদ",
    "questionIt": "Al ferito della strada che ha una ferita che sanguina, si deve togliere il corpo estraneo conficcato nella ferita.",
    "questionBn": "সড়ক দুর্ঘটনায় আহত ব্যক্তির ক্ষতে যদি কোনো ধারালো বস্তু বা কাচ ঢুকে থাকে, তবে তা টেনে বের করে ফেলতে হবে।",
    "isCorrect": false,
    "explanationBn": "ভুল (FALSO)! ক্ষতে ঢুকে থাকা বস্তু (Corpo estraneo) কখনোই টেনে বের করবেন না, কারণ এতে অভ্যন্তরীণ রক্তক্ষরণ তীব্র হয়ে রোগী মারা যেতে পারে। শুধুমাত্র ব্যান্ডেজ দিয়ে চারপাশে আটকে চিকিৎসকের কাছে পাঠাতে হবে।",
    "trapTipBn": "ক্ষতে ঢুকে থাকা পেরেক বা কাচ কখনোই টেনে খুলবেন না (Non togliere)!",
    "vocabulary": [
      {
        "wordIt": "Corpo estraneo conficcato",
        "meaningBn": "ক্ষতে ঢুকে থাকা বাইরের ধারালো বস্তু"
      },
      {
        "wordIt": "Togliere",
        "meaningBn": "টেনে খুলে ফেলা (ভুল পদক্ষেপ)"
      }
    ]
  },
  {
    "id": "hot-75",
    "chapterId": "soccorso",
    "chapterTitleIt": "Primo Soccorso Trabocchetto",
    "chapterTitleBn": "প্রাথমিক চিকিৎসার কঠিন ফাঁদ",
    "questionIt": "Il numero unico europeo per le emergenze è il 112.",
    "questionBn": "ইউরোপের একক সর্বজনীন জরুরি সেবার হেল্পলাইন নম্বর হলো ১১২।",
    "isCorrect": true,
    "explanationBn": "সঠিক (VERO)! ১১২ (NUE 112) হলো ইতালি ও ইউরোপের কেন্দ্রীয় জরুরি সহায়তা নম্বর, যা পুলিশ, অ্যাম্বুলেন্স ও ফায়ার সার্ভিসের জন্য প্রযোজ্য।",
    "trapTipBn": "ইউরোপীয় জরুরি নম্বর = ১১২ (VERO)।",
    "vocabulary": [
      {
        "wordIt": "Numero unico europeo",
        "meaningBn": "ইউরোপীয় সার্বজনীন জরুরি নম্বর"
      },
      {
        "wordIt": "Emergenze",
        "meaningBn": "জরুরি পরিস্থিতি"
      }
    ]
  }
];
