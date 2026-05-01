'use client';

import React, { useEffect, useRef } from 'react';

const steps = [
  {
    num: '01',
    title: 'Диагностика',
    desc: 'Первичная оценка уровня развития ребёнка через стандартизированные тесты и опрос родителей.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
  },
  {
    num: '02',
    title: 'AI-анализ',
    desc: 'Нейросеть обрабатывает данные диагностики и строит нейрокогнитивный профиль ребёнка.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    num: '03',
    title: 'Программа',
    desc: 'Специалист получает персонализированный план занятий, который можно скорректировать вручную.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    num: '04',
    title: 'Занятие',
    desc: 'Ребёнок проходит игровые упражнения на планшете. AI адаптирует сложность в реальном времени.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    num: '05',
    title: 'Прогресс',
    desc: 'Родители и специалист видят детальные отчёты: что улучшилось, что требует внимания.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
  },
  {
    num: '06',
    title: 'Коррекция',
    desc: 'AI пересматривает программу каждые 2 недели. Специалист вносит клинические корректировки.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  },
];

export default function HowItWorksSection() {
  const stepsRef = useRef<(HTMLDivElement | null)[]>([]);

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
    stepsRef.current.forEach((s) => s && observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-700 tracking-widest text-primary uppercase px-4 py-2 bg-secondary rounded-full mb-4">
            Как это работает
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-900 text-foreground leading-tight">
            От диагностики
            <br />
            <span className="gradient-text">до результата</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Шесть шагов, которые превращают данные ребёнка в персональный путь развития.
          </p>
        </div>

        {/* 6 steps — 3-col grid, connected by arc line concept */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative">
          {/* Connecting line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[16.67%] right-[16.67%] h-px pointer-events-none" style={{ background: 'linear-gradient(90deg, transparent, #028090 20%, #02C39A 50%, #028090 80%, transparent)' }} />

          {steps.map((step, i) => (
            <div
              key={step.num}
              ref={(el) => { stepsRef.current[i] = el; }}
              className="relative bg-white border border-border rounded-3xl p-8 card-hover group"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: `opacity 0.6s ${i * 0.1}s ease, transform 0.6s ${i * 0.1}s ease`,
                marginTop: i % 3 === 1 ? '1.5rem' : i % 3 === 2 ? '3rem' : '0',
              }}
            >
              {/* Step number */}
              <div className="flex items-center justify-between mb-5">
                <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300">
                  {step.icon}
                </div>
                <span className="font-display text-3xl font-900 text-border group-hover:text-primary transition-colors duration-300">
                  {step.num}
                </span>
              </div>
              <h3 className="font-display text-xl font-700 text-foreground mb-3">{step.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>

              {/* Connector arrow (not last in row) */}
              {i % 3 !== 2 && i !== steps.length - 1 && (
                <div className="hidden lg:flex absolute -right-4 top-10 w-8 h-8 items-center justify-center z-10">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}