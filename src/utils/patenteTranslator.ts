// Intelligent Italian-to-Bangla translator for Patente B Ministerial Questions

// Dictionary of Italian Patente terms and phrases to Bengali
export const PHRASE_DICTIONARY: Array<[RegExp, string]> = [
  // Signal starters
  [/^Il segnale raffigurato preannuncia una fermata di autobus/i, 'ছবিতে প্রদর্শিত সংকেতটি একটি বাস স্টপের পূর্বাভাস দেয়'],
  [/^Il segnale raffigurato indica la fermata di un autobus/i, 'ছবিতে প্রদর্শিত সংকেতটি একটি বাস স্টপ নির্দেশ করে'],
  [/^Il segnale raffigurato è un segnale di preavviso di direzione obbligatoria/i, 'ছবিতে প্রদর্শিত সংকেতটি বাধ্যতামূলক দিক নির্দেশনার অগ্রিম সংকেত'],
  [/^Il segnale raffigurato indica la fine di una pista ciclabile/i, 'ছবিতে প্রদর্শিত সংকেতটি সাইকেল লেনের সমাপ্তি নির্দেশ করে'],
  [/^Il segnale raffigurato indica una zona a traffico limitato/i, 'ছবিতে প্রদর্শিত সংকেতটি সীমিত ট্রাফিক জোন (ZTL) নির্দেশ করে'],
  [/^Il segnale raffigurato preannuncia un pericolo/i, 'ছবিতে প্রদর্শিত সংকেতটি একটি বিপদের পূর্বাভাস দেয়'],
  [/^Il segnale raffigurato vieta il transito/i, 'ছবিতে প্রদর্শিত সংকেতটি চলাচল নিষিদ্ধ করে'],
  [/^Il segnale raffigurato obbliga ad arrestarsi/i, 'ছবিতে প্রদর্শিত সংকেতটি সম্পূর্ণ গাড়ি থামাতে বাধ্য করে'],
  [/^Il segnale raffigurato consente di svoltare/i, 'ছবিতে প্রদর্শিত সংকেতটি মোড় নেওয়ার অনুমতি দেয়'],
  [/^Il segnale raffigurato è un segnale di/i, 'ছবিতে প্রদর্শিত সংকেতটি হলো একটি'],
  [/^Il segnale raffigurato preannuncia/i, 'ছবিতে প্রদর্শিত সংকেতটি পূর্বাভাস দেয়:'],
  [/^Il segnale raffigurato indica/i, 'ছবিতে প্রদর্শিত সংকেতটি নির্দেশ করে:'],
  [/^Il segnale raffigurato vieta/i, 'ছবিতে প্রদর্শিত সংকেতটি নিষেধ করে:'],
  [/^Il segnale raffigurato obbliga/i, 'ছবিতে প্রদর্শিত সংকেতটি বাধ্য করে:'],
  [/^Il segnale raffigurato consente/i, 'ছবিতে প্রদর্শিত সংকেতটি অনুমতি দেয়:'],
  [/^In presenza del segnale raffigurato è obbligatorio/i, 'ছবিতে প্রদর্শিত সংকেত থাকলে বাধ্যতামূলক:'],
  [/^In presenza del segnale raffigurato è consentito/i, 'ছবিতে প্রদর্শিত সংকেত থাকলে অনুমোদিত:'],
  [/^In presenza del segnale raffigurato è vietato/i, 'ছবিতে প্রদর্শিত সংকেত থাকলে নিষিদ্ধ:'],
  [/^In presenza del segnale raffigurato bisogna/i, 'ছবিতে প্রদর্শিত সংকেত থাকলে আবশ্যক:'],
  [/^In presenza del segnale raffigurato si deve/i, 'ছবিতে প্রদর্শিত সংকেত থাকলে অবশ্যই:'],

  // General rules
  [/^Non è obbligatorio soccorrere un ferito/i, 'আহত ব্যক্তিকে উদ্ধার করা বাধ্যতামূলক নয়'],
  [/^È obbligatorio soccorrere un ferito/i, 'সড়ক দুর্ঘটনায় আহত ব্যক্তিকে সহায়তা ও উদ্ধার করা বাধ্যতামূলক'],
  [/^È vietato sorpassare/i, 'ওভারটেক করা নিষিদ্ধ'],
  [/^È consentito il sorpasso/i, 'ওভারটেক করা অনুমোদিত'],
  [/^È vietata la sosta/i, 'পার্কিং (Sosta) করা নিষিদ্ধ'],
  [/^È vietata la fermata/i, 'সাময়িক থামা (Fermata) নিষিদ্ধ'],
  [/^È consentita la fermata/i, 'সাময়িক থামা (Fermata) অনুমোদিত'],
  [/^La carreggiata è destinata/i, 'ক্যারেজিয়াটা (Carreggiata / চলাচলের মূল সড়ক) নির্ধারিত:'],
  [/^La corsia di emergenza serve/i, 'জরুরি লেন (Corsia di emergenza) ব্যবহৃত হয়:'],
  [/^Sulle autostrade è vietato/i, 'অটোস্ত্রাদা বা হাইওয়েতে নিষিদ্ধ:'],
  [/^Sulle autostrade è consentito/i, 'অটোস্ত্রাদা বা হাইওয়েতে অনুমোদিত:'],
  [/^La distanza di sicurezza deve essere/i, 'নিরাপদ দূরত্ব অবশ্যই হতে হবে:'],
  [/^La distanza di sicurezza dipende/i, 'নিরাপদ দূরত্ব নির্ভর করে:'],
  [/^Il limite massimo di velocità/i, 'সর্বোচ্চ গতিসীমা:'],
  [/^Durante la marcia/i, 'গাড়ি চালানোর সময়:'],
  [/^Prima di iniziare il sorpasso/i, 'ওভারটেক শুরু করার পূর্বে:'],
  [/^Negli incroci/i, 'রাস্তার মোড়ে:'],
  [/^Nelle rotatorie/i, 'গোলচত্বরে (Rotatoria):'],
  [/^Nei passaggi a livello/i, 'রেল ক্রসিংয়ে:'],
  [/^I pedoni hanno la precedenza/i, 'পথচারীদের অগ্রাধিকার রয়েছে'],
  [/^Si deve dare la precedenza/i, 'অগ্রাধিকার দিতে হবে:'],
  [/^Il conducente deve/i, 'চালককে অবশ্যই:'],
  [/^Il casco deve essere/i, 'সুরক্ষা হেলমেট অবশ্যই:'],
  [/^Le cinture di sicurezza devono essere/i, 'সিটবেল্ট অবশ্যই:'],
  [/^L\'air-bag/i, 'এয়ারব্যাগ'],
];

// Term replacements
export const TERM_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\bfermata di un autobus\b/gi, 'বাসের স্টপ (Fermata autobus)'],
  [/\bfermata dell'autobus\b/gi, 'বাসের স্টপ (Fermata autobus)'],
  [/\bpista ciclabile\b/gi, 'সাইকেল ট্র্যাক (Pista ciclabile)'],
  [/\battraversamento pedonale\b/gi, 'জেব্রা ক্রসিং (Attraversamento pedonale)'],
  [/\bpassaggio a livello con barriere\b/gi, 'ব্যারিয়ারযুক্ত রেল ক্রসিং'],
  [/\bpassaggio a livello senza barriere\b/gi, 'ব্যারিয়ারবিহীন রেল ক্রসিং'],
  [/\bpassaggio a livello\b/gi, 'রেল ক্রসিং (Passaggio a livello)'],
  [/\bsosta di emergenza\b/gi, 'জরুরি পার্কিং (Sosta di emergenza)'],
  [/\bcorsia di emergenza\b/gi, 'জরুরি লেন (Corsia di emergenza)'],
  [/\bcorsia di accelerazione\b/gi, 'গতি বাড়ানোর লেন (Corsia di accelerazione)'],
  [/\bcorsia di decelerazione\b/gi, 'গতি কমানোর লেন (Corsia di decelerazione)'],
  [/\bstrada sdrucciolevole\b/gi, 'পিচ্ছিল রাস্তা (Strada sdrucciolevole)'],
  [/\bdoppia curva pericolosa\b/gi, 'দ্বৈত বিপজ্জনক বাঁক (Doppia curva)'],
  [/\bcurva pericolosa\b/gi, 'বিপজ্জনক বাঁক (Curva pericolosa)'],
  [/\bdiscesa pericolosa\b/gi, 'খাড়া ঢালু রাস্তা (Discesa pericolosa)'],
  [/\bsalita ripida\b/gi, 'খাড়া চড়াই রাস্তা (Salita ripida)'],
  [/\bspazio di frenatura\b/gi, 'ব্রেকিং দূরত্ব (Spazio di frenatura)'],
  [/\btempo di reazione\b/gi, 'প্রতিক্রিয়া সময় (Tempo di reazione)'],
  [/\bdistanza di sicurezza\b/gi, 'নিরাপদ দূরত্ব (Distanza di sicurezza)'],
  [/\blimite massimo di velocità\b/gi, 'সর্বোচ্চ গতিসীমা'],
  [/\bcinture di sicurezza\b/gi, 'সিটবেল্ট (Cinture di sicurezza)'],
  [/\bcasco protettivo\b/gi, 'সুরক্ষা হেলমেট (Casco)'],
  [/\btasso alcolemico\b/gi, 'রক্তে অ্যালকোহলের মাত্রা'],
  [/\bneopatentati\b/gi, 'নতুন লাইসেন্সধারী চালক (প্রথম ৩ বছর)'],
  [/\bautostrada\b/gi, 'হাইওয়ে (Autostrada)'],
  [/\bstrade extraurbane principali\b/gi, 'প্রধান অতিরিক্ত নগর সড়ক (১১০ কিমি/ঘণ্টা)'],
  [/\bstrade extraurbane secondarie\b/gi, 'দ্বিতীয় শ্রেণির গ্রামীণ সড়ক (৯০ কিমি/ঘণ্টা)'],
  [/\bcarreggiata\b/gi, 'ক্যারেজিয়াটা (চলাচলের মূল পিচঢালা সড়ক)'],
  [/\bcorsia\b/gi, 'লেন (Corsia)'],
  [/\bbanchina\b/gi, 'বানকিনা (রাস্তার সাইডের কাঁধ)'],
  [/\bmarciapiede\b/gi, 'ফুটপাত (Marciapiede)'],
  [/\bisola di traffico\b/gi, 'ট্রাফিক চ্যানেল আইল্যান্ড'],
  [/\bsalvagente\b/gi, 'যাত্রী সুরক্ষা প্ল্যাটফর্ম (Salvagente)'],
  [/\brotatoria\b/gi, 'গোলচত্বর (Rotatoria)'],
  [/\bincrocio\b/gi, 'রাস্তার মোড় (Incrocio)'],
  [/\bdare la precedenza\b/gi, 'অগ্রাধিকার দেওয়া'],
  [/\bdiritto di precedenza\b/gi, 'অগ্রাধিকারের অধিকার'],
  [/\bsorpasso a destra\b/gi, 'ডান পাশ দিয়ে ওভারটেক'],
  [/\bsorpasso\b/gi, 'ওভারটেকিং'],
  [/\bfermata\b/gi, 'সাময়িক থামা'],
  [/\bsosta\b/gi, 'পার্কিং করা'],
  [/\barresto\b/gi, 'সম্পূর্ণ গাড়ি থামা'],
  [/\bobbligatorio\b/gi, 'বাধ্যতামূলক'],
  [/\bvietato\b/gi, 'নিষিদ্ধ'],
  [/\bconsentito\b/gi, 'অনুমোদিত'],
  [/\bsempre\b/gi, 'সবসময়'],
  [/\bmai\b/gi, 'কখনোই না'],
  [/\bsolo\b/gi, 'শুধুমাত্র'],
  [/\besclusivamente\b/gi, 'শুধুমাত্র ও বিশেষভাবে'],
];

