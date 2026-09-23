// Natural Female Italian Speech Synthesis Utility
// Designed for natural human-like cadence, warm female timbre, and regular reading speed

let cachedFemaleVoice: SpeechSynthesisVoice | null = null;

/**
 * Discovers and selects the best natural female Italian voice available on the device
 */
export const getBestItalianFemaleVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // Filter Italian voices (it-IT, it_IT, it)
  const itVoices = voices.filter(
    (v) => v.lang && (v.lang.toLowerCase().startsWith('it') || v.lang.toLowerCase() === 'it')
  );

  if (itVoices.length === 0) return null;

  // Preferred natural female voices across Windows, Mac, iOS, Android, and Chrome
  const preferredFemaleNames = [
    'isabella',         // Microsoft Online (Natural) - Italian (Italy) [Extremely high quality]
    'elsa',             // Microsoft Elsa - Italian (Italy)
    'alice',            // Apple iOS/macOS Alice (Natural Italian female)
    'federica',         // Apple Federica
    'paola',            // Apple Paola
    'bianca',           // Italian female
    'chiara',           // Italian female
    'google italiano',  // Chrome Google Italian female
    'natural',          // Any natural neural voice
    'female',
    'femmina',
    'donna'
  ];

  for (const nameKeyword of preferredFemaleNames) {
    const match = itVoices.find((v) => v.name.toLowerCase().includes(nameKeyword));
    if (match) {
      cachedFemaleVoice = match;
      return match;
    }
  }

  // Fallback: exclude known male voices (Cosimo, Luca, Diego, Giorgio, Male, Uomo)
  const nonMale = itVoices.find(
    (v) => !/cosimo|luca|diego|giorgio|male|uomo/i.test(v.name)
  );
  if (nonMale) {
    cachedFemaleVoice = nonMale;
    return nonMale;
  }

  cachedFemaleVoice = itVoices[0];
  return itVoices[0];
};

// Initialize voice listener on client load
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = () => {
    getBestItalianFemaleVoice();
  };
}

/**
 * Speaks Italian text using a natural female voice at regular human reading speed
 */
export const speakItalian = (
  text: string,
  callbacks?: {
    onStart?: () => void;
    onEnd?: () => void;
    rate?: number;
  }
): void => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

  try {
    window.speechSynthesis.cancel();

    // Clean text: strip parenthesis numbers like (505) and markdown for clean pronunciation
    const cleanText = text
      .replace(/\(\d+\)/g, '')
      .replace(/[*_#]/g, '')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'it-IT';

    // Select the best natural female voice
    const femaleVoice = cachedFemaleVoice || getBestItalianFemaleVoice();
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }

    // Regular human reading speed (1.0) and natural warm female pitch (1.06)
    utterance.rate = callbacks?.rate ?? 1.0;
    utterance.pitch = 1.06;

    if (callbacks?.onStart) {
      utterance.onstart = callbacks.onStart;
    }
    if (callbacks?.onEnd) {
      utterance.onend = callbacks.onEnd;
      utterance.onerror = callbacks.onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis notice:', err);
    if (callbacks?.onEnd) callbacks.onEnd();
  }
};

/**
 * Immediately cancels any active speech
 */
export const stopSpeech = (): void => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
