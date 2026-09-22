// 25 Official Ministerial Chapters Bite-Sized Theory Summaries
// Designed specifically for Bangladeshi students preparing for Patente B in Italy

export interface GoldenRule {
  it: string;
  bn: string;
}

export interface TrapKeyword {
  word: string;
  meaningBn: string;
  trapNoteBn: string;
}

export interface TheoryChapter {
  id: string;
  chapterNumber: number;
  titleIt: string;
  titleBn: string;
  category: 'signals' | 'rules' | 'safety' | 'mechanics' | 'legal';
  icon: string;
  summaryBn: string;
  goldenRules: GoldenRule[];
  trapKeywords: TrapKeyword[];
  relatedRounds: number[];
}

export const THEORY_CHAPTERS: TheoryChapter[] = [
  {
    id: 'ch-01',
    chapterNumber: 1,
    titleIt: 'Definizioni Stradali e di Traffico',
    titleBn: 'রাস্তার সংজ্ঞা ও ট্রাফিক পরিচিতি',
    category: 'rules',
    icon: 'Compass',
    summaryBn: 'রাস্তা (Strada), মূল ক্যারেজিয়াটা (Carreggiata), ফুটপাত (Marciapiede), এবং জরুরি লেন (Corsia di emergenza)-এর প্রাথমিক নিয়মাবলি।',
    goldenRules: [
      {
        it: "La carreggiata è la parte della strada destinata normalmente alla circolazione dei veicoli.",
        bn: "ক্যারেজিয়াটা (Carreggiata) হলো রাস্তার মূল অংশ যা যানবাহন চলাচলের জন্য নির্ধারিত।"
      },
      {
        it: "La banchina non fa parte della carreggiata e non consente il normale transito dei veicoli.",
        bn: "বানকিনা (Banchina / রাস্তার সাইডের অংশ) ক্যারেজিয়াটার অন্তর্ভুক্ত নয় এবং এতে সাধারণ গাড়ি চলাচল নিষিদ্ধ।"
      },
      {
        it: "Il marciapiede è una parte della strada riservata ai pedoni.",
        bn: "ফুটপাত (Marciapiede) রাস্তার একটি অংশ যা পথচারীদের জন্য সংরক্ষিত।"
      },
      {
        it: "La corsia di emergenza serve solo per l'arresto dei veicoli in avaria o per il passaggio dei soccorsi.",
        bn: "জরুরি লেন (Corsia di emergenza) শুধুমাত্র গাড়ি নষ্ট হলে অথবা অ্যাম্বুলেন্স/পুলিশের জরুরি চলাচলের জন্য ব্যবহৃত হয়।"
      }
    ],
    trapKeywords: [
      {
        word: "Carreggiata",
        meaningBn: "মূল পিচঢালা সড়ক",
        trapNoteBn: "ফুটপাত বা সাইকেল লেন ক্যারেজিয়াটার অংশ নয় বললে VERO; অংশ বললে FALSO।"
      },
      {
        word: "Sempre",
        meaningBn: "সবসময়",
        trapNoteBn: "প্রশ্নে 'sempre' বা সবসময় থাকলে ৯০% ক্ষেত্রে সেটি FALSO হয়।"
      },
      {
        word: "Banchina",
        meaningBn: "রাস্তার ধারের কাঁচা অংশ",
        trapNoteBn: "এতে গাড়ি ড্রাইভ করা অনুমোদিত বললে FALSO।"
      }
    ],
    relatedRounds: [1, 2, 21]
  },
  {
    id: 'ch-02',
    chapterNumber: 2,
    titleIt: 'Segnali di Pericolo',
    titleBn: 'বিপদজনক সংকেত',
    category: 'signals',
    icon: 'AlertTriangle',
    summaryBn: '১৫০ মিটার আগের ত্রিভুজাকার বিপদ সংকেত, খাড়া ঢালু রাস্তা, আকস্মিক বাঁক, পিচ্ছিল রাস্তা এবং ট্রেন ক্রসিংয়ের পূর্বাভাস।',
    goldenRules: [
      {
        it: "I segnali di pericolo sono posti di norma a 150 metri dal punto di inizio del pericolo.",
        bn: "বিপদজনক সংকেতগুলো সাধারণত বিপদ শুরু হওয়ার ঠিক ১৫০ মিটার পূর্বে স্থাপন করা হয়।"
      },
      {
        it: "Hanno di norma forma triangolare con un vertice verso l'alto e bordo rosso.",
        bn: "এই সংকেতগুলো সাধারণত উপরের দিকে চূড়া বিশিষ্ট লাল বর্ডারযুক্ত ত্রিভুজাকার হয়।"
      },
      {
        it: "In presenza di un segnale di pericolo occorre sempre moderare la velocità.",
        bn: "বিপদ সংকেত দেখলে চালককে অবশ্যই গতি কমাতে হবে এবং বাড়তি সতর্কতা অবলম্বন করতে হবে।"
      }
    ],
    trapKeywords: [
      {
        word: "A 100 metri",
        meaningBn: "১০০ মিটার পূর্বে",
        trapNoteBn: "প্রশ্নে বিপদ সংকেত ১০০ বা ২০০ মিটারে থাকে বললে FALSO (নিয়ম হলো ১৫০ মিটার)।"
      },
      {
        word: "Obbligatorio arrestarsi",
        meaningBn: "গাড়ি সম্পূর্ণ থামানো বাধ্যতামূলক",
        trapNoteBn: "বিপদ সংকেত দেখে গাড়ি থামানো বাধ্যতামূলক নয়, গতি কমানোই নিয়ম (FALSO)।"
      }
    ],
    relatedRounds: [1, 3, 22]
  },
  {
    id: 'ch-03',
    chapterNumber: 3,
    titleIt: 'Segnali di Precedenza',
    titleBn: 'অগ্রাধিকার সংক্রান্ত সংকেত',
    category: 'signals',
    icon: 'CornerDownRight',
    summaryBn: 'স্টপ (STOP), অগ্রাধিকার দিন (Dare Precedenza), এবং অগ্রাধিকারের মূল সড়ক সংক্রান্ত সকল অফিশিয়াল নিয়ম।',
    goldenRules: [
      {
        it: "Il segnale di STOP obbliga a fermarsi sempre in corrispondenza della striscia di arresto, anche in assenza di traffico.",
        bn: "STOP সংকেত থাকলে রাস্তায় গাড়ি থাকুক বা না থাকুক, স্টপ লাইনের ঠিক সামনে গাড়ি সম্পূর্ণ থামানো বাধ্যতামূলক।"
      },
      {
        it: "Il segnale DARE PRECEDENZA obbliga a rallentare e dare la precedenza sia a destra che a sinistra.",
        bn: "DARE PRECEDENZA সংকেত থাকলে গতি কমাতে হবে এবং ডান ও বাম উভয় পাশের যানবাহনকে অগ্রাধিকার দিতে হবে।"
      },
      {
        it: "Nei bivi e incroci, in assenza di segnali, vale la regola generale della precedenza a destra.",
        bn: "কোনো সংকেত না থাকলে সাধারণ নিয়ম অনুযায়ী সর্বদা ডানদিকের গাড়ি অগ্রাধিকার পাবে।"
      }
    ],
    trapKeywords: [
      {
        word: "Solo se sopraggiungono veicoli",
        meaningBn: "শুধুমাত্র গাড়ি আসলে",
        trapNoteBn: "STOP সংকেতে কোনো গাড়ি না আসলেও সম্পূর্ণ থামতে হয়; গাড়ি আসলে থামতে হবে বললে FALSO।"
      },
      {
        word: "Solo a destra",
        meaningBn: "শুধুমাত্র ডান দিকে",
        trapNoteBn: "STOP এবং DARE PRECEDENZA থাকলে ডানে ও বামে উভয় দিকে অগ্রাধিকার দিতে হয়।"
      }
    ],
    relatedRounds: [2, 4, 23]
  },
  {
    id: 'ch-04',
    chapterNumber: 4,
    titleIt: 'Segnali di Divieto',
    titleBn: 'নিষেধাজ্ঞামূলক সংকেত',
    category: 'signals',
    icon: 'Ban',
    summaryBn: 'বৃত্তাকার লাল বর্ডার সংকেত: প্রবেশ নিষেধ (Divieto di accesso), ওভারটেক নিষেধ, হর্ন বাজানো নিষেধ ও ওজন সীমা।',
    goldenRules: [
      {
        it: "I segnali di divieto hanno di norma forma circolare con bordo rosso su fondo bianco.",
        bn: "নিষেধাজ্ঞামূলক সংকেতগুলো সাধারণত সাদা পটভূমির ওপর লাল বর্ডারযুক্ত গোলাকার হয়।"
      },
      {
        it: "Il segnale DIVIETO DI TRANSITO vieta la circolazione in entrambi i sensi a tutti i veicoli.",
        bn: "DIVIETO DI TRANSITO সংকেতটি উভয় দিক থেকেই সকল ধরনের যানবাহনের চলাচল সম্পূর্ণ নিষেধ করে।"
      },
      {
        it: "Il segnale SENSO VIETATO consente di percorrere la strada solo in senso contrario (senso unico).",
        bn: "SENSO VIETATO (প্রবেশ নিষেধ) সংকেত থাকলে সেই দিক দিয়ে ঢোকা নিষেধ কিন্তু উল্টো দিক থেকে একমুখী গাড়ি চলতে পারে।"
      }
    ],
    trapKeywords: [
      {
        word: "Tutti i veicoli",
        meaningBn: "সকল গাড়ি",
        trapNoteBn: "কিছু সংকেতে মোটরবিহীন সাইকেল বা পথচারী বাদ থাকে, প্রশ্নে 'tutti' থাকলে যত্নসহকারে পড়ুন।"
      },
      {
        word: "Esclude",
        meaningBn: "বাদ দেয় বা ছাড় দেয়",
        trapNoteBn: "অফিশিয়াল পরীক্ষায় 'esclude' শব্দটি ট্র্যাপ হিসেবে ব্যবহৃত হয়।"
      }
    ],
    relatedRounds: [5, 6, 24]
  },
  {
    id: 'ch-05',
    chapterNumber: 5,
    titleIt: 'Segnali di Obbligo',
    titleBn: 'বাধ্যতামূলক সংকেত',
    category: 'signals',
    icon: 'ShieldCheck',
    summaryBn: 'নীল ব্যাকগ্রাউন্ডের বৃত্তাকার সংকেত: নির্দিষ্ট দিকে মোড় নেওয়া বাধ্যতামূলক, সর্বনিম্ন গতিসীমা ও স্নো-চেইনের ব্যবহার।',
    goldenRules: [
      {
        it: "I segnali di obbligo hanno forma circolare su fondo blu.",
        bn: "বাধ্যতামূলক সংকেতগুলো সাধারণত নীল পটভূমির ওপর সাদা চিহ্নের গোলাকার সংকেত হয়।"
      },
      {
        it: "Indicano una direzione obbligatoria, una corsia riservata o un comportamento da tenere.",
        bn: "এগুলো চালকের জন্য নির্দিষ্ট পথ, সংরক্ষিত লেন বা নির্দিষ্ট আচরণ বাধ্যতামূলক করে।"
      },
      {
        it: "Il segnale di limite minimo di velocità obbliga a circolare ad una velocità almeno uguale a quella indicata.",
        bn: "সর্বনিম্ন গতিসীমা সংকেত থাকলে সংকেতে প্রদর্শিত গতির সমান বা তার বেশি গতিতে গাড়ি চালাতে হবে।"
      }
    ],
    trapKeywords: [
      {
        word: "Consigliato",
        meaningBn: "পরামর্শমূলক",
        trapNoteBn: "বাধ্যতামূলক সংকেতকে পরামর্শমূলক (consigliato) বললে উত্তর FALSO।"
      },
      {
        word: "Facoltativo",
        meaningBn: "ঐচ্ছিক",
        trapNoteBn: "বাধ্যতামূলক চিহ্ন কখনোই ঐচ্ছিক হতে পারে না।"
      }
    ],
    relatedRounds: [7, 8, 25]
  },
  {
    id: 'ch-06',
    chapterNumber: 6,
    titleIt: 'Segnaletica Orizzontale (Strisce)',
    titleBn: 'রাস্তার অনুভূমিক দাগ ও স্ট্রাইপ',
    category: 'signals',
    icon: 'Divide',
    summaryBn: 'অবিচ্ছিন্ন রেখা (Striscia continua), বিচ্ছিন্ন রেখা (Striscia discontinua), জেব্রা ক্রসিং ও স্টপ লাইন।',
    goldenRules: [
      {
        it: "La striscia bianca continua di mezzeria non può essere mai oltrepassata né calpestata.",
        bn: "রাস্তার মাঝের সাদা অবিচ্ছিন্ন লাইন (Striscia continua) কখনোই অতিক্রম করা বা চাকা ওঠানো যাবে না।"
      },
      {
        it: "La striscia bianca discontinua (tratteggiata) consente il sorpasso e l'inversione di marcia se le condizioni lo permettono.",
        bn: "ভাঙা ভাঙা সাদা লাইন (Striscia discontinua) থাকলে নিরাপদ অবস্থায় ওভারটেক এবং ইউ-টার্ন নেওয়া অনুমোদিত।"
      },
      {
        it: "La striscia trasversale continua indica il punto in cui ci si deve arrestare in presenza del segnale di STOP o semaforo rosso.",
        bn: "রাস্তার আড়াআড়ি শক্ত সাদা লাইনটি নির্দেশ করে লাল বাতি বা STOP চিহ্নের সামনে কোথায় গাড়ি থামাতে হবে।"
      }
    ],
    trapKeywords: [
      {
        word: "Oltrepassare la striscia continua",
        meaningBn: "টানা দাগ অতিক্রম করা",
        trapNoteBn: "টানা দাগ পার হয়ে ওভারটেক করা যায় বললে সবসময় FALSO।"
      }
    ],
    relatedRounds: [9, 10, 26]
  },
  {
    id: 'ch-07',
    chapterNumber: 7,
    titleIt: 'Semafori e Segnali Luminosi',
    titleBn: 'ট্রাফিক লাইট ও আলোক সংকেত',
    category: 'signals',
    icon: 'Sliders',
    summaryBn: 'লাল, হলুদ ও সবুজ বাতি, দিকনির্দেশক তীর, পথচারী ট্রাফিক লাইট এবং হলুদ ফ্ল্যাশিং লাইট।',
    goldenRules: [
      {
        it: "La luce gialla fissa obbliga ad arrestarsi prima dell'incrocio, a meno che non ci si trovi così vicini da non poter fermarsi in sicurezza.",
        bn: "স্থির হলুদ বাতি জ্বললে মোড়ের আগে গাড়ি থামাতে হবে, যদি না এত কাছে থাকেন যে নিরাপদে থামা অসম্ভব।"
      },
      {
        it: "La luce gialla lampeggiante invita a procedere con prudenza e moderare la velocità.",
        bn: "হলুদ বাতি মিটমিট (Lampeggiante) করলে গাড়ি সম্পূর্ণ থামানো বাধ্যতামূলক নয়, তবে গতি কমিয়ে সতর্কভাবে চলতে হবে।"
      },
      {
        it: "La luce rossa obbliga sempre all'arresto prima della striscia trasversale.",
        bn: "লাল বাতি জ্বললে স্টপ লাইনের পূর্বে গাড়ি সম্পূর্ণ থামানো সবসময় বাধ্যতামূলক।"
      }
    ],
    trapKeywords: [
      {
        word: "Gialla lampeggiante",
        meaningBn: "মিটমিটে হলুদ বাতি",
        trapNoteBn: "হলুদ মিটমিট করলে সবসময় থামতে হবে বললে FALSO; সতর্কতা নিয়ে চলার নিয়ম।"
      }
    ],
    relatedRounds: [11, 12, 27]
  },
  {
    id: 'ch-08',
    chapterNumber: 8,
    titleIt: 'Segnali degli Agenti del Traffico',
    titleBn: 'ট্রাফিক পুলিশের হাতের সংকেত',
    category: 'rules',
    icon: 'UserCheck',
    summaryBn: 'ট্রাফিক পুলিশের হাত ওড়ালে বা সোজা তুললে কোন বাতির সমান হয় এবং ট্রাফিক সিগন্যালের চেয়ে পুলিশের আদেশ বেশি কার্যকর।',
    goldenRules: [
      {
        it: "Le prescrizioni degli agenti del traffico prevalgono su tutti i segnali e sulle regole della circolazione.",
        bn: "ট্রাফিক পুলিশের নির্দেশ রাস্তায় উপস্থিত অন্য যেকোনো সাইনবোর্ড বা ট্রাফিক বাতির চেয়ে অগ্রাধিকার পায়।"
      },
      {
        it: "Il braccio alzato verticalmente dal vigile equivale alla luce gialla fissa del semaforo.",
        bn: "পুলিশের এক হাত সোজা উপরের দিকে তোলা ট্রাফিক লাইটের স্থির হলুদ বাতির সমতুল্য।"
      },
      {
        it: "Le braccia aperte nella nostra direzione equivalgono alla luce rossa del semaforo.",
        bn: "পুলিশের দুই হাত আমাদের দিকে প্রসারিত থাকা ট্রাফিক লাইটের লাল বাতির সমান (থামা বাধ্যতামূলক)।"
      }
    ],
    trapKeywords: [
      {
        word: "Braccio alzato",
        meaningBn: "এক হাত সোজা উপরে",
        trapNoteBn: "এটি লাল বাতির সমান বললে FALSO (এটি স্থির হলুদ বাতির সমান)।"
      }
    ],
    relatedRounds: [13, 14, 28]
  },
  {
    id: 'ch-09',
    chapterNumber: 9,
    titleIt: 'Limiti di Velocità e Pericolo',
    titleBn: 'গতিসীমা ও গতি সমন্বয়',
    category: 'rules',
    icon: 'Gauge',
    summaryBn: 'শহরের ভেতর ৫০ কিমি/ঘণ্টা, গ্রামীণ সড়কে ৯০/১১০ এবং হাইওয়েতে (Autostrada) ১৩০ কিমি/ঘণ্টা। নবাগত চালকদের (Neopatentati) জন্য বিশেষ সীমা।',
    goldenRules: [
      {
        it: "I limiti massimi generali sono: 50 km/h nei centri abitati, 90 km/h su strade extraurbane secondarie, 110 km/h su extraurbane principali, 130 km/h in autostrada.",
        bn: "সর্বোচ্চ সাধারণ গতিসীমা: শহরে ৫০ কিমি/ঘণ্টা, সেকেন্ডারি সড়কে ৯০, মেইন অতিরিক্ত নগরে ১১০, এবং অটোস্ত্রাদায় ১৩০ কিমি/ঘণ্টা।"
      },
      {
        it: "In caso di pioggia, il limite massimo in autostrada scende da 130 a 110 km/h.",
        bn: "বৃষ্টি হলে হাইওয়েতে (Autostrada) গতিসীমা ১৩০ থেকে কমে ১১০ কিমি/ঘণ্টা হয়ে যায়।"
      },
      {
        it: "Per i primi tre anni dal conseguimento della patente (neopatentati), il limite è di 100 km/h in autostrada e 90 km/h sulle extraurbane principali.",
        bn: "নতুন ড্রাইভিং লাইসেন্সধারী (প্রথম ৩ বছর) চালকদের জন্য হাইওয়েতে ১০০ এবং মেইন সড়কে ৯০ কিমি/ঘণ্টা গতিসীমা প্রযোজ্য।"
      }
    ],
    trapKeywords: [
      {
        word: "Neopatentati",
        meaningBn: "নতুন লাইসেন্সধারী (প্রথম ৩ বছর)",
        trapNoteBn: "নতুন চালকদের জন্য অটোস্ত্রাদায় ১১০ বা ১৩০ বললে FALSO (সঠিক হলো ১০০ কিমি/ঘণ্টা)।"
      },
      {
        word: "Pioggia autostrada",
        meaningBn: "বৃষ্টির সময়ে হাইওয়ে",
        trapNoteBn: "বৃষ্টিতে গতিসীমা অপরিবর্তিত থাকে বললে FALSO।"
      }
    ],
    relatedRounds: [15, 16, 29]
  },
  {
    id: 'ch-10',
    chapterNumber: 10,
    titleIt: 'Distanza di Sicurezza',
    titleBn: 'নিরাপদ দূরত্ব ও ব্রেকিং স্পেস',
    category: 'safety',
    icon: 'ArrowRightLeft',
    summaryBn: 'প্রতিক্রিয়ার সময় (Tempo di reazione), ব্রেকিং দূরত্ব (Spazio di frenatura), এবং সম্পূর্ণ থামার স্থান (Spazio totale di arresto)।',
    goldenRules: [
      {
        it: "La distanza di sicurezza deve essere mantenuta per evitare il tamponamento con il veicolo che precede.",
        bn: "সামনের গাড়ির পেছনে ধাক্কা এড়ানোর জন্য সবসময় নিরাপদ দূরত্ব বজায় রাখতে হবে।"
      },
      {
        it: "Lo spazio totale di arresto è dato dalla somma dello spazio percorso nel tempo di reazione e dello spazio di frenatura.",
        bn: "সম্পূর্ণ থামার দূরত্ব = প্রতিক্রিয়া সময়ে চলা দূরত্ব + ব্রেক ধরার পর গাড়ি থামার দূরত্ব।"
      },
      {
        it: "La distanza di sicurezza dipende dalla velocità, dalle condizioni dei freni, del fondo stradale e del tempo atmosferico.",
        bn: "নিরাপদ দূরত্ব নির্ভর করে গাড়ির গতি, ব্রেকের অবস্থা, রাস্তার পিচ্ছিলতা ও আবহাওয়ার ওপর।"
      }
    ],
    trapKeywords: [
      {
        word: "Dipende dalla larghezza del veicolo",
        meaningBn: "গাড়ির প্রস্থ বা চওড়ার ওপর নির্ভর করে",
        trapNoteBn: "নিরাপদ দূরত্ব গাড়ির চওড়ার ওপর নির্ভর করে বললে সবসময় FALSO।"
      },
      {
        word: "Distanza fissa",
        meaningBn: "সবসময় নির্দিষ্ট বা ফিক্সড দূরত্ব",
        trapNoteBn: "নিরাপদ দূরত্ব নির্দিষ্ট কোনো ফিক্সড মিটার নয়, গতির সাথে পরিবর্তনশীল।"
      }
    ],
    relatedRounds: [17, 18, 30]
  },
  {
    id: 'ch-11',
    chapterNumber: 11,
    titleIt: 'Norme sulla Circolazione e Sorpasso',
    titleBn: 'রাস্তায় চলাচল ও ওভারটেকের নিয়ম',
    category: 'rules',
    icon: 'ChevronsRight',
    summaryBn: 'সাধারণত ডান পাশ দিয়ে চলাচল (Mano da tenere), বাঁ পাশ দিয়ে ওভারটেক করা, এবং কখন ডান পাশ দিয়ে ওভারটেক অনুমোদিত।',
    goldenRules: [
      {
        it: "I veicoli devono circolare sulla parte destra della carreggiata e vicino al margine destro.",
        bn: "সকল যানবাহনকে ক্যারেজিয়াটার ডান পাশ দিয়ে এবং ডান সীমানার কাছাকাছি চালাতে হবে।"
      },
      {
        it: "Il sorpasso si effettua di norma a sinistra.",
        bn: "ওভারটেকিং সাধারণত বাম পাশ দিয়েই করতে হয়।"
      },
      {
        it: "È consentito il sorpasso a destra se il conducente che precede ha segnalato l'intenzione di svoltare a sinistra.",
        bn: "সামনের গাড়ি বামে মোড় নেওয়ার জন্য সিগন্যাল দিলে তবেই তাকে ডান পাশ দিয়ে ওভারটেক করা বৈধ।"
      }
    ],
    trapKeywords: [
      {
        word: "Sorpasso in curva",
        meaningBn: "বাঁকের ওপর ওভারটেক",
        trapNoteBn: "দ্বিমুখী এক ক্যারেজিয়াটা সড়কে বাঁকের ওপর ওভারটেক সম্পূর্ণ নিষিদ্ধ (VERO)।"
      },
      {
        word: "A destra sempre vietato",
        meaningBn: "ডানে ওভারটেক সবসময় নিষিদ্ধ",
        trapNoteBn: "ট্রাম অথবা বামে মোড় নেওয়া গাড়ির ক্ষেত্রে ডানে ওভারটেক সম্ভব, তাই 'sempre' বললে FALSO।"
      }
    ],
    relatedRounds: [19, 20, 31]
  },
  {
    id: 'ch-12',
    chapterNumber: 12,
    titleIt: 'Sosta, Fermata e Arresto',
    titleBn: 'পার্কিং, সাময়িক থামা ও জরুরি থামা',
    category: 'rules',
    icon: 'SquareParking',
    summaryBn: 'সোস্তা (Sosta - চালক গাড়ি ছেড়ে যায়), ফেরমাতা (Fermata - স্বল্প সময় যাত্রী ওঠানামা, চালক সিটেই থাকে), এবং আররেস্তো (Arresto - ট্রাফিক কারণে থামা)।',
    goldenRules: [
      {
        it: "Durante la fermata il conducente deve essere sempre presente e pronto a riprendere la marcia.",
        bn: "সাময়িক থামার (Fermata) সময় চালককে সর্বদা গাড়িতে উপস্থিত থাকতে হবে এবং প্রয়োজনে গাড়ি সরানোর প্রস্তুতি থাকতে হবে।"
      },
      {
        it: "La sosta è vietata in corrispondenza o prossimità dei passaggi a livello e sulle rotaie del tram.",
        bn: "রেল ক্রসিংয়ের কাছে এবং ট্রামের লাইনের ওপর পার্কিং (Sosta) করা সম্পূর্ণ নিষিদ্ধ।"
      },
      {
        it: "Nei centri abitati la sosta è consentita lungo il margine destro della carreggiata.",
        bn: "শহরের ভেতর ক্যারেজিয়াটার ডান ধারের সমান্তরালে পার্কিং করা অনুমোদিত।"
      }
    ],
    trapKeywords: [
      {
        word: "Fermata con conducente assente",
        meaningBn: "চালক অনুপস্থিত রেখে ফেরমাতা",
        trapNoteBn: "চালক গাড়ি ছেড়ে চলে গেলে সেটা সোস্তা (Sosta) হয়ে যায়, ফেরমাতা থাকে না (FALSO)।"
      },
      {
        word: "Sosta davanti a un passo carrabile",
        meaningBn: "বাড়ির ড্রাইভওয়ের সামনে পার্কিং",
        trapNoteBn: "পাসসো কাররাবিলে (Passo carrabile) এর সামনে পার্কিং নিষিদ্ধ, তবে স্বল্প সময়ের ফেরমাতা অনুমোদিত।"
      }
    ],
    relatedRounds: [4, 18, 32]
  }
];
