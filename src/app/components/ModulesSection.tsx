'use client';

import React, { useEffect, useRef } from 'react';

const modules = [
  {
    tag: 'ЗРР · РАС',
    title: 'Речевой модуль',
    desc: 'ИИ анализирует произношение на KZ/RU на уровне фонем и даёт мгновенную обратную связь.',
    visual: 'wave',
  },
  {
    tag: 'ЗПР',
    title: 'Когнитивный модуль',
    desc: 'Балансировщик сложности: игры на память и логику адаптируются к успехам ребёнка в реальном времени.',
    visual: 'pulse',
  },
  {
    tag: 'ДЦП · РАС',
    title: 'Моторный модуль',
    desc: 'Computer Vision оценивает амплитуду движений и правильность гимнастики через камеру смартфона.',
    visual: 'scan',
  },
];

function ModuleVisual({ type }: { type: string }) {
  if (type === 'wave') {
    return (
      <div className="h-28 flex items-end justify-center gap-1 px-4">
        {[40, 65, 50, 80, 55, 70, 45].map((h, i) => (
          <div
            key={i}
            className="w-2 rounded-full bg-primary/60 animate-pulse"
            style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    );
  }
  if (type === 'scan') {
    return (
      <div className="h-28 relative flex items-center justify-center overflow-hidden rounded-xl bg-secondary mx-4">
        <div className="absolute inset-x-4 h-0.5 bg-accent/80 animate-pulse top-1/2" />
        <div className="w-16 h-20 border-2 border-dashed border-primary/40 rounded-lg" />
      </div>
    );
  }
  return (
    <div className="h-28 flex items-center justify-center gap-3 px-4">
      {[1, 2, 3].map((n) => (
        <div
          key={n}
          className="w-10 h-10 rounded-xl bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-semibold text-sm"
        >
          {n}
        </div>
      ))}
    </div>
  );
}

export default function ModulesSection() {
  const cardsRef = useRef<(HTMLElement | null)[]>([]);

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
      { threshold: 0.15 },
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
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
