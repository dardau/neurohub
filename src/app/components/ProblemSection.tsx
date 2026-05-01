'use client';

import React, { useEffect, useRef } from 'react';

const problems = [
  {
    id: 1,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: 'Нехватка специалистов',
    desc: 'На 1 дефектолога в СНГ приходится более 2 000 детей. Очереди в клиники — от 3 до 12 месяцев.',
    span: 'col-span-2 md:col-span-1 lg:col-span-2',
    dark: true,
  },
  {
    id: 2,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'Нет персонализации',
    desc: 'Шаблонные программы не учитывают динамику конкретного ребёнка.',
    span: 'col-span-2 md:col-span-1',
    dark: false,
  },
  {
    id: 3,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Нет аналитики',
    desc: 'Родители и врачи не видят реального прогресса между сессиями.',
    span: 'col-span-2 md:col-span-1',
    dark: false,
  },
  {
    id: 4,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Высокая стоимость',
    desc: 'Частная терапия — от 15 000 ₸ за сессию. Большинство семей не могут позволить.',
    span: 'col-span-2 md:col-span-1',
    dark: false,
  },
  {
    id: 5,
    icon: (
      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Дети не вовлечены',
    desc: 'Традиционные упражнения скучны — дети теряют мотивацию уже на 2-й неделе.',
    span: 'col-span-2 md:col-span-1',
    dark: false,
  },
];

export default function ProblemSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

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
      { threshold: 0.12 }
    );
    cardsRef.current.forEach((card) => card && observer.observe(card));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="problem" ref={sectionRef} className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-700 tracking-widest text-primary uppercase px-4 py-2 bg-secondary rounded-full mb-4">
            Проблема
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-900 text-foreground leading-tight">
            Система реабилитации
            <br />
            <span className="gradient-text">сломана</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Миллионы детей в СНГ не получают необходимой помощи. Вот почему.
          </p>
        </div>

        {/* Bento grid — 5 cards
            Row 1: [col-1-2: card1 cs-2] [col-3: card2 cs-1]
            Row 2: [col-1: card3 cs-1]   [col-2: card4 cs-1] [col-3: card5 cs-1]
        */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1 — spans 2 cols on md+ */}
          <div
            ref={(el) => { cardsRef.current[0] = el; }}
            className="md:col-span-2 bg-foreground text-white rounded-3xl p-8 card-hover border border-transparent"
            style={{ opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-5 text-accent">
              {problems[0].icon}
            </div>
            <h3 className="font-display text-2xl font-700 mb-3">{problems[0].title}</h3>
            <p className="text-white/70 leading-relaxed">{problems[0].desc}</p>
            <div className="mt-6 grid grid-cols-3 gap-4">
              {[
                { v: '2 000+', l: 'детей/специалист' },
                { v: '12 мес', l: 'очередь' },
                { v: '67%', l: 'без помощи' },
              ].map((s) => (
                <div key={s.l} className="bg-white/5 rounded-2xl p-3 text-center">
                  <div className="font-display text-xl font-900 text-accent">{s.v}</div>
                  <div className="text-xs text-white/60 mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 2 */}
          <div
            ref={(el) => { cardsRef.current[1] = el; }}
            className="bg-secondary rounded-3xl p-8 card-hover border border-border"
            style={{ opacity: 1, transform: 'translateY(0)', transition: 'opacity 0.7s 0.1s ease, transform 0.7s 0.1s ease' }}
          >
            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center mb-5 text-primary">
              {problems[1].icon}
            </div>
            <h3 className="font-display text-xl font-700 text-foreground mb-3">{problems[1].title}</h3>
            <p className="text-muted-foreground leading-relaxed text-sm">{problems[1].desc}</p>
          </div>

          {/* Cards 3-5 */}
          {problems.slice(2).map((p, i) => (
            <div
              key={p.id}
              ref={(el) => { cardsRef.current[i + 2] = el; }}
              className="bg-white rounded-3xl p-8 card-hover border border-border"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: `opacity 0.7s ${(i + 2) * 0.1}s ease, transform 0.7s ${(i + 2) * 0.1}s ease`,
              }}
            >
              <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-5 text-primary">
                {p.icon}
              </div>
              <h3 className="font-display text-xl font-700 text-foreground mb-3">{p.title}</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}