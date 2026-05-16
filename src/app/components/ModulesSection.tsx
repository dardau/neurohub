'use client';

import React, { useEffect, useRef, useState } from 'react';

import CognitiveGameModal from './CognitiveGameModal';
import MotorGameModal from './MotorGameModal';
import SpeechDemoModal from './SpeechDemoModal';

type DemoKey = 'speech' | 'cognitive' | 'motor';

const modules: {
  tag: string;
  title: string;
  desc: string;
  visual: string;
  demo: DemoKey;
  cta: string;
}[] = [
  {
    tag: 'ЗРР · РАС',
    title: 'Речевой модуль',
    desc: 'ИИ анализирует произношение на KZ/RU на уровне фонем и даёт мгновенную обратную связь.',
    visual: 'wave',
    demo: 'speech',
    cta: 'Записать фразу',
  },
  {
    tag: 'ЗПР',
    title: 'Когнитивный модуль',
    desc: 'Балансировщик сложности: игры на память и логику адаптируются к успехам ребёнка в реальном времени.',
    visual: 'pulse',
    demo: 'cognitive',
    cta: 'Сыграть на память',
  },
  {
    tag: 'ДЦП · РАС',
    title: 'Моторный модуль',
    desc: 'Computer Vision оценивает амплитуду движений и правильность гимнастики через камеру смартфона.',
    visual: 'scan',
    demo: 'motor',
    cta: 'Поймать цели',
  },
];

const WAVE_HEIGHTS = [
  28, 44, 62, 38, 72, 90, 70, 52, 84, 60, 46, 78, 92, 64, 50, 74, 88, 56, 68, 82, 48, 60, 76, 54,
];

function ModuleVisual({ type }: { type: string }) {
  if (type === 'wave') {
    return (
      <div className="h-32 flex items-center justify-center gap-[3px] px-5 bg-gradient-to-b from-secondary/60 to-white relative overflow-hidden">
        <div className="absolute top-3 left-4 text-[10px] font-semibold uppercase tracking-wider text-primary/70">
          STT · KZ/RU · фонема «р»
        </div>
        {WAVE_HEIGHTS.map((h, i) => (
          <div
            key={i}
            className="w-1.5 rounded-full bg-gradient-to-t from-primary to-accent animate-pulse"
            style={{
              height: `${h}%`,
              animationDelay: `${(i % 8) * 0.08}s`,
              animationDuration: `${1 + (i % 5) * 0.15}s`,
              opacity: 0.55 + (h / 100) * 0.45,
            }}
          />
        ))}
        <div className="absolute bottom-2 right-4 px-1.5 py-0.5 rounded bg-primary/15 text-[10px] font-semibold text-primary">
          92% ✓
        </div>
      </div>
    );
  }

  if (type === 'scan') {
    return (
      <div className="h-32 relative flex items-center justify-center overflow-hidden bg-gradient-to-b from-secondary/60 to-white">
        <div className="absolute top-3 left-4 text-[10px] font-semibold uppercase tracking-wider text-primary/70">
          Pose tracking · 5 точек
        </div>
        <svg viewBox="0 0 140 110" className="w-32 h-28">
          <circle
            cx="70"
            cy="20"
            r="6"
            fill="rgb(20 184 166 / 0.18)"
            stroke="#0D9488"
            strokeWidth="1.5"
          >
            <animate attributeName="r" values="6;7.5;6" dur="1.6s" repeatCount="indefinite" />
          </circle>
          <circle
            cx="40"
            cy="55"
            r="5"
            fill="rgb(20 184 166 / 0.18)"
            stroke="#0D9488"
            strokeWidth="1.5"
          >
            <animate
              attributeName="r"
              values="5;6.5;5"
              dur="1.6s"
              begin="0.2s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="100"
            cy="55"
            r="5"
            fill="rgb(20 184 166 / 0.18)"
            stroke="#0D9488"
            strokeWidth="1.5"
          >
            <animate
              attributeName="r"
              values="5;6.5;5"
              dur="1.6s"
              begin="0.4s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="50"
            cy="95"
            r="5"
            fill="rgb(20 184 166 / 0.18)"
            stroke="#0D9488"
            strokeWidth="1.5"
          >
            <animate
              attributeName="r"
              values="5;6.5;5"
              dur="1.6s"
              begin="0.6s"
              repeatCount="indefinite"
            />
          </circle>
          <circle
            cx="90"
            cy="95"
            r="5"
            fill="rgb(20 184 166 / 0.18)"
            stroke="#0D9488"
            strokeWidth="1.5"
          >
            <animate
              attributeName="r"
              values="5;6.5;5"
              dur="1.6s"
              begin="0.8s"
              repeatCount="indefinite"
            />
          </circle>
          <polyline
            points="70,20 40,55 50,95 90,95 100,55 70,20"
            fill="none"
            stroke="#14B8A6"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="220"
            strokeDashoffset="220"
          >
            <animate
              attributeName="stroke-dashoffset"
              values="220;0;0"
              dur="2.2s"
              repeatCount="indefinite"
            />
          </polyline>
        </svg>
        <div className="absolute bottom-2 right-4 px-1.5 py-0.5 rounded bg-primary/15 text-[10px] font-semibold text-primary">
          амплитуда +18°
        </div>
      </div>
    );
  }

  return (
    <div className="h-32 relative flex items-center justify-center bg-gradient-to-b from-secondary/60 to-white overflow-hidden">
      <div className="absolute top-3 left-4 text-[10px] font-semibold uppercase tracking-wider text-primary/70">
        Adaptive difficulty
      </div>
      <div className="grid grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }).map((_, i) => (
          <div
            key={i}
            className="w-7 h-7 rounded-lg border border-primary/25 bg-primary/10"
            style={{
              animation: 'pulse 1.4s ease-in-out infinite',
              animationDelay: `${i * 0.12}s`,
            }}
          />
        ))}
      </div>
      <div className="absolute bottom-2 right-4 px-1.5 py-0.5 rounded bg-primary/15 text-[10px] font-semibold text-primary">
        уровень 4 / 7
      </div>
    </div>
  );
}

