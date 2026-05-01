'use client';

import React, { useEffect, useRef } from 'react';

const solutions = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: 'AI-персонализация',
    desc: 'Алгоритм адаптирует программу к профилю, прогрессу и настроению ребёнка в реальном времени.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: 'Геймификация',
    desc: 'Каждое упражнение — это приключение. RPG-механики удерживают вовлечённость на уровне 87%.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Аналитика в реальном времени',
    desc: 'Дашборды для специалистов и родителей: прогресс, сессии, рекомендации — всё в одном месте.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: 'Удалённый доступ',
    desc: 'Занятия из любой точки СНГ. Без очередей, без переездов — только результат.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Кабинет специалиста',
    desc: 'Ведение пациентов, назначение программ, видеосессии и отчёты в профессиональном интерфейсе.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Кабинет родителя',
    desc: 'Прозрачный прогресс ребёнка, домашние задания, общение с терапевтом — без лишних звонков.',
  },
];

export default function SolutionSection() {
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
      { threshold: 0.1 }
    );
    cardsRef.current.forEach((c) => c && observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="solution" className="py-24 bg-muted dot-pattern">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-700 tracking-widest text-primary uppercase px-4 py-2 bg-white rounded-full mb-4 border border-border">
            Решение
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-900 text-foreground leading-tight">
            Всё необходимое
            <br />
            <span className="gradient-text">в одной платформе</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            NeuroHub AI закрывает все пробелы существующей системы — технологично, доступно и эффективно.
          </p>
        </div>

        {/* 6 cards — 3 cols, staggered offsets inspired by Template 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {solutions.map((sol, i) => (
            <div
              key={sol.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="bg-white rounded-3xl p-8 border border-border card-hover flex flex-col gap-4"
              style={{
                opacity: 1,
                transform: `translateY(${i % 3 === 1 ? '0' : '0'})`,
                transition: `opacity 0.6s ${i * 0.1}s ease, transform 0.6s ${i * 0.1}s ease`,
                marginTop: i % 3 === 1 ? '1.5rem' : i % 3 === 2 ? '3rem' : '0',
              }}
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                {sol.icon}
              </div>
              <h3 className="font-display text-xl font-700 text-foreground">{sol.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{sol.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}