'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

type Phase = 'intro' | 'playing' | 'result';

interface Target {
  id: number;
  x: number;
  y: number;
  bornAt: number;
  size: number;
}

const GAME_DURATION = 30;
const TARGET_LIFETIME = 1600;
const SPAWN_INTERVAL = 750;

interface Props {
  onClose: () => void;
}

export default function MotorGameModal({ onClose }: Props) {
  const [phase, setPhase] = useState<Phase>('intro');
  const [score, setScore] = useState(0);
  const [misses, setMisses] = useState(0);
  const [taps, setTaps] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(GAME_DURATION);
  const [targets, setTargets] = useState<Target[]>([]);
  const [combo, setCombo] = useState(0);

  const areaRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);
  const spawnRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cleanupRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimers = useCallback(() => {
    if (spawnRef.current) clearInterval(spawnRef.current);
    if (tickRef.current) clearInterval(tickRef.current);
    if (cleanupRef.current) clearInterval(cleanupRef.current);
    spawnRef.current = null;
    tickRef.current = null;
    cleanupRef.current = null;
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', k);
    return () => {
      window.removeEventListener('keydown', k);
      clearTimers();
    };
  }, [onClose, clearTimers]);

  const spawnTarget = useCallback(() => {
    const area = areaRef.current;
    if (!area) return;
    const rect = area.getBoundingClientRect();
    const size = 44 + Math.random() * 16;
    const margin = size / 2 + 8;
    const x = margin + Math.random() * Math.max(1, rect.width - margin * 2);
    const y = margin + Math.random() * Math.max(1, rect.height - margin * 2);
    idRef.current += 1;
    setTargets((prev) => [...prev, { id: idRef.current, x, y, bornAt: performance.now(), size }]);
  }, []);

  const startGame = useCallback(() => {
    clearTimers();
    setScore(0);
    setMisses(0);
    setTaps(0);
    setCombo(0);
    setSecondsLeft(GAME_DURATION);
    setTargets([]);
    setPhase('playing');

    spawnRef.current = setInterval(spawnTarget, SPAWN_INTERVAL);
    setTimeout(spawnTarget, 100);

    cleanupRef.current = setInterval(() => {
      const now = performance.now();
      setTargets((prev) => {
        const expired = prev.filter((t) => now - t.bornAt >= TARGET_LIFETIME);
        if (expired.length > 0) {
          setMisses((m) => m + expired.length);
          setCombo(0);
        }
        return prev.filter((t) => now - t.bornAt < TARGET_LIFETIME);
      });
    }, 200);

    tickRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearTimers();
          setTargets([]);
          setPhase('result');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, [clearTimers, spawnTarget]);

  const handleHit = useCallback((id: number, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setTargets((prev) => prev.filter((t) => t.id !== id));
    setScore((s) => s + 1);
    setTaps((t) => t + 1);
    setCombo((c) => c + 1);
  }, []);

  const handleMiss = useCallback(() => {
    if (phase !== 'playing') return;
    setTaps((t) => t + 1);
    setCombo(0);
  }, [phase]);

  const reset = useCallback(() => {
    clearTimers();
    setPhase('intro');
    setScore(0);
    setMisses(0);
    setTaps(0);
    setCombo(0);
    setTargets([]);
    setSecondsLeft(GAME_DURATION);
  }, [clearTimers]);

  const accuracy = taps === 0 ? 0 : Math.round((score / taps) * 100);
  const reaction =
    score === 0 ? '—' : Math.max(0.2, +(2 - (score / GAME_DURATION) * 1.2).toFixed(2)) + 'с';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="absolute inset-0 bg-foreground/60 backdrop-blur-md" onClick={onClose} />

      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-8 pt-8 pb-4 flex items-start justify-between">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-xs font-700 text-primary uppercase tracking-wider mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Motor AI · Демо
            </div>
            <h3 className="font-display text-2xl font-900 text-foreground">Поймай цель</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Тренировка реакции и зрительно-моторной координации
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors flex-shrink-0 mt-1"
            aria-label="Закрыть"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="px-8 pb-8">
          {phase === 'intro' && (
            <div className="flex flex-col items-center gap-5 py-4">
              <div className="text-6xl select-none">🎯</div>
              <div className="text-center">
                <p className="font-display text-xl font-900 text-foreground mb-2">
                  30 секунд на меткость
                </p>
                <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                  Кружки появляются в случайных местах. Кликни (или коснись) каждый, пока он не
                  исчез. AI измеряет реакцию и моторику.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3 w-full">
                {[
                  { icon: '⏱', text: '30 секунд раунд' },
                  { icon: '🎯', text: 'Точные попадания' },
                  { icon: '⚡', text: 'Скорость реакции' },
                  { icon: '🔥', text: 'Серия комбо' },
                ].map((item) => (
                  <div
                    key={item.text}
                    className="bg-muted rounded-2xl px-4 py-3 flex items-center gap-3"
                  >
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-sm font-600 text-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={startGame}
                className="btn-primary w-full justify-center py-4 text-base mt-2"
              >
                Старт
              </button>
            </div>
          )}

          {phase === 'playing' && (
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-700 text-muted-foreground uppercase tracking-wider">
                    Время
                  </span>
                  <span className="font-display font-900 text-foreground text-lg">
                    {secondsLeft}s
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 bg-secondary rounded-full px-3 py-1">
                    <span>🎯</span>
                    <span className="font-display font-900 text-primary">{score}</span>
                  </span>
                  {combo >= 3 && (
                    <span className="flex items-center gap-1.5 bg-orange-100 text-orange-700 rounded-full px-3 py-1 font-semibold">
                      <span>🔥</span>x{combo}
                    </span>
                  )}
                </div>
              </div>

              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000"
                  style={{ width: `${(secondsLeft / GAME_DURATION) * 100}%` }}
                />
              </div>

              <div
                ref={areaRef}
                onClick={handleMiss}
                className="relative w-full h-72 rounded-2xl bg-gradient-to-br from-secondary via-white to-secondary/60 border-2 border-dashed border-primary/20 overflow-hidden cursor-crosshair select-none"
              >
                {targets.map((t) => {
                  const age = performance.now() - t.bornAt;
                  const lifeFrac = Math.min(1, age / TARGET_LIFETIME);
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={(e) => handleHit(t.id, e)}
                      onTouchStart={(e) => handleHit(t.id, e)}
                      className="absolute rounded-full flex items-center justify-center text-white font-bold shadow-lg active:scale-90 transition-transform"
                      style={{
                        left: t.x - t.size / 2,
                        top: t.y - t.size / 2,
                        width: t.size,
                        height: t.size,
                        background: `radial-gradient(circle at 35% 30%, #14B8A6, #0D9488)`,
                        boxShadow: `0 0 ${20 - lifeFrac * 15}px rgba(13, 148, 136, ${
                          0.5 - lifeFrac * 0.4
                        })`,
                        opacity: 1 - lifeFrac * 0.4,
                      }}
                    >
                      <span
                        className="absolute inset-0 rounded-full border-2 border-white/60"
                        style={{ transform: `scale(${1 - lifeFrac * 0.4})` }}
                      />
                      <span className="text-lg">✕</span>
                    </button>
                  );
                })}
                {targets.length === 0 && (
                  <p className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground/60">
                    Жди появления цели…
                  </p>
                )}
              </div>

              <p className="text-[11px] text-muted-foreground text-center">
                Попаданий {score} · Промахов {misses} · Точность {taps === 0 ? '—' : `${accuracy}%`}
              </p>
            </div>
          )}

          {phase === 'result' && (
            <div className="flex flex-col items-center gap-5 py-4">
              <div className="text-6xl">{accuracy >= 75 ? '🏆' : accuracy >= 50 ? '👏' : '💪'}</div>
              <div className="text-center">
                <p className="font-display text-2xl font-900 text-foreground">
                  {accuracy >= 75
                    ? 'Отличная меткость!'
                    : accuracy >= 50
                      ? 'Хороший результат'
                      : 'Тренируйся ещё!'}
                </p>
                <p className="text-muted-foreground mt-1 text-sm">
                  AI оценил вашу зрительно-моторную координацию
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 w-full">
                <div className="bg-secondary rounded-2xl p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Попадания
                  </p>
                  <p className="font-display text-2xl font-900 text-primary">{score}</p>
                </div>
                <div className="bg-secondary rounded-2xl p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Точность
                  </p>
                  <p className="font-display text-2xl font-900 text-primary">{accuracy}%</p>
                </div>
                <div className="bg-secondary rounded-2xl p-3 text-center">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                    Реакция
                  </p>
                  <p className="font-display text-2xl font-900 text-primary">{reaction}</p>
                </div>
              </div>

              <div className="bg-secondary rounded-2xl px-5 py-4 flex gap-3 items-start w-full">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-primary">💡</span>
                </div>
                <div>
                  <p className="text-xs font-700 text-primary uppercase tracking-wider mb-1">
                    Что измеряет AI
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    Скорость реакции, точность попадания и стабильность серии — основа диагностики
                    мелкой моторики и внимания.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={reset}
                  className="text-sm py-3 px-5 rounded-xl border border-border bg-white hover:bg-muted text-foreground flex-1"
                >
                  Сыграть снова
                </button>
                <button onClick={onClose} className="btn-primary flex-1 justify-center py-3">
                  Готово
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