export default function ModulesSection() {
  const cardsRef = useRef<(HTMLElement | null)[]>([]);
  const [openDemo, setOpenDemo] = useState<DemoKey | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.15 }
    );
    cardsRef.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="modules" className="py-24 bg-muted/40">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-foreground leading-tight">
            Три направления адаптивной терапии
          </h2>
          <p className="mt-4 text-muted-foreground">
            Нейросеть подстраивает сложность под каждого ребёнка — от речи до моторики.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {modules.map((mod, i) => (
            <article
              key={mod.title}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="bg-white rounded-2xl border border-border overflow-hidden card-hover flex flex-col"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: `opacity 0.5s ${i * 0.08}s ease`,
              }}
            >
              <ModuleVisual type={mod.visual} />
              <div className="p-6 flex flex-col gap-3 flex-1">
                <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                  {mod.tag}
                </span>
                <h3 className="text-lg font-semibold text-foreground">{mod.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{mod.desc}</p>
                <button
                  type="button"
                  onClick={() => setOpenDemo(mod.demo)}
                  className="mt-2 inline-flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-white font-semibold text-sm transition-colors group"
                >
                  <span className="text-base">▶</span>
                  {mod.cta}
                  <span className="ml-auto text-[10px] uppercase tracking-wider opacity-70 group-hover:opacity-100">
                    Демо
                  </span>
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {openDemo === 'speech' && <SpeechDemoModal onClose={() => setOpenDemo(null)} />}
      {openDemo === 'cognitive' && <CognitiveGameModal onClose={() => setOpenDemo(null)} />}
      {openDemo === 'motor' && <MotorGameModal onClose={() => setOpenDemo(null)} />}
    </section>
  );
}
