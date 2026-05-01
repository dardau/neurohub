'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';

type GamePhase = 'intro' | 'show' | 'input' | 'correct' | 'wrong' | 'complete';

const COLORS = [
  { id: 'red',    label: '🔴', bg: '#FEE2E2', active: '#EF4444', border: '#FECACA' },
  { id: 'blue',   label: '🔵', bg: '#DBEAFE', active: '#3B82F6', border: '#BFDBFE' },
  { id: 'green',  label: '🟢', bg: '#D1FAE5', active: '#10B981', border: '#A7F3D0' },
  { id: 'yellow', label: '🟡', bg: '#FEF3C7', active: '#F59E0B', border: '#FDE68A' },
];

const MAX_LEVEL = 7;

function generateSequence(length: number): string[] {
  return Array.from({ length }, () => COLORS[Math.floor(Math.random() * COLORS.length)].id);
}

interface Props {
  onClose: () => void;
}

export default function CognitiveGameModal({ onClose }: Props) {
  const [phase, setPhase] = useState<GamePhase>('intro');
  const [level, setLevel] = useState(1);
  const [sequence, setSequence] = useState<string[]>([]);
  const [userInput, setUserInput] = useState<string[]>([]);
  const [activeColor, setActiveColor] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [flashIdx, setFlashIdx] = useState(-1);

  const timeoutRefs = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimeouts = useCallback(() => {
    timeoutRefs.current.forEach(clearTimeout);
    timeoutRefs.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, delay: number) => {
    const id = setTimeout(fn, delay);
    timeoutRefs.current.push(id);
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', k);
    return () => { window.removeEventListener('keydown', k); clearTimeouts(); };
  }, [onClose, clearTimeouts]);

  const startLevel = useCallback((lvl: number) => {
    const seq = generateSequence(lvl + 1);
    setSequence(seq);
    setUserInput([]);
    setPhase('show');
    setFlashIdx(-1);

    let delay = 800;
    seq.forEach((colorId, i) => {
      schedule(() => {
        setFlashIdx(i);
        setActiveColor(colorId);
      }, delay);
      delay += 700;
      schedule(() => {
        setActiveColor(null);
      }, delay - 200);
    });
    schedule(() => {
      setFlashIdx(-1);
      setPhase('input');
    }, delay + 200);
  }, [schedule]);

  const handleStart = () => {
    setLevel(1);
    setScore(0);
    startLevel(1);
  };

  const handleColorPress = useCallback((colorId: string) => {
    if (phase !== 'input') return;
    setActiveColor(colorId);
    schedule(() => setActiveColor(null), 300);

    const next = [...userInput, colorId];
    setUserInput(next);

    const idx = next.length - 1;
    if (next[idx] !== sequence[idx]) {
      // Wrong
      schedule(() => {
        setPhase('wrong');
      }, 350);
      return;
    }

    if (next.length === sequence.length) {
      // Correct!
      const pts = level * 10;
      setScore((s) => s + pts);
      schedule(() => {
        setPhase('correct');
      }, 350);
    }
  }, [phase, userInput, sequence, level, schedule]);

  const handleNext = useCallback(() => {
    clearTimeouts();
    if (level >= MAX_LEVEL) {
      setPhase('complete');
    } else {
      const nextLevel = level + 1;
      setLevel(nextLevel);
      startLevel(nextLevel);
    }
  }, [level, startLevel, clearTimeouts]);

  const handleRetry = useCallback(() => {
    clearTimeouts();
    setUserInput([]);
    startLevel(level);
  }, [level, startLevel, clearTimeouts]);

  const handleReset = useCallback(() => {
    clearTimeouts();
    setPhase('intro');
    setLevel(1);
    setScore(0);
    setSequence([]);
    setUserInput([]);
    setActiveColor(null);
  }, [clearTimeouts]);

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
              Cognitive AI · Демо
            </div>
            <h3 className="font-display text-2xl font-900 text-foreground">Игра на память</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Запомни последовательность и повтори
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors flex-shrink-0 mt-1"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 pb-8">
          {/* Status bar */}
          {phase !== 'intro' && (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <span className="text-xs font-700 text-muted-foreground uppercase tracking-wider">Уровень</span>
                <div className="flex gap-1">
                  {Array.from({ length: MAX_LEVEL }).map((_, i) => (
                    <div
                      key={i}
                      className="w-3 h-3 rounded-full transition-all duration-300"
                      style={{
                        background: i < level ? 'linear-gradient(135deg, #028090, #02C39A)' : '#E2EEF0',
                        transform: i === level - 1 ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1">
                <span className="text-sm">⭐</span>
                <span className="font-display font-900 text-primary text-sm">{score}</span>
                <span className="text-xs text-muted-foreground">очков</span>
              </div>
            </div>
          )}

          {/* INTRO */}
          {phase === 'intro' && (
            <div className="flex flex-col items-center gap-5 py-4">
              <div className="text-6xl select-none">🧠</div>
              <div className="text-center">
                <p className="font-display text-xl font-900 text-foreground mb-2">Тренировка памяти</p>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  Запоминай последовательность цветных кружков и повторяй её. Каждый уровень — на один шаг длиннее.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                {[
                  { icon: '👀', text: 'Смотри на цвета' },
                  { icon: '🧠', text: 'Запоминай порядок' },
                  { icon: '👆', text: 'Нажимай по очереди' },
                  { icon: '⭐', text: 'Зарабатывай очки' },
                ].map((item) => (
                  <div key={item.text} className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-600 text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
              <button onClick={handleStart} className="btn-primary w-full justify-center py-4 text-base mt-2">
                Начать игру!
              </button>
            </div>
          )}

          {/* SHOW SEQUENCE */}
          {phase === 'show' && (
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <p className="font-600 text-foreground">Запоминай последовательность</p>
                <p className="text-sm text-muted-foreground mt-1">{sequence.length} элементов</p>
              </div>

              {/* Sequence indicator */}
              <div className="flex gap-2 flex-wrap justify-center">
                {sequence.map((cId, i) => {
                  const col = COLORS.find((c) => c.id === cId)!;
                  return (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 transition-all duration-200 flex items-center justify-center"
                      style={{
                        background: i <= flashIdx ? col.active : col.bg,
                        borderColor: i <= flashIdx ? col.active : col.border,
                        transform: i === flashIdx ? 'scale(1.4)' : 'scale(1)',
                        boxShadow: i === flashIdx ? `0 0 16px ${col.active}88` : 'none',
                      }}
                    />
                  );
                })}
              </div>

              {/* Color grid */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {COLORS.map((col) => (
                  <div
                    key={col.id}
                    className="rounded-2xl h-24 border-2 transition-all duration-200 flex items-center justify-center text-4xl select-none"
                    style={{
                      background: activeColor === col.id ? col.active : col.bg,
                      borderColor: activeColor === col.id ? col.active : col.border,
                      transform: activeColor === col.id ? 'scale(1.06)' : 'scale(1)',
                      boxShadow: activeColor === col.id ? `0 8px 24px ${col.active}55` : 'none',
                    }}
                  >
                    {col.label}
                  </div>
                ))}
              </div>
              <p className="text-sm text-muted-foreground text-center">Смотри внимательно...</p>
            </div>
          )}

          {/* INPUT */}
          {phase === 'input' && (
            <div className="flex flex-col items-center gap-6">
              <div className="text-center">
                <p className="font-600 text-foreground">Твоя очередь!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {userInput.length} / {sequence.length}
                </p>
              </div>

              {/* Progress dots */}
              <div className="flex gap-2 justify-center">
                {sequence.map((cId, i) => {
                  const col = COLORS.find((c) => c.id === cId)!;
                  const filled = i < userInput.length;
                  const correct = filled && userInput[i] === cId;
                  return (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 transition-all duration-200"
                      style={{
                        background: filled ? (correct ? col.active : '#EF4444') : '#F0F7F8',
                        borderColor: filled ? (correct ? col.active : '#EF4444') : '#E2EEF0',
                      }}
                    />
                  );
                })}
              </div>

              {/* Color buttons */}
              <div className="grid grid-cols-2 gap-4 w-full">
                {COLORS.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => handleColorPress(col.id)}
                    className="rounded-2xl h-24 border-2 transition-all duration-150 flex items-center justify-center text-4xl select-none cursor-pointer"
                    style={{
                      background: activeColor === col.id ? col.active : col.bg,
                      borderColor: activeColor === col.id ? col.active : col.border,
                      transform: activeColor === col.id ? 'scale(0.95)' : 'scale(1)',
                      boxShadow: activeColor === col.id ? `0 4px 16px ${col.active}55` : 'none',
                    }}
                  >
                    {col.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* CORRECT */}
          {phase === 'correct' && (
            <div className="flex flex-col items-center gap-5 py-4">
              <div className="text-6xl">🎉</div>
              <div className="text-center">
                <p className="font-display text-2xl font-900 text-accent">Правильно!</p>
                <p className="text-muted-foreground mt-1">+{level * 10} очков</p>
              </div>
              <div className="bg-secondary rounded-2xl px-6 py-4 text-center w-full">
                <p className="text-sm text-muted-foreground mb-1">Всего очков</p>
                <p className="font-display text-3xl font-900 gradient-text">{score}</p>
              </div>
              {level < MAX_LEVEL ? (
                <button onClick={handleNext} className="btn-primary w-full justify-center py-4 text-base">
                  Следующий уровень →
                </button>
              ) : (
                <button onClick={() => setPhase('complete')} className="btn-primary w-full justify-center py-4 text-base">
                  Завершить игру 🏆
                </button>
              )}
            </div>
          )}

          {/* WRONG */}
          {phase === 'wrong' && (
            <div className="flex flex-col items-center gap-5 py-4">
              <div className="text-6xl">😅</div>
              <div className="text-center">
                <p className="font-display text-2xl font-900 text-foreground">Не совсем!</p>
                <p className="text-muted-foreground mt-1">Попробуй ещё раз — память тренируется!</p>
              </div>
              <div className="bg-muted rounded-2xl px-5 py-4 w-full">
                <p className="text-xs text-muted-foreground font-600 uppercase tracking-wider mb-2">Правильная последовательность</p>
                <div className="flex gap-2 flex-wrap">
                  {sequence.map((cId, i) => {
                    const col = COLORS.find((c) => c.id === cId)!;
                    return (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                        style={{ background: col.bg, border: `2px solid ${col.border}` }}
                      >
                        {col.label}
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={handleRetry} className="btn-primary flex-1 justify-center py-3">
                  Попробовать снова
                </button>
                <button onClick={handleReset} className="btn-outline flex-1 justify-center py-3">
                  Начать сначала
                </button>
              </div>
            </div>
          )}

          {/* COMPLETE */}
          {phase === 'complete' && (
            <div className="flex flex-col items-center gap-5 py-4">
              <div className="text-6xl">🏆</div>
              <div className="text-center">
                <p className="font-display text-2xl font-900 text-foreground">Ты прошёл все уровни!</p>
                <p className="text-muted-foreground mt-1">Отличная работа — память тренируется каждый день.</p>
              </div>
              <div className="bg-secondary rounded-2xl px-6 py-5 text-center w-full">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 font-600">Итоговый счёт</p>
                <p className="font-display text-4xl font-900 gradient-text">{score}</p>
                <p className="text-sm text-muted-foreground mt-1">очков из {MAX_LEVEL * (MAX_LEVEL + 1) / 2 * 10} возможных</p>
              </div>
              <div className="flex gap-3 w-full">
                <button onClick={handleReset} className="btn-outline flex-1 justify-center py-3">
                  Играть снова
                </button>
                <button onClick={onClose} className="btn-primary flex-1 justify-center py-3">
                  Закрыть
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