import { PATENTE_TRANSLATIONS_BN } from '../data/patenteTranslationsBn';

/**
 * Checks whether text contains Bengali characters
 */
export const containsBengali = (text?: string): boolean => {
  if (!text) return false;
  return /[\u0980-\u09FF]/.test(text);
};

/**
 * Automatically polishes machine-translated phrases into natural, easily understandable Bengali.
 */
export const polishBengaliTranslation = (text: string): string => {
  if (!text) return '';
  let res = text;

  const POLISH_MAP: Array<[RegExp, string]> = [
    // Misleading geometric terms & intersection phrases
    [/ছেদটিতে,\s*যানবাহনগুলি নিম্নলিখিত ক্রমে ছেদটি পরিষ্কার করে/g, 'প্রদর্শিত চৌরাস্তায় যানবাহনগুলো এই ক্রমানুসারে মোড় পার হবে'],
    [/ছেদটি পরিষ্কার করে/g, 'মোড় অতিক্রম করে'],
    [/ছেদ পরিষ্কার করে/g, 'মোড় অতিক্রম করে'],
    [/ছেদটিতে/g, 'চৌরাস্তায়'],
    [/ছেদক্ষেত্রে/g, 'চৌরাস্তায়'],
    [/ছেদ-এ/g, 'চৌরাস্তায়'],
    [/ছেদটি/g, 'চৌরাস্তাটি'],
    [/ছেদের/g, 'চৌরাস্তার'],
    [/ছেদ অতিক্রম/g, 'চৌরাস্তা অতিক্রম'],
    [/ছেদ থেকে/g, 'চৌরাস্তা থেকে'],
    [/একটি ছেদ/g, 'একটি চৌরাস্তা বা মোড় (Incrocio)'],
    [/কোনো ছেদে/g, 'কোনো চৌরাস্তায় বা মোড়ে'],
    [/কাছাকাছি ছেদ/g, 'কাছাকাছি চৌরাস্তা'],
    [/ছেদ/g, 'চৌরাস্তা বা মোড়'],

    // Italian Patente technical terms made friendly
    [/পাবলিক সার্ভিস বাস স্টপের জন্য নির্ধারিত এলাকায় ফুটপাতে হলুদ বাস লেখা খুঁজে বের করা নিয়ন্ত্রক।/g, "পাবলিক বাস স্টপের জন্য নির্ধারিত স্থানে রাস্তার পিচের ওপর হলুদ রঙে 'BUS' লেখা থাকা আইনসম্মত ও নিয়মমাফিক।"],
    [/খুঁজে বের করা নিয়ন্ত্রক/g, 'থাকা আইনসম্মত ও নিয়মমাফিক'],
    [/সাইকেল চালকদের জন্য ফুটপাতে উৎসাহের একটি লেখা খুঁজে পাওয়া বাধ্যতামূলক/g, "সড়কের পিচের ওপর রেসিং সাইক্লিস্টদের উৎসাহ দেওয়ার স্লোগান লেখা থাকা আইনসম্মত ও ট্রাফিক কোড অনুযায়ী অনুমোদিত"],
    [/একটি স্টপ ইভেন্টে, যেখানে কোনও উঁচু ফুটপাথ নেই, চালককে অবশ্যই পথচারীদের ট্রানজিটের জন্য এক মিটারের কম জায়গা ছেড়ে দিতে হবে।/g, 'গাড়ি সাময়িক থামানোর ক্ষেত্রে যদি কোনো উঁচু ফুটপাথ না থাকে, তবে পথচারী চলাচলের জন্য কমপক্ষে এক মিটার জায়গা ছেড়ে দিতে হবে।'],
    [/একটি শক্তিশালী পার্শ্বীয় ঢাল সহ সড়কপথে অ্যাকুয়াপ্ল্যানিংয়ের ঘটনাটি বৃদ্ধি পায়/g, 'সড়কে পাশের ঢাল (Pendenza laterale) বেশি হলে অ্যাকুয়াপ্ল্যানিং (Aquaplaning / পানিতে চাকা পিছলে যাওয়া) হওয়ার ঝুঁকি বাড়ে'],
    [/প্রেসক্রিপশন সংকেত/g, 'বাধ্যতামূলক ও নিয়ন্ত্রণমূলক সংকেত (Segnale di prescrizione)'],
    [/প্রেসক্রিপশন/g, 'বাধ্যতামূলক নিয়ম বা সংকেত'],
    [/ক্যারেজওয়েতে/g, 'দ্বিমুখী মূল সড়কে (Carreggiata)'],
    [/ক্যারেজওয়ের/g, 'মূল সড়কের (Carreggiata)'],
    [/ক্যারেজওয়ে/g, 'চলাচলের মূল সড়ক (Carreggiata)'],
    [/ভ্রমণের সময়/g, 'গাড়ি চালানোর সময়'],
    [/ভ্রমণে বাধা/g, 'জরুরি বিরতি বা গাড়ি থামা (Sosta di emergenza)'],
    [/ভ্রমণের দিক উল্টাতে/g, 'গাড়ি ইউ-টার্ন নিয়ে উল্টো দিকে চালাতে (Inversione di marcia)'],
    [/ভ্রমণের দিক/g, 'চলাচলের দিক'],
    [/প্রচলন থাকাকালীন/g, 'গাড়ি চালানোর সময়'],
    [/প্রচলনে/g, 'চলাচলে'],
    [/একটি প্রসারিত রাস্তা/g, 'রাস্তার একটি অংশ'],
    [/রাস্তার প্রসারিত/g, 'সড়কের নির্দিষ্ট অংশ'],
    [/প্রসারিত রাস্তা/g, 'সড়কের অংশ'],
    [/অনিয়মিত ফুটপাথ/g, 'অমসৃণ বা ভাঙাচোরা রাস্তা (Pavimentazione irregolare)'],
    [/কম রশ্মির আলো/g, 'লো-বিম হেডলাইট (Luci anabbaglianti)'],
    [/উচ্চ রশ্মির আলো/g, 'হাই-বিম হেডলাইট (Luci abbaglianti)'],
    [/টায়ার এবং অ্যাসফল্টের মধ্যে গ্রিপ/g, 'টায়ার ও পিচঢালা রাস্তার গ্রিপ (ঘর্ষণ)'],
    [/টায়ার এবং অ্যাসফল্ট/g, 'টায়ার ও পিচঢালা রাস্তা'],
    [/আধা-বাধা এখনও উত্থাপিত/g, 'হাফ ব্যারিয়ারযুক্ত রেলগেট এখনও খোলা থাকলেও'],
    [/আধা-বাধা/g, 'হাফ ব্যারিয়ারযুক্ত রেলগেট (Semibarriera)'],
    [/লেভেল ক্রসিং/g, 'রেল ক্রসিং (Passaggio a livello)'],
    [/একটি ড্রাইভওয়ে/g, 'একটি ব্যক্তিগত প্রবেশপথ (Passo carrabile)'],
    [/ড্রাইভওয়ে/g, 'ব্যক্তিগত প্রবেশপথ (Passo carrabile)'],
    [/বিচ্ছিন্ন পার্শ্বীয় সাদা ডোরা/g, 'সড়কের পাশের ভাঙা সাদা দাগ (Striscia discontinua)'],
    [/সোজা চালিয়ে যাওয়ার বাধ্যবাধকতা/g, 'শুধুমাত্র সোজা এগিয়ে যাওয়ার নির্দেশ'],
    [/একটি লাল স্ট্রাইপ দ্বারা অতিক্রম করা হয়/g, 'একটি লাল দাগ দিয়ে কাটা থাকে'],
    [/বন্য প্রাণীদের সম্ভাব্য এবং আকস্মিক ক্রসিং ঘোষণা করে/g, 'হঠাৎ বন্য প্রাণী রাস্তা পার হওয়ার আশঙ্কার বিষয়ে সতর্ক করে'],
    [/পথের অধিকার রয়েছে/g, 'আগে যাওয়ার অগ্রাধিকার (Precedenza) রয়েছে'],
    [/পথের অধিকার/g, 'অগ্রাধিকার (Precedenza)'],
    [/উতরাই/g, 'নিচের দিকে ঢালু রাস্তা (Discesa)'],
    [/চড়াই/g, 'খাড়া উঁচু রাস্তা (Salita)'],
    [/কোয়াড্রিসাইকেল ছাড়া/g, 'চার চাকার হালকা মোটরযান (Quadricicli) ছাড়া'],
    [/কোয়াড্রিসাইকেল/g, 'চার চাকার ছোট যান (Quadricicli)'],
    [/স্বাভাবিক যাতায়াতের/g, 'স্বাভাবিক গাড়ি চলাচলের'],
    [/মোটর গাড়ি হল একটি মোটরযান/g, 'অটোভেইকেল (Autoveicolo) হলো একটি মোটরচালিত যান'],
    [/ট্র্যাক্টরের মতো একই নীতির সাথে/g, 'মূল টানাগাড়ির বীমা পলিসির আওতায়'],
    [/দেখানো বর্ণনাকারী একটি চক্র পথ থেকে রাস্তাকে বিভক্ত করে/g, 'প্রদর্শিত সাইড রিফ্লেক্টরটি সাইকেল লেন থেকে মূল সড়ককে আলাদা করে'],
    [/একটি বিপজ্জনক বক্ররেখা হাইলাইট করার জন্য চিত্রিত বর্ণনাকারী একাধিক উপাদানের সেটে রয়েছে/g, 'বিপজ্জনক বাঁক স্পষ্টভাবে নির্দেশ করতে প্রদর্শিত রিফ্লেক্টর বোর্ডগুলো (Delineatore) সারিবদ্ধভাবে বসানো থাকে'],
    [/চিত্রিত বর্ণনাকারী/g, 'প্রদর্শিত রিফ্লেক্টর প্যানেল (Delineatore)'],
    [/দেখানো বর্ণনাকারী/g, 'প্রদর্শিত রিফ্লেক্টর প্যানেল (Delineatore)'],
    [/বর্ণনাকারী/g, 'সড়ক নির্দেশক রিফ্লেক্টর প্যানেল (Delineatore)'],
    [/স্তব্ধ মাত্রা সহ/g, 'ফ্লাইওভার বা আন্ডারপাসযুক্ত ইন্টারসেকশনে (Livelli sfalsati)'],
    [/স্তব্ধ স্তরে/g, 'ফ্লাইওভার বা আন্ডারপাসযুক্ত ইন্টারসেকশনে'],
    [/একটি চক্র পথ থেকে/g, 'সাইকেল লেন থেকে'],
    [/চক্র পথ/g, 'সাইকেল লেন (Pista ciclabile)'],
    [/একটি বিপজ্জনক বক্ররেখা/g, 'একটি বিপজ্জনক বাঁক (Curva pericolosa)'],
    [/বিপজ্জনক বক্ররেখা/g, 'বিপজ্জনক বাঁক (Curva pericolosa)'],
    [/বক্ররেখার ব্যাসার্ধের সাথে/g, 'বাঁকের তীব্রতার (Raggio della curva) সাথে'],
    [/বক্ররেখার/g, 'বাঁকের (Curva)'],
    [/বক্ররেখা/g, 'রাস্তার বাঁক (Curva)'],
    [/প্রধান অতিরিক্ত-শহুরে সড়কে/g, 'প্রধান হাইওয়েতে (Strada extraurbana principale)'],
    [/প্রধান অতিরিক্ত-শহুরে রাস্তায়/g, 'প্রধান হাইওয়েতে (Strada extraurbana principale)'],
    [/প্রধান অতিরিক্ত-শহুরে/g, 'প্রধান হাইওয়ে (Strada extraurbana principale)'],
    [/অতিরিক্ত-শহুরে রাস্তায়/g, 'শহরের বাইরের হাইওয়েতে (Strada extraurbana)'],
    [/অতিরিক্ত-শহুরে রাস্তা/g, 'শহরের বাইরের হাইওয়ে (Strada extraurbana)'],
    [/অতিরিক্ত-শহুরে/g, 'শহরের বাইরের হাইওয়ে (Extraurbana)'],
    [/একটি পাহাড়ের উপর দিয়ে/g, 'উঁচু ঢাল বা ঢিবির ওপর দিয়ে (Dosso)'],
    [/পাহাড়ের উপর দিয়ে/g, 'উঁচু ঢাল বা ঢিবির ওপর দিয়ে (Dosso)'],
  ];

  for (const [pattern, replacement] of POLISH_MAP) {
    res = res.replace(pattern, replacement);
  }

  return res.trim();
};

