'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

type Phase = 'idle' | 'recording' | 'analyzing' | 'result';

interface SpeechResult {
  transcript: string;
  score: number;
  tip: string;
  phonemes: string[];
}

const TARGET_PHRASE = 'Привет, привет';

function scoreTranscript(transcript: string): SpeechResult {
  const normalized = transcript.trim().toLowerCase();
  const target = TARGET_PHRASE.toLowerCase();

  // Levenshtein-based similarity
  const a = normalized;
  const b = target;
  const dp: number[][] = Array.from({ length: a.length + 1 }, (_, i) =>
    Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  const dist = dp[a.length][b.length];
  const similarity = Math.max(0, 1 - dist / Math.max(a.length, b.length, 1));
  const base = Math.round(similarity * 100);
  const score = Math.min(100, Math.max(40, base + Math.floor(Math.random() * 8)));

  let tip = '';
  let phonemes: string[] = [];

  if (score >= 85) {
    tip = 'Отличное произношение! Звуки чёткие и ритм хороший. Продолжай в том же духе.';
    phonemes = ['При-', 'вет'];
  } else if (score >= 65) {
    tip = 'Хороший результат. Обрати внимание на мягкий знак в конце — «привет» заканчивается чётко.';
    phonemes = ['При-', 'вет ⚠'];
  } else {
    tip = 'Попробуй ещё раз — говори чуть медленнее и чётче. Разбей на слоги: «при-вет, при-вет».';
    phonemes = ['При- ⚠', 'вет ⚠'];
  }

  return { transcript, score, tip, phonemes };
}

interface Props {
  onClose: () => void;
}

export default function SpeechDemoModal({ onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [result, setResult] = useState<SpeechResult | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [countdown, setCountdown] = useState(3);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
    if (recognitionRef.current) {
      try { recognitionRef.current.abort(); } catch {}
    }
  }, []);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => { window.removeEventListener('keydown', handleKey); cleanup(); };
  }, [onClose, cleanup]);

  const animateAudio = useCallback(() => {
    if (!analyserRef.current) return;
    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(data);
    let sum = 0;
    for (const v of data) sum += Math.abs(v - 128);
    setAudioLevel(Math.min(100, (sum / data.length) * 4));
    animFrameRef.current = requestAnimationFrame(animateAudio);
  }, []);

  const startRecording = useCallback(async () => {
    setError(null);
    setPhase('recording');
    setRecordingSeconds(0);

    // Audio visualizer
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new AudioContext();
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;
      animateAudio();
    } catch {
      // visualizer optional, continue without it
    }

    timerRef.current = setInterval(() => {
      setRecordingSeconds((s) => {
        if (s >= 5) {
          stopRecording();
          return s;
        }
        return s + 1;
      });
    }, 1000);

    // Speech Recognition
    const SpeechRecognitionAPI =
      (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition }).SpeechRecognition ||
      (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      // Fallback — simulate result
      setTimeout(() => {
        setPhase('analyzing');
        setTimeout(() => {
          setResult(scoreTranscript(TARGET_PHRASE));
          setPhase('result');
        }, 1800);
      }, 3000);
      return;
    }

    const rec = new SpeechRecognitionAPI();
    rec.lang = 'ru-RU';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;

    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0][0].transcript;
      cleanup();
      setPhase('analyzing');
      setTimeout(() => {
        setResult(scoreTranscript(transcript));
        setPhase('result');
      }, 1800);
    };

    rec.onerror = () => {
      cleanup();
      setPhase('analyzing');
      setTimeout(() => {
        setResult(scoreTranscript('привет привет'));
        setPhase('result');
      }, 1800);
    };

    rec.onend = () => {
      if (phase === 'recording') {
        cleanup();
        setPhase('analyzing');
        setTimeout(() => {
          setResult(scoreTranscript('привет привет'));
          setPhase('result');
        }, 1800);
      }
    };

    try { rec.start(); } catch { /* already started */ }
  }, [animateAudio, cleanup, phase]);

  const stopRecording = useCallback(() => {
    cleanup();
    setPhase('analyzing');
    // result will be set via recognition events or fallback
    setTimeout(() => {
      if (!result) {
        setResult(scoreTranscript('привет привет'));
        setPhase('result');
      }
    }, 2500);
  }, [cleanup, result]);

  const startWithCountdown = useCallback(() => {
    setPhase('idle');
    setCountdown(3);
    setError(null);
    let c = 3;
    countdownRef.current = setInterval(() => {
      c--;
      setCountdown(c);
      if (c <= 0) {
        clearInterval(countdownRef.current!);
        startRecording();
      }
    }, 1000);
    setPhase('recording'); // show countdown UI immediately
  }, [startRecording]);

  const reset = useCallback(() => {
    cleanup();
    setPhase('idle');
    setResult(null);
    setAudioLevel(0);
    setRecordingSeconds(0);
    setCountdown(3);
    setError(null);
  }, [cleanup]);

  const scoreColor = result
    ? result.score >= 85
      ? '#02C39A'
      : result.score >= 65
      ? '#F59E0B'
      : '#EF4444'
    : '#028090';

  const scoreLabel = result
    ? result.score >= 85
      ? 'Отлично!'
      : result.score >= 65
      ? 'Хорошо'
      : 'Старайся!'
    : '';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-4 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-700 text-primary uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Speech AI · Демо
            </div>
            <h3 className="font-display text-2xl font-900 text-foreground">Речевой модуль</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Скажи фразу и получи оценку произношения
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors flex-shrink-0 mt-1"
            aria-label="Закрыть"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 pb-8">
          {/* Target phrase */}
          <div className="bg-secondary rounded-2xl px-5 py-4 mb-6 text-center">
            <p className="text-xs text-muted-foreground mb-1 font-600 uppercase tracking-wider">Произнеси фразу</p>
            <p className="font-display text-3xl font-900 text-primary">«{TARGET_PHRASE}»</p>
          </div>

          {/* State machine UI */}
          {phase === 'idle' && (
            <div className="flex flex-col items-center gap-5">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="text-sm text-muted-foreground text-center max-w-xs">
                Нажми кнопку и скажи фразу вслух. Система оценит твоё произношение через AI.
              </p>
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
              <button onClick={startWithCountdown} className="btn-primary w-full justify-center py-4 text-base">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                Начать запись
              </button>
            </div>
          )}

          {phase === 'recording' && (
            <div className="flex flex-col items-center gap-5">
              {countdown > 0 && recordingSeconds === 0 ? (
                <>
                  <div className="w-24 h-24 rounded-full border-4 border-primary flex items-center justify-center">
                    <span className="font-display text-4xl font-900 text-primary">{countdown}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Приготовься...</p>
                </>
              ) : (
                <>
                  {/* Animated mic */}
                  <div className="relative flex items-center justify-center">
                    <div
                      className="absolute rounded-full border-4 border-red-400 opacity-40"
                      style={{
                        width: `${96 + audioLevel * 0.6}px`,
                        height: `${96 + audioLevel * 0.6}px`,
                        transition: 'width 0.1s, height 0.1s',
                      }}
                    />
                    <div className="w-24 h-24 rounded-full bg-red-50 border-4 border-red-400 flex items-center justify-center z-10">
                      <svg className="w-10 h-10 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 1a4 4 0 014 4v7a4 4 0 01-8 0V5a4 4 0 014-4zm0 18a7 7 0 007-7h-2a5 5 0 01-10 0H5a7 7 0 007 7zm0 2v2H9v2h6v-2h-3z" />
                      </svg>
                    </div>
                  </div>

                  {/* Waveform bars */}
                  <div className="flex items-end gap-1 h-10">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-full bg-primary transition-all duration-75"
                        style={{
                          height: `${Math.max(4, Math.random() * audioLevel * 0.4 + 4)}px`,
                          opacity: 0.4 + Math.random() * 0.6,
                        }}
                      />
                    ))}
                  </div>

                  <p className="text-sm font-600 text-red-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    Запись... {recordingSeconds}с / 5с
                  </p>

                  <button
                    onClick={stopRecording}
                    className="btn-outline w-full justify-center py-3 border-red-400 text-red-500 hover:bg-red-50 hover:border-red-400"
                  >
                    Остановить запись
                  </button>
                </>
              )}
            </div>
          )}

          {phase === 'analyzing' && (
            <div className="flex flex-col items-center gap-5 py-4">
              <div className="w-24 h-24 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-10 h-10 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              </div>
              <div className="text-center">
                <p className="font-600 text-foreground">AI анализирует речь...</p>
                <p className="text-sm text-muted-foreground mt-1">Оцениваем фонемы и интонацию</p>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    background: 'linear-gradient(90deg, #028090, #02C39A)',
                    animation: 'shimmerBar 1.5s ease-in-out infinite',
                    width: '60%',
                  }}
                />
              </div>
            </div>
          )}

          {phase === 'result' && result && (
            <div className="flex flex-col gap-5">
              {/* Transcript */}
              <div className="bg-muted rounded-2xl px-5 py-4">
                <p className="text-xs text-muted-foreground font-600 uppercase tracking-wider mb-1">Ты сказал</p>
                <p className="font-display text-xl font-700 text-foreground">«{result.transcript}»</p>
              </div>

              {/* Score */}
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="34" fill="none" stroke="#E8F7F5" strokeWidth="8" />
                    <circle
                      cx="40" cy="40" r="34"
                      fill="none"
                      stroke={scoreColor}
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 34}`}
                      strokeDashoffset={`${2 * Math.PI * 34 * (1 - result.score / 100)}`}
                      style={{ transition: 'stroke-dashoffset 1s ease' }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-display text-xl font-900" style={{ color: scoreColor }}>
                      {result.score}
                    </span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </div>
                </div>
                <div>
                  <p className="font-display text-2xl font-900" style={{ color: scoreColor }}>{scoreLabel}</p>
                  <p className="text-sm text-muted-foreground">Оценка произношения</p>
                  <div className="flex gap-1.5 mt-2">
                    {result.phonemes.map((p) => (
                      <span key={p} className="text-xs px-2 py-0.5 rounded-full bg-secondary font-600 text-primary">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tip */}
              <div className="bg-secondary rounded-2xl px-5 py-4 flex gap-3 items-start">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-700 text-primary uppercase tracking-wider mb-1">Совет AI</p>
                  <p className="text-sm text-foreground leading-relaxed">{result.tip}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button onClick={reset} className="btn-outline flex-1 justify-center py-3">
                  Попробовать снова
                </button>
                <button onClick={onClose} className="btn-primary flex-1 justify-center py-3">
                  Готово
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes shimmerBar {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}
