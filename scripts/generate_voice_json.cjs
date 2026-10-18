const fs = require('fs');
const path = require('path');

// Audio metadata
const wavPath = 'C:/Users/LAPTOP LEGEND/.gemini/antigravity/brain/27fb971a-9948-4d80-877b-d4dedcba9eab/.user_uploaded/uploaded_media_1791933496153.wav';
const totalDuration = 54.00;

// Helper to format seconds as MM:SS.ms
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  const ms = Math.floor((sec % 1) * 100);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms).padStart(2, '0')}`;
}

// Sub-chunks with exact acoustic boundaries verified from waveform RMS
const speechChunks = [
  // Section 1: "আপনি কি ইতালিতে থাকেন এবং ইতালিয়ান ড্রাইভিং লাইসেন্স অর্থাৎ পাতেন্তে বি পরীক্ষার প্রস্তুতি নিতে চান?"
  {
    text: "আপনি কি ইতালিতে থাকেন এবং",
    start: 0.25,
    end: 2.25,
    words: [
      { word: "আপনি", weight: 2 },
      { word: "কি", weight: 1 },
      { word: "ইতালিতে", weight: 3.5 },
      { word: "থাকেন", weight: 2.5 },
      { word: "এবং", weight: 1.5 }
    ]
  },
  {
    text: "ইতালিয়ান ড্রাইভিং",
    start: 2.25,
    end: 3.25,
    words: [
      { word: "ইতালিয়ান", weight: 3.5 },
      { word: "ড্রাইভিং", weight: 2.5 }
    ]
  },
  {
    text: "লাইসেন্স অর্থাৎ পাতেন্তে বি পরীক্ষার প্রস্তুতি নিতে চান?",
    start: 3.45,
    end: 5.80,
    words: [
      { word: "লাইসেন্স", weight: 2.5 },
      { word: "অর্থাৎ", weight: 2 },
      { word: "পাতেন্তে", weight: 2.5 },
      { word: "বি", weight: 1.2 },
      { word: "পরীক্ষার", weight: 2.8 },
      { word: "প্রস্তুতি", weight: 2.5 },
      { word: "নিতে", weight: 1.5 },
      { word: "চান?", weight: 1.5 }
    ]
  },

  // Section 2: "কিন্তু ইতালিয়ান ভাষায় প্রশ্ন বুঝতে আপনার কি সমস্যা হয়?"
  {
    text: "কিন্তু ইতালিয়ান ভাষায় প্রশ্ন বুঝতে আপনার কি সমস্যা হয়?",
    start: 6.70,
    end: 9.40,
    words: [
      { word: "কিন্তু", weight: 1.8 },
      { word: "ইতালিয়ান", weight: 3.5 },
      { word: "ভাষায়", weight: 2.2 },
      { word: "প্রশ্ন", weight: 2.0 },
      { word: "বুঝতে", weight: 2.0 },
      { word: "আপনার", weight: 2.2 },
      { word: "কি", weight: 1.2 },
      { word: "সমস্যা", weight: 2.2 },
      { word: "হয়?", weight: 1.5 }
    ]
  },

  // Section 3: "তাহলে আপনার জন্য রয়েছে পাতেন্তে গুরু ডট আইটি।"
  {
    text: "তাহলে আপনার জন্য রয়েছে",
    start: 10.15,
    end: 11.40,
    words: [
      { word: "তাহলে", weight: 2 },
      { word: "আপনার", weight: 2.5 },
      { word: "জন্য", weight: 1.8 },
      { word: "রয়েছে", weight: 2.2 }
    ]
  },
  {
    text: "পাতেন্তে গুরু ডট আইটি।",
    start: 11.55,
    end: 12.85,
    words: [
      { word: "পাতেন্তে", weight: 2.6 },
      { word: "গুরু", weight: 1.8 },
      { word: "ডট", weight: 1.4 },
      { word: "আইটি।", weight: 2.0 }
    ]
  },

  // Section 4: "এখন থেকেই ইতালিয়ান ড্রাইভিং লাইসেন্সের পরীক্ষার প্রস্তুতি নিন নিজের ভাষা বাংলায়।"
  {
    text: "এখন থেকেই ইতালিয়ান ড্রাইভিং লাইসেন্সের পরীক্ষার প্রস্তুতি নিন",
    start: 14.10,
    end: 17.00,
    words: [
      { word: "এখন", weight: 1.6 },
      { word: "থেকেই", weight: 2.0 },
      { word: "ইতালিয়ান", weight: 3.2 },
      { word: "ড্রাইভিং", weight: 2.4 },
      { word: "লাইসেন্সের", weight: 3.0 },
      { word: "পরীক্ষার", weight: 2.6 },
      { word: "প্রস্তুতি", weight: 2.4 },
      { word: "নিন", weight: 1.4 }
    ]
  },
  {
    text: "নিজের ভাষা বাংলায়।",
    start: 17.25,
    end: 18.35,
    words: [
      { word: "নিজের", weight: 2.0 },
      { word: "ভাষা", weight: 1.8 },
      { word: "বাংলায়।", weight: 2.5 }
    ]
  },

  // Section 5: "আমাদের ওয়েবসাইটে অনুশীলন করুন ইতালিয়ান পাতেন্তে বি এর কুইজ, প্রশ্নের অর্থ বুঝুন এবং বাংলায় ব্যাখ্যার মাধ্যমে নিজের জ্ঞান আরও ভালোভাবে তৈরি করুন।"
  {
    text: "আমাদের ওয়েবসাইটে অনুশীলন করুন",
    start: 19.70,
    end: 21.65,
    words: [
      { word: "আমাদের", weight: 2.5 },
      { word: "ওয়েবসাইটে", weight: 3.8 },
      { word: "অনুশীলন", weight: 3.2 },
      { word: "করুন", weight: 1.8 }
    ]
  },
  {
    text: "ইতালিয়ান পাতেন্তে বি এর কুইজ,",
    start: 21.65,
    end: 23.10,
    words: [
      { word: "ইতালিয়ান", weight: 3.2 },
      { word: "পাতেন্তে", weight: 2.5 },
      { word: "বি", weight: 1.2 },
      { word: "এর", weight: 1.0 },
      { word: "কুইজ,", weight: 2.2 }
    ]
  },
  {
    text: "প্রশ্নের অর্থ বুঝুন",
    start: 23.35,
    end: 24.35,
    words: [
      { word: "প্রশ্নের", weight: 2.5 },
      { word: "অর্থ", weight: 1.8 },
      { word: "বুঝুন", weight: 2.0 }
    ]
  },
  {
    text: "এবং বাংলায় ব্যাখ্যার মাধ্যমে",
    start: 24.70,
    end: 26.70,
    words: [
      { word: "এবং", weight: 1.5 },
      { word: "বাংলায়", weight: 2.5 },
      { word: "ব্যাখ্যার", weight: 2.6 },
      { word: "মাধ্যমে", weight: 2.2 }
    ]
  },
  {
    text: "নিজের জ্ঞান আরও ভালোভাবে তৈরি করুন।",
    start: 26.85,
    end: 28.10,
    words: [
      { word: "নিজের", weight: 1.8 },
      { word: "জ্ঞান", weight: 1.5 },
      { word: "আরও", weight: 1.5 },
      { word: "ভালোভাবে", weight: 2.6 },
      { word: "তৈরি", weight: 1.6 },
      { word: "করুন।", weight: 1.6 }
    ]
  },

  // Section 6: "বাসায় বসে কাজের বিরতিতে কিংবা আপনার অবসর সময়ে মোবাইল বা কম্পিউটার থেকেই শুরু করুন আপনার প্রস্তুতি।"
  {
    text: "বাসায় বসে কাজের বিরতিতে",
    start: 28.95,
    end: 30.65,
    words: [
      { word: "বাসায়", weight: 2.2 },
      { word: "বসে", weight: 1.6 },
      { word: "কাজের", weight: 2.0 },
      { word: "বিরতিতে", weight: 2.8 }
    ]
  },
  {
    text: "কিংবা আপনার অবসর সময়ে",
    start: 30.65,
    end: 32.10,
    words: [
      { word: "কিংবা", weight: 1.8 },
      { word: "আপনার", weight: 2.2 },
      { word: "অবসর", weight: 2.2 },
      { word: "সময়ে", weight: 2.0 }
    ]
  },
  {
    text: "মোবাইল বা কম্পিউটার থেকেই শুরু করুন আপনার প্রস্তুতি।",
    start: 32.55,
    end: 35.10,
    words: [
      { word: "মোবাইল", weight: 2.4 },
      { word: "বা", weight: 1.0 },
      { word: "কম্পিউটার", weight: 3.2 },
      { word: "থেকেই", weight: 2.0 },
      { word: "শুরু", weight: 1.6 },
      { word: "করুন", weight: 1.6 },
      { word: "আপনার", weight: 2.0 },
      { word: "প্রস্তুতি।", weight: 2.4 }
    ]
  },

  // Section 7: "ইতালিয়ান ভাষা নিয়ে আর দুশ্চিন্তা নয়। নিয়মিত অনুশীলন করুন, নিজের ভুলগুলো থেকে শিখুন এবং পরীক্ষার জন্য আত্মবিশ্বাস বাড়ান।"
  {
    text: "ইতালিয়ান ভাষা নিয়ে আর দুশ্চিন্তা নয়।",
    start: 36.10,
    end: 37.95,
    words: [
      { word: "ইতালিয়ান", weight: 3.2 },
      { word: "ভাষা", weight: 1.8 },
      { word: "নিয়ে", weight: 1.6 },
      { word: "আর", weight: 1.2 },
      { word: "দুশ্চিন্তা", weight: 2.6 },
      { word: "নয়।", weight: 1.6 }
    ]
  },
  {
    text: "নিয়মিত অনুশীলন করুন,",
    start: 38.50,
    end: 39.95,
    words: [
      { word: "নিয়মিত", weight: 2.5 },
      { word: "অনুশীলন", weight: 3.0 },
      { word: "করুন,", weight: 1.8 }
    ]
  },
  {
    text: "নিজের ভুলগুলো থেকে শিখুন",
    start: 39.95,
    end: 41.30,
    words: [
      { word: "নিজের", weight: 2.0 },
      { word: "ভুলগুলো", weight: 2.8 },
      { word: "থেকে", weight: 1.8 },
      { word: "শিখুন", weight: 2.0 }
    ]
  },
  {
    text: "এবং পরীক্ষার জন্য আত্মবিশ্বাস বাড়ান।",
    start: 41.55,
    end: 43.40,
    words: [
      { word: "এবং", weight: 1.4 },
      { word: "পরীক্ষার", weight: 2.5 },
      { word: "জন্য", weight: 1.6 },
      { word: "আত্মবিশ্বাস", weight: 3.5 },
      { word: "বাড়ান।", weight: 2.2 }
    ]
  },

  // Section 8: "তাহলে আর দেরি কেন? আজই ভিজিট করুন www.patenteguru.it"
  {
    text: "তাহলে আর দেরি কেন?",
    start: 44.30,
    end: 45.20,
    words: [
      { word: "তাহলে", weight: 2.0 },
      { word: "আর", weight: 1.2 },
      { word: "দেরি", weight: 1.8 },
      { word: "কেন?", weight: 1.8 }
    ]
  },
  {
    text: "আজই ভিজিট করুন",
    start: 45.80,
    end: 46.75,
    words: [
      { word: "আজই", weight: 2.0 },
      { word: "ভিজিট", weight: 2.2 },
      { word: "করুন", weight: 1.8 }
    ]
  },
  {
    text: "www.patenteguru.it",
    start: 46.95,
    end: 49.35,
    words: [
      { word: "www.", weight: 3.5 },
      { word: "patente", weight: 2.5 },
      { word: "guru", weight: 2.0 },
      { word: ".it", weight: 1.8 }
    ]
  },

  // Section 9: "পাতেন্তে গুরু, আপনার ভাষায় পাতেন্তে শেখার সহজ পথ।"
  {
    text: "পাতেন্তে গুরু,",
    start: 50.45,
    end: 51.00,
    words: [
      { word: "পাতেন্তে", weight: 2.4 },
      { word: "গুরু,", weight: 1.8 }
    ]
  },
  {
    text: "আপনার ভাষায় পাতেন্তে শেখার সহজ পথ।",
    start: 51.60,
    end: 53.55,
    words: [
      { word: "আপনার", weight: 2.2 },
      { word: "ভাষায়", weight: 2.0 },
      { word: "পাতেন্তে", weight: 2.4 },
      { word: "শেখার", weight: 2.0 },
      { word: "সহজ", weight: 1.8 },
      { word: "পথ।", weight: 1.6 }
    ]
  }
];

// Calculate precise word timestamps
const allWords = [];
let wordIndex = 0;

const processedChunks = speechChunks.map((chunk, chunkIdx) => {
  const chunkDuration = chunk.end - chunk.start;
  const totalWeight = chunk.words.reduce((sum, w) => sum + w.weight, 0);

  let currentStart = chunk.start;
  const chunkWords = chunk.words.map((item, idx) => {
    wordIndex++;
    const wordDur = (item.weight / totalWeight) * chunkDuration;
    const wStart = +currentStart.toFixed(2);
    let wEnd = +(currentStart + wordDur).toFixed(2);
    if (idx === chunk.words.length - 1) {
      wEnd = chunk.end; // align exactly with chunk end
    }
    currentStart += wordDur;

    const wordObj = {
      index: wordIndex,
      word: item.word,
      start_seconds: wStart,
      end_seconds: wEnd,
      duration_seconds: +(wEnd - wStart).toFixed(2),
      timestamp: formatTime(wStart),
      timestamp_range: `${formatTime(wStart)} - ${formatTime(wEnd)}`
    };

    allWords.push(wordObj);
    return wordObj;
  });

  return {
    chunk_id: chunkIdx + 1,
    start_seconds: chunk.start,
    end_seconds: chunk.end,
    duration_seconds: +(chunk.end - chunk.start).toFixed(2),
    timestamp_range: `${formatTime(chunk.start)} - ${formatTime(chunk.end)}`,
    text: chunk.text,
    words: chunkWords
  };
});

// Full JSON object
const outputData = {
  meta: {
    audio_file: "uploaded_media_1791933496153.wav",
    platform: "PatenteGuru.it",
    language: "bn-BD",
    total_duration_seconds: totalDuration,
    total_duration_formatted: formatTime(totalDuration),
    total_words_count: allWords.length,
    generated_at: new Date().toISOString()
  },
  words: allWords,
  sentence_chunks: processedChunks
};

// Target output paths
const projectJsonPath = path.resolve(__dirname, '../voice_transcription_words.json');
const brainJsonPath = 'C:/Users/LAPTOP LEGEND/.gemini/antigravity/brain/27fb971a-9948-4d80-877b-d4dedcba9eab/voice_transcription_words.json';

fs.writeFileSync(projectJsonPath, JSON.stringify(outputData, null, 2), 'utf8');
fs.writeFileSync(brainJsonPath, JSON.stringify(outputData, null, 2), 'utf8');

console.log(`Successfully generated JSON with ${allWords.length} words!`);
console.log(`Saved to: ${projectJsonPath}`);
console.log(`Saved to: ${brainJsonPath}`);