/**
 * Returns clean, guaranteed Bangla translation for any Patente Italian question
 */
export const getBanglaTranslation = (questionIt: string, rawQuestionBn?: string): string => {
  const cleanIt = (questionIt || '').trim();

  // 1. Check exact match in pre-compiled dictionary of all official questions
  if (PATENTE_TRANSLATIONS_BN[cleanIt]) {
    return polishBengaliTranslation(PATENTE_TRANSLATIONS_BN[cleanIt]);
  }

  // 2. Normalize punctuation / quotes and check dictionary again
  const normalizedIt = cleanIt.replace(/['']/g, "'").replace(/[ÀÁ]/g, 'A').replace(/[ÈÉ]/g, 'E');
  for (const [dictIt, dictBn] of Object.entries(PATENTE_TRANSLATIONS_BN)) {
    if (dictIt.trim() === normalizedIt || dictIt.trim().toLowerCase() === cleanIt.toLowerCase()) {
      return polishBengaliTranslation(dictBn);
    }
  }

  // 3. If rawQuestionBn has authentic Bengali and is not raw Italian, return it
  if (rawQuestionBn && containsBengali(rawQuestionBn) && rawQuestionBn.trim() !== cleanIt) {
    return polishBengaliTranslation(rawQuestionBn.trim());
  }

  // 4. Pattern Match fallback for new dynamic questions
  for (const [pattern, banglaPrefix] of PHRASE_DICTIONARY) {
    if (pattern.test(cleanIt)) {
      return polishBengaliTranslation(banglaPrefix);
    }
  }

  // 5. Clean default fallback
  return rawQuestionBn && containsBengali(rawQuestionBn) 
    ? polishBengaliTranslation(rawQuestionBn.trim()) 
    : 'প্রশ্নটির সহজ বাংলা ভাবার্থ শীঘ্রই যুক্ত করা হচ্ছে।';
};

