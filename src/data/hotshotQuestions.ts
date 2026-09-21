import type { QuizQuestion } from './quizData';

export const HOTSHOT_QUESTIONS: QuizQuestion[] = [
  {
    id: 'hot-01',
    chapterId: 'strada',
    chapterTitleIt: 'Definizioni Stradali Trabocchetto',
    chapterTitleBn: 'রাস্তার সংজ্ঞা ও ফাঁদ প্রশ্ন',
    questionIt: 'La carreggiata è destinata alla sosta di emergenza dei veicoli.',
    questionBn: 'ক্যারেজিয়াটা (Carreggiata) মূলত যানবাহনের জরুরি পার্কিংয়ের (Sosta di emergenza) জন্য নির্ধারিত।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! ক্যারেজিয়াটা কেবল যানবাহন চলাচলের (Transito dei veicoli) জন্য নির্ধারিত। জরুরি পার্কিংয়ের জায়গা হলো করসিয়া দি এমার্জেনসা (Corsia di emergenza) বা বানকিনা (Banchina), ক্যারেজিয়াটা নয়।',
    trapTipBn: 'ফাঁদ: প্রশ্নে "Carreggiata è destinata alla sosta" থাকলে সবসময় সতর্ক হবেন। Carreggiata শুধুমাত্র চলাচলের জন্য!',
    vocabulary: [
      { wordIt: 'Carreggiata', meaningBn: 'চলাচলের মূল পিচঢালা সড়ক' },
      { wordIt: 'Destinata', meaningBn: 'উদ্দেশ্যে নির্ধারিত' },
      { wordIt: 'Sosta di emergenza', meaningBn: 'জরুরি পার্কিং' }
    ]
  },
  {
    id: 'hot-02',
    chapterId: 'strada',
    chapterTitleIt: 'Definizioni Stradali Trabocchetto',
    chapterTitleBn: 'রাস্তার সংজ্ঞা ও ফাঁদ প্রশ্ন',
    questionIt: 'I marciapiedi fanno parte della carreggiata.',
    questionBn: 'ফুটপাত (Marciapiede) হলো ক্যারেজিয়াটার (Carreggiata) অংশ।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! ফুটপাত রাস্তার (Strada) অংশ হতে পারে, কিন্তু ক্যারেজিয়াটার (Carreggiata) অংশ কখনোই নয়।',
    trapTipBn: 'ফাঁদ শব্দ: Strada বনাম Carreggiata। ফুটপাত Strada-র অংশ, কিন্তু Carreggiata-র অংশ নয়।',
    vocabulary: [
      { wordIt: 'Marciapiedi', meaningBn: 'ফুটপাত / পথচারীদের হাঁটার স্থান' },
      { wordIt: 'Fanno parte', meaningBn: 'অংশ হওয়া' }
    ]
  },
  {
    id: 'hot-03',
    chapterId: 'pericolo',
    chapterTitleIt: 'Segnali di Pericolo Trabocchetto',
    chapterTitleBn: 'বিপদ সংকেতের সূক্ষ্ম ফাঁদ',
    questionIt: 'Il segnale di pericolo viene posto, di norma, a 150 metri dal punto di inizio del pericolo.',
    questionBn: 'বিপদজনক সংকেত সাধারণত বিপদ শুরুর স্থান থেকে ১৫০ মিটার পূর্বে স্থাপন করা হয়।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! ইতালির ট্রাফিক কোড অনুযায়ী যেকোনো ত্রিভুজাকার বিপদ সংকেত নিয়মমাফিক (Di norma) ১৫০ মিটার আগে বসানো হয়।',
    trapTipBn: 'Di norma (সাধারণ নিয়ম) থাকলে এবং ১৫০ মিটার উল্লেখ থাকলে এটি VERO।',
    image: 1,
    vocabulary: [
      { wordIt: 'Viene posto', meaningBn: 'বসানো বা স্থাপন করা হয়' },
      { wordIt: 'Di norma', meaningBn: 'সাধারণ নিয়মে' }
    ]
  },
  {
    id: 'hot-04',
    chapterId: 'pericolo',
    chapterTitleIt: 'Segnali di Pericolo Trabocchetto',
    chapterTitleBn: 'বিপদ সংকেতের সূক্ষ্ম ফাঁদ',
    questionIt: 'In presenza del segnale di CUNETTA è consentito sempre il sorpasso.',
    questionBn: 'কুনেত্তা (Cunetta / নিচু রাস্তা) সংকেতের উপস্থিতিতে সবসময় ওভারটেক করা অনুমোদিত।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! এখানে "Sempre" শব্দটি আছে। কুনেত্তায় পর্যাপ্ত দৃশ্যমানতা না থাকলে বা বিপরীতমুখী দুই লেনের রাস্তায় ওভারটেক করা ঝুঁকিপূর্ণ ও নিষিদ্ধ হতে পারে।',
    trapTipBn: 'ফাঁদ শব্দ: "Sempre" (সবসময়)। ট্রাফিকে নিঃশর্ত "Sempre" থাকলে ৯৫% ক্ষেত্রে FALSO হয়।',
    image: 2,
    vocabulary: [
      { wordIt: 'Cunetta', meaningBn: 'নিচু খাদসদৃশ রাস্তা' },
      { wordIt: 'Sempre', meaningBn: 'সবসময় (ফাঁদ শব্দ)' }
    ]
  },
  {
    id: 'hot-05',
    chapterId: 'pericolo',
    chapterTitleIt: 'Segnali di Pericolo Trabocchetto',
    chapterTitleBn: 'বিপদ সংকেতের সূক্ষ্ম ফাঁদ',
    questionIt: 'Il segnale DOSSO preannuncia un tratto di strada con scarsa visibilità.',
    questionBn: 'দোস্‌সো (Dosso / উঁচু ঢালু রাস্তা) সাইনটি সামনের স্বল্প দৃশ্যমানতার (Scarsa visibilità) রাস্তার পূর্বাভাস দেয়।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! দোস্‌সো হলো উঁচু ঢিবি রাস্তা যেখানে ওঠার সময় ওপরের অংশ দেখা গেলেও বিপরীত পাশের ঢাল দেখা যায় না, ফলে দৃশ্যমানতা কমে যায়।',
    trapTipBn: 'Dosso এর প্রধান বৈশিষ্ট্য হলো Scarsa visibilità (স্বল্প দৃশ্যমানতা)। এটি দেখলেই VERO।',
    image: 3,
    vocabulary: [
      { wordIt: 'Preannuncia', meaningBn: 'পূর্বাভাস দেয়' },
      { wordIt: 'Scarsa visibilità', meaningBn: 'স্বল্প বা কম দৃশ্যমানতা' }
    ]
  },
  {
    id: 'hot-06',
    chapterId: 'precedenza',
    chapterTitleIt: 'Precedenze e Incroci Trabocchetto',
    chapterTitleBn: 'অগ্রাধিকারের ফাঁদ প্রশ্ন',
    questionIt: 'Agli incroci si ha sempre l\'obbligo di dare la precedenza a chi proviene da destra, salvo diversa segnalazione.',
    questionBn: 'রাস্তার মোড়ে যদি ভিন্ন কোনো ট্রাফিক সংকেত না থাকে, তবে সর্বদা ডানদিক থেকে আসা যানবাহনকে অগ্রাধিকার দিতে হবে।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! ইতালির ট্রাফিক আইনের মৌলিক নিয়ম হলো "Regola della destra" (ডানদিকের অগ্রাধিকার), যদি না স্টপ বা অগ্রাধিকার চিহ্ন দ্বারা অন্য কিছু নির্দেশিত থাকে।',
    trapTipBn: '"Salvo diversa segnalazione" (যদি না ভিন্ন সংকেত থাকে) শর্তযুক্ত থাকায় বাক্যটি সম্পূর্ণ সঠিক।',
    vocabulary: [
      { wordIt: 'Salvo diversa segnalazione', meaningBn: 'ভিন্ন কোনো সংকেত না থাকলে' },
      { wordIt: 'Proviene da destra', meaningBn: 'ডানদিক থেকে আগমনকারী' }
    ]
  },
  {
    id: 'hot-07',
    chapterId: 'precedenza',
    chapterTitleIt: 'Precedenze e Incroci Trabocchetto',
    chapterTitleBn: 'অগ্রাধিকারের ফাঁদ প্রশ্ন',
    questionIt: 'In presenza del segnale STOP è obbligatorio arrestarsi solo se sopraggiungono altri veicoli.',
    questionBn: 'স্টপ (STOP) চিহ্নের সামনে শুধুমাত্র তখনই গাড়ি থামাতে হবে যদি অন্য গাড়ি আসতে দেখা যায়।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! স্টপ চিহ্নের সামনে অন্য কোনো গাড়ি থাকুক বা না থাকুক, গাড়িকে অবশ্যই সম্পূর্ণ থামাতে হবে (Fermarsi sempre)। "Solo se sopraggiungono" কথাটি বড় একটি ফাঁদ! এটি Dare Precedenza চিহ্নের নিয়ম, STOP এর নয়।',
    trapTipBn: 'বিশাল ফাঁদ: STOP চিহ্নে অন্য গাড়ি না থাকলেও থামাতে হবে। "Solo se..." থাকলে FALSO!',
    image: 37,
    vocabulary: [
      { wordIt: 'Arrestarsi', meaningBn: 'সম্পূর্ণ গাড়ি থামানো' },
      { wordIt: 'Solo se', meaningBn: 'শুধুমাত্র যদি' },
      { wordIt: 'Sopraggiungono', meaningBn: 'কাছে এসে পৌঁছায়' }
    ]
  },
  {
    id: 'hot-08',
    chapterId: 'velocita',
    chapterTitleIt: 'Limiti di Velocità Trabocchetto',
    chapterTitleBn: 'গতিসীমার সূক্ষ্ম ফাঁদ',
    questionIt: 'Il limite massimo di velocità sulle autostrade per un neopatentato è di 100 km/h nei primi tre anni dal conseguimento.',
    questionBn: 'লাইসেন্স পাওয়ার প্রথম তিন বছর একজন নতুন চালকের (Neopatentato) জন্য হাইওয়েতে (Autostrada) সর্বোচ্চ গতিসীমা ১০০ কিমি/ঘণ্টা।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! সাধারণ চালকদের জন্য হাইওয়েতে গতিসীমা ১৩০ কিমি/ঘণ্টা হলেও নিওপাতেনতাতোদের (প্রথম ৩ বছর) জন্য এটি ১০০ কিমি/ঘণ্টা এবং এক্সট্রা-আরবানা প্রিঞ্চিপালেতে ৯০ কিমি/ঘণ্টা।',
    trapTipBn: 'নতুন চালকদের গতি: Autostrada = ১০০ km/h, Extraurbana principale = ৯০ km/h। ৩ বছর মেয়াদি।',
    vocabulary: [
      { wordIt: 'Neopatentato', meaningBn: 'নতুন ড্রাইভিং লাইসেন্সধারী' },
      { wordIt: 'Conseguimento', meaningBn: 'লাইসেন্স অর্জন / পাওয়া' }
    ]
  },
  {
    id: 'hot-09',
    chapterId: 'velocita',
    chapterTitleIt: 'Limiti di Velocità Trabocchetto',
    chapterTitleBn: 'গতিসীমার সূক্ষ্ম ফাঁদ',
    questionIt: 'La distanza di sicurezza deve essere aumentata se piove.',
    questionBn: 'বৃষ্টি হলে সামনের গাড়ি থেকে নিরাপদ দূরত্ব (Distanza di sicurezza) বৃদ্ধি করতে হবে।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! বৃষ্টির কারণে রাস্তা পিচ্ছিল হয় এবং ব্রেকিং দূরত্ব (Spazio di frenatura) দ্বিগুণ পর্যন্ত বাড়তে পারে, তাই নিরাপদ দূরত্ব বাড়ানো আবশ্যক।',
    trapTipBn: 'বৃষ্টি, বরফ, কুয়াশা বা খারাপ আবহাওয়ায় নিরাপদ দূরত্ব সবসময় বাড়াতে হবে (Aumentare)।',
    vocabulary: [
      { wordIt: 'Aumentata', meaningBn: 'বৃদ্ধি করা বা বাড়ানো' },
      { wordIt: 'Piove', meaningBn: 'বৃষ্টি হওয়া' }
    ]
  },
  {
    id: 'hot-10',
    chapterId: 'sorpasso',
    chapterTitleIt: 'Sorpasso Trabocchetto',
    chapterTitleBn: 'ওভারটেকিংয়ের জটিল ফাঁদ',
    questionIt: 'Il sorpasso è consentito sempre a destra nei centri abitati.',
    questionBn: 'শহরাঞ্চলে (Centri abitati) সবসময় ডানদিক দিয়ে ওভারটেক করা অনুমোদিত।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! ইতালিতে ওভারটেক সবসময় বাঁ দিক দিয়ে করতে হয়। ডানে ওভারটেক করার একমাত্র দুটি ব্যতিক্রম: সামনের গাড়ি বাঁয়ে ঘুরতে সিগনাল দিলে অথবা ট্রাম রাস্তার মাঝখানে চললে। "Sempre a destra" সম্পূর্ণ মিথ্যা।',
    trapTipBn: 'ডানদিক দিয়ে ওভারটেক সাধারণ নিয়ম নয়, এটি বিরল ব্যতিক্রম। Sempre a destra = FALSO!',
    vocabulary: [
      { wordIt: 'Consentito', meaningBn: 'অনুমোদিত' },
      { wordIt: 'Centri abitati', meaningBn: 'শহরাঞ্চল / লোকালয়' }
    ]
  },
  {
    id: 'hot-11',
    chapterId: 'sorpasso',
    chapterTitleIt: 'Sorpasso Trabocchetto',
    chapterTitleBn: 'ওভারটেকিংয়ের জটিল ফাঁদ',
    questionIt: 'È vietato sorpassare in prossimità o sui passaggi a livello senza barriere.',
    questionBn: 'ব্যারিয়ারবিহীন রেলক্রসিংয়ে (Passaggi a livello senza barriere) বা তার কাছাকাছি ওভারটেক করা নিষিদ্ধ।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! ব্যারিয়ার ছাড়া রেলক্রসিং অত্যন্ত ঝুঁকিপূর্ণ। সেখানে ট্রেন আসার দৃশ্য ও লাইন দেখার বিঘ্ন না ঘটাতে ওভারটেক সম্পূর্ণ নিষিদ্ধ।',
    trapTipBn: 'ব্যারিয়ারহীন রেলক্রসিংয়ে ওভারটেক সম্পূর্ণ নিষিদ্ধ (Vietato)। এটি VERO।',
    image: 8,
    vocabulary: [
      { wordIt: 'Senza barriere', meaningBn: 'গেট বা ব্যারিয়ার ছাড়া' },
      { wordIt: 'Passaggi a livello', meaningBn: 'রেলওয়ে ক্রসিং' }
    ]
  },
  {
    id: 'hot-12',
    chapterId: 'sosta',
    chapterTitleIt: 'Sosta e Fermata Trabocchetto',
    chapterTitleBn: 'পার্কিং ও সাময়িক থামার ফাঁদ',
    questionIt: 'La fermata è vietata nelle curve e nei dossi, fuori dai centri abitati.',
    questionBn: 'শহরের বাইরে অন্ধ বাঁকে (Curve) এবং উঁচু ঢালু সড়কে (Dossi) সাময়িক থামা (Fermata) নিষিদ্ধ।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! বাঁক ও দোস্‌সোতে অপর্যাপ্ত দৃশ্যমানতার কারণে যেকোনো গাড়ি দাঁড় করানো (Fermata বা Sosta) মারাত্মক দুর্ঘটনার কারণ হতে পারে, তাই এটি সম্পূর্ণ নিষিদ্ধ।',
    trapTipBn: 'অন্ধ বাঁক ও দোস্‌সোতে Sosta এবং Fermata উভয়ই নিষিদ্ধ।',
    vocabulary: [
      { wordIt: 'Fermata', meaningBn: 'সাময়িক থামা' },
      { wordIt: 'Fuori dai centri abitati', meaningBn: 'শহরের বাইরে' }
    ]
  },
  {
    id: 'hot-13',
    chapterId: 'sosta',
    chapterTitleIt: 'Sosta e Fermata Trabocchetto',
    chapterTitleBn: 'পার্কিং ও সাময়িক থামার ফাঁদ',
    questionIt: 'La sosta è consentita davanti ai cassonetti dei rifiuti urbani.',
    questionBn: 'শহরের ময়লার ডাস্টবিনের (Cassonetti) সামনে দীর্ঘস্থায়ী গাড়ি পার্কিং (Sosta) করা বৈধ।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! ময়লার গাড়ি এসে যেন ময়লা পরিষ্কার করতে পারে, সেজন্য ডাস্টবিনের সামনে পার্কিং করা সম্পূর্ণ নিষিদ্ধ।',
    trapTipBn: 'Cassonetti dei rifiuti-র সামনে Sosta করা সম্পূর্ণ নিষিদ্ধ (Vietata)।',
    vocabulary: [
      { wordIt: 'Cassonetti dei rifiuti', meaningBn: 'ময়লার ড্রাম বা ডাস্টবিন' },
      { wordIt: 'Sosta è consentita', meaningBn: 'পার্কিং বৈধ (ভুল দাবি)' }
    ]
  },
  {
    id: 'hot-14',
    chapterId: 'autostrada',
    chapterTitleIt: 'Autostrada Trabocchetto',
    chapterTitleBn: 'হাইওয়ের ফাঁদ প্রশ্ন',
    questionIt: 'In autostrada è consentito fare retromarcia solo per pochi metri in caso di errore di uscita.',
    questionBn: 'হাইওয়েতে ভুল এক্সিট পার হয়ে গেলে মাত্র কয়েক মিটার রিভার্স (Retromarcia) করে ফেরা বৈধ।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! হাইওয়েতে রিভার্স গিয়ারে পেছনে যাওয়া (Retromarcia) এবং ইউ-টার্ন নেওয়া কঠোরভাবে নিষিদ্ধ এবং এটি করলে লাইসেন্স বাজেয়াপ্ত ও উচ্চ জরিমানা হয়। এক্সিট মিস হলে পরবর্তী এক্সিট পর্যন্ত যেতে হবে।',
    trapTipBn: 'Autostrada-তে Retromarcia কখনো বৈধ নয়। "Solo per pochi metri" একটি মারাত্মক ফাঁদ!',
    vocabulary: [
      { wordIt: 'Retromarcia', meaningBn: 'পেছনে যাওয়া / রিভার্স করা' },
      { wordIt: 'Errore di uscita', meaningBn: 'ভুল করে এক্সিট পার হওয়া' }
    ]
  },
  {
    id: 'hot-15',
    chapterId: 'autostrada',
    chapterTitleIt: 'Autostrada Trabocchetto',
    chapterTitleBn: 'হাইওয়ের ফাঁদ প্রশ্ন',
    questionIt: 'Sulle autostrade e strade extraurbane principali i ciclomotori possono circolare liberamente.',
    questionBn: 'হাইওয়ে ও প্রধান অতিরিক্ত-শহুরে সড়কে মোপেড (Ciclomotori / ৫০ সিসি পর্যন্ত) স্বাধীনভাবে চলাচল করতে পারে।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! মোপেড এবং ১৫০ সিসির কম ক্ষমতার মোটরবাইক হাইওয়ে (Autostrada)-তে প্রবেশ সম্পূর্ণ নিষিদ্ধ।',
    trapTipBn: 'Ciclomotori এবং ১৫০ সিসির নিচে কোনো টু-হুইলার হাইওয়েতে চলতে পারে না।',
    vocabulary: [
      { wordIt: 'Ciclomotori', meaningBn: 'হালকা মোপেড (৫০ সিসি পর্যন্ত)' },
      { wordIt: 'Circolare liberamente', meaningBn: 'স্বাধীনভাবে চলা (ভুল দাবি)' }
    ]
  },
  {
    id: 'hot-16',
    chapterId: 'sicurezza',
    chapterTitleIt: 'Dispositivi e Sicurezza Trabocchetto',
    chapterTitleBn: 'নিরাপত্তা ডিভাইসের ফাঁদ',
    questionIt: 'L\'uso delle cinture di sicurezza è obbligatorio anche per i passeggeri dei sedili posteriori.',
    questionBn: 'গাড়ির পেছনের সিটের যাত্রীদের (Passeggeri posteriori) জন্যও সিটবেল্ট পরা বাধ্যতামূলক।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! গাড়ির সব সিটের যাত্রীদের সিটবেল্ট পরা বাধ্যতামূলক, পেছনের সিটের জন্যও কোনো ছাড় নেই।',
    trapTipBn: 'সিটবেল্ট সামনে ও পেছনে সবার জন্য বাধ্যতামূলক। "Solo sedili anteriori" বললে FALSO হতো।',
    vocabulary: [
      { wordIt: 'Cinture di sicurezza', meaningBn: 'সিটবেল্ট' },
      { wordIt: 'Sedili posteriori', meaningBn: 'পেছনের সিট' }
    ]
  },
  {
    id: 'hot-17',
    chapterId: 'sicurezza',
    chapterTitleIt: 'Dispositivi e Sicurezza Trabocchetto',
    chapterTitleBn: 'নিরাপত্তা ডিভাইসের ফাঁদ',
    questionIt: 'Il triangolo mobile di pericolo deve essere usato solo di notte.',
    questionBn: 'বিপদকালীন ট্রায়াঙ্গল (লাল ত্রিভুজ) সংকেতটি শুধুমাত্র রাতের বেলা ব্যবহার করতে হবে।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! দিনের বেলাতেও যদি গাড়ি এমন জায়গায় নষ্ট হয়ে দাঁড়ায় যেখানে ১০০ মিটার দূর থেকে দেখা যায় না (যেমন বাঁকের মুখে বা কুয়াশায়), তবে ট্রায়াঙ্গল রাখা বাধ্যতামূলক।',
    trapTipBn: 'ফাঁদ শব্দ: "Solo di notte"। দিনেও দৃশ্যমানতা কম থাকলে ট্রায়াঙ্গল ব্যবহার বাধ্যতামূলক।',
    vocabulary: [
      { wordIt: 'Triangolo mobile', meaningBn: 'পোর্টেবল লাল ত্রিভুজ সাইন' },
      { wordIt: 'Solo di notte', meaningBn: 'শুধুমাত্র রাতে (ফাঁদ শব্দ)' }
    ]
  },
  {
    id: 'hot-18',
    chapterId: 'soccorso',
    chapterTitleIt: 'Primo Soccorso Trabocchetto',
    chapterTitleBn: 'প্রাথমিক চিকিৎসার কঠিন ফাঁদ',
    questionIt: 'In caso di incidente con ferito in stato di shock, bisogna farlo bere un po\' di alcol per farlo riprendere.',
    questionBn: 'দুর্ঘটনায় আহত ব্যক্তি শকে থাকলে তাকে সুস্থ করার জন্য সামান্য অ্যালকোহল বা মদ পান করাতে হবে।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! আহত বা শকড ব্যক্তিকে কখনোই কোনো খাবার বা পানীয়, বিশেষ করে অ্যালকোহল দেওয়া যাবে না। এতে রক্তচাপ মারাত্মকভাবে নেমে গিয়ে মৃত্যু হতে পারে।',
    trapTipBn: 'আহত রোগীকে পানি বা অ্যালকোহল দেওয়া সম্পূর্ণ নিষিদ্ধ (Assolutamente vietato)!',
    vocabulary: [
      { wordIt: 'Stato di shock', meaningBn: 'শক অবস্থা' },
      { wordIt: 'Farlo bere alcol', meaningBn: 'মদ পান করানো (মারাত্মক ভুল)' }
    ]
  },
  {
    id: 'hot-19',
    chapterId: 'soccorso',
    chapterTitleIt: 'Primo Soccorso Trabocchetto',
    chapterTitleBn: 'প্রাথমিক চিকিৎসার কঠিন ফাঁদ',
    questionIt: 'Al ferito della strada che ha una ferita che sanguina, si deve togliere il corpo estraneo conficcato nella ferita.',
    questionBn: 'সড়ক দুর্ঘটনায় আহত ব্যক্তির ক্ষতে যদি কোনো ধারালো বস্তু বা কাচ ঢুকে থাকে, তবে তা টেনে বের করে ফেলতে হবে।',
    isCorrect: false,
    explanationBn: 'ভুল (FALSO)! ক্ষতে ঢুকে থাকা বস্তু (Corpo estraneo) কখনোই টেনে বের করবেন না, কারণ এতে অভ্যন্তরীণ রক্তক্ষরণ তীব্র হয়ে রোগী মারা যেতে পারে। শুধুমাত্র ব্যান্ডেজ দিয়ে চারপাশে আটকে চিকিৎসকের কাছে পাঠাতে হবে।',
    trapTipBn: 'ক্ষতে ঢুকে থাকা পেরেক বা কাচ কখনোই টেনে খুলবেন না (Non togliere)!',
    vocabulary: [
      { wordIt: 'Corpo estraneo conficcato', meaningBn: 'ক্ষতে ঢুকে থাকা বাইরের ধারালো বস্তু' },
      { wordIt: 'Togliere', meaningBn: 'টেনে খুলে ফেলা (ভুল পদক্ষেপ)' }
    ]
  },
  {
    id: 'hot-20',
    chapterId: 'patente',
    chapterTitleIt: 'Punti e Patente Trabocchetto',
    chapterTitleBn: 'লাইসেন্স ও পয়েন্টের ফাঁদ',
    questionIt: 'Per i primi tre anni dal rilascio della patente, i punti persi per infrazioni sono raddoppiati.',
    questionBn: 'লাইসেন্স পাওয়ার প্রথম তিন বছর কোনো ট্রাফিক আইন অমান্য করলে দ্বিগুণ পয়েন্ট (Punti raddoppiati) কাটা যায়।',
    isCorrect: true,
    explanationBn: 'সঠিক (VERO)! নতুন চালকদের (Neopatentati) জন্য প্রথম ৩ বছর যেকোনো পয়েন্ট কাটার শাস্তিতে দ্বিগুণ পয়েন্ট কাটা হয় (যেমন: সাধারণ চালকের ৫ পয়েন্ট কাটলে নতুন চালকের ১০ পয়েন্ট কাটা যাবে)।',
    trapTipBn: 'Neopatentati-দের পয়েন্ট ডিডাকশন দ্বিগুণ (Raddoppiati) হয় প্রথম ৩ বছর।',
    vocabulary: [
      { wordIt: 'Infrazioni', meaningBn: 'আইন অমান্য / অপরাধ' },
      { wordIt: 'Raddoppiati', meaningBn: 'দ্বিগুণ করা' }
    ]
  }
];

