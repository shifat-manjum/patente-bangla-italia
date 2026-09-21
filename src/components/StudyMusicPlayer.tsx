import React, { useState, useEffect, useRef } from 'react';
import { Volume2, Music } from 'lucide-react';

export const StudyMusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState<boolean>(() => {
    try {
      return localStorage.getItem('patente_study_music') === 'true';
    } catch {
      return false;
    }
  });

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const isInitializedRef = useRef<boolean>(false);
  const timerRef = useRef<any>(null);

  // Gentle ambient drone / 432Hz study concentration harmonic synthesizer
  // Uses Web Audio API which requires no external network download or heavy MP3s
  const startAmbientSynth = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;

      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioContextClass();
      }

      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume();
      }

      const ctx = audioCtxRef.current;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.08, ctx.currentTime); // gentle, calming background volume (8%)
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Harmonic chords (F major 7 ambient focus pad: F3, A3, C4, E4)
      const frequencies = [174.61, 220.00, 261.63, 329.63, 432.00];

      frequencies.forEach((freq) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Gentle subtle vibrato/lfo for calming atmosphere
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.setValueAtTime(0.1 + Math.random() * 0.15, ctx.currentTime);
        lfoGain.gain.setValueAtTime(0.02, ctx.currentTime);
        lfo.connect(oscGain.gain);
        lfo.start();

        oscGain.gain.setValueAtTime(0.015, ctx.currentTime);
        osc.connect(oscGain);
        oscGain.connect(masterGain);

        osc.start();
      });

      isInitializedRef.current = true;
    } catch (e) {
      console.warn('Web Audio Ambient Player error:', e);
    }
  };

  const stopAmbientSynth = () => {
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      try {
        audioCtxRef.current.suspend();
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (!isPlaying) {
      startAmbientSynth();
      setIsPlaying(true);
      try {
        localStorage.setItem('patente_study_music', 'true');
      } catch {}
    } else {
      stopAmbientSynth();
      setIsPlaying(false);
      try {
        localStorage.setItem('patente_study_music', 'false');
      } catch {}
    }
  };

  // Auto-ducking when Italian speech synthesis is speaking
  useEffect(() => {
    const handleSpeechCheck = () => {
      if (!gainNodeRef.current || !audioCtxRef.current) return;
      const ctx = audioCtxRef.current;
      if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
        gainNodeRef.current.gain.setTargetAtTime(0.01, ctx.currentTime, 0.1); // fade down during audio quiz read
      } else {
        gainNodeRef.current.gain.setTargetAtTime(isPlaying ? 0.08 : 0, ctx.currentTime, 0.3); // fade back up gently
      }
    };

    const interval = setInterval(handleSpeechCheck, 200);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Clean up
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch {}
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={togglePlay}
      className={`py-1.5 px-2.5 sm:px-3 rounded-xl border text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm ${
        isPlaying
          ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700'
      }`}
      title={isPlaying ? 'Click to Stop Background Study Music' : 'Click to Play Relaxing Study Music (432Hz Focus)'}
    >
      {isPlaying ? (
        <>
          <span className="flex items-center gap-0.5 h-3">
            <span className="w-1 h-2.5 bg-amber-500 rounded-full animate-bounce" />
            <span className="w-1 h-3.5 bg-amber-600 rounded-full animate-pulse" />
            <span className="w-1 h-2 bg-amber-500 rounded-full animate-bounce" />
          </span>
          <Volume2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
          <span className="hidden sm:inline">Music ON</span>
        </>
      ) : (
        <>
          <Music className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span className="hidden sm:inline">Study Music</span>
        </>
      )}
    </button>
  );
};
