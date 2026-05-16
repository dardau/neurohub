'use client';

import React, { useEffect, useState } from 'react';

import InsightPopup from './InsightPopup';

const sosScenarios = {
  tantrum: {
    title: 'Истерика',
    emoji: '😤',
    duration: '5–10 мин',
    steps: [
      'Снизьте стимулы: приглушите свет и уберите лишние звуки.',
      'Дайте «тихий уголок» и предложите знакомый предмет-успокоитель.',
      'Говорите короткими фразами, без дополнительных требований — дождитесь снижения напряжения.',
      'Когда дыхание выровняется — обнимите или предложите воду.',
    ],
  },
  sensory: {
    title: 'Сенсорный перегруз',
    emoji: '🎧',
    duration: '3–7 мин',
    steps: [
      'Уведите ребёнка из шумной среды в спокойное пространство.',
      'Используйте наушники с шумоподавлением или плотное одеяло (по переносимости).',
      'Дышите вместе медленно 4–6 раз, затем предложите одно простое действие.',
    ],
  },
  publicMeltdown: {
    title: 'Срыв в магазине',
    emoji: '🛒',
    duration: '2–5 мин',
    steps: [
      'Не торопитесь увести силой — присядьте на уровень глаз ребёнка.',
      'Назовите эмоцию: «Тебе сейчас тяжело. Я рядом».',
      'Предложите выбор из двух действий: «Выйдем на улицу или сядем у кассы?»',
      'После выхода из ситуации — короткая знакомая активность (видео, игрушка).',
    ],
  },
  sleep: {
    title: 'Сон не идёт',
    emoji: '🌙',
    duration: '15–30 мин',
    steps: [
      'Уберите экраны минимум за 30 минут до сна — переключитесь на спокойное освещение.',
      'Запустите знакомый ритуал: ванна, чистка зубов, книга в одном и том же порядке.',
      'Используйте утяжелённое одеяло или плотные объятия для глубокого давления.',
      'Включите «белый шум» или знакомую медленную мелодию.',
    ],
  },
} as const;

type ScenarioKey = keyof typeof sosScenarios;

export default function SosDemo() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<ScenarioKey | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!active) return;
    setSeconds(0);
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [active]);

  const select = (key: ScenarioKey) => {
    setActive(key);
    setMenuOpen(false);
    setChecked(new Set());
    setInsight('Алгоритм действий за 2 секунды — без поиска в гугле.');
  };

  const toggleStep = (i: number) => {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  const reset = () => {
    setActive(null);
    setInsight(null);
    setChecked(new Set());
  };

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div className="relative h-full min-h-[420px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-red-50/50 to-white">
      {!active ? (
        <>
          {!menuOpen ? (
            <div className="flex flex-col items-center gap-5">
              <div className="relative">
                <span className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(true)}
                  className="relative w-28 h-28 rounded-full bg-red-600 text-white font-display text-lg font-900 shadow-lg shadow-red-600/40 hover:scale-105 active:scale-95 transition-transform"
                >
                  SOS
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center max-w-xs">
                Сценарий родителя: мгновенная первая помощь без поиска в интернете.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2 w-full max-w-sm">
              <p className="text-center text-sm font-600 text-foreground mb-1">Выберите ситуацию</p>
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(sosScenarios) as ScenarioKey[]).map((key) => {
                  const s = sosScenarios[key];
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => select(key)}
                      className="text-left rounded-xl border-2 border-red-200 bg-white hover:bg-red-50 hover:border-red-300 transition-colors p-3 flex flex-col gap-1"
                    >
                      <span className="text-xl">{s.emoji}</span>
                      <span className="text-sm font-semibold text-foreground leading-tight">
                        {s.title}
                      </span>
                      <span className="text-[10px] text-muted-foreground">≈ {s.duration}</span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                className="text-sm text-muted-foreground mt-2"
                onClick={() => setMenuOpen(false)}
              >
                Отмена
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="w-full max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{sosScenarios[active].emoji}</span>
              <h4 className="font-display text-lg font-700 text-red-700">
                {sosScenarios[active].title}
              </h4>
            </div>
            <span className="text-xs font-mono font-semibold text-red-700 bg-red-100 px-2 py-1 rounded">
              {fmt(seconds)}
            </span>
          </div>

          <div className="mb-3 h-1.5 bg-red-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-500 to-red-600 transition-all"
              style={{
                width: `${(checked.size / sosScenarios[active].steps.length) * 100}%`,
              }}
            />
          </div>

          <ol className="space-y-2">
            {sosScenarios[active].steps.map((step, i) => {
              const isChecked = checked.has(i);
              return (
                <li key={step}>
                  <button
                    type="button"
                    onClick={() => toggleStep(i)}
                    className={`w-full flex gap-3 rounded-xl p-3 border text-sm text-left transition-colors ${
                      isChecked
                        ? 'bg-green-50 border-green-300 text-muted-foreground line-through'
                        : 'bg-white border-border hover:border-red-300'
                    }`}
                  >
                    <span
                      className={`w-7 h-7 rounded-full font-700 flex items-center justify-center shrink-0 text-xs transition-colors ${
                        isChecked ? 'bg-green-500 text-white' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {isChecked ? '✓' : i + 1}
                    </span>
                    <span className="flex-1 leading-snug">{step}</span>
                  </button>
                </li>
              );
            })}
          </ol>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <button
              type="button"
              className="text-sm py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
              onClick={() => {
                setInsight(
                  'В реальном приложении кнопка свяжет вас с куратором или дежурным специалистом.'
                );
              }}
            >
              Позвать куратора
            </button>
            <button
              type="button"
              className="text-sm py-2.5 rounded-xl border border-border bg-white hover:bg-muted text-foreground"
              onClick={reset}
            >
              Назад
            </button>
          </div>

          {checked.size === sosScenarios[active].steps.length && (
            <div className="mt-3 rounded-xl bg-green-50 border border-green-200 p-3 text-xs text-green-800 text-center font-medium">
              Все шаги выполнены за {fmt(seconds)}. Молодец 💚
            </div>
          )}
        </div>
      )}
      {insight && <InsightPopup text={insight} onClose={() => setInsight(null)} />}
    </div>
  );
}
