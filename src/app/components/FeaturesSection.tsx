'use client';

import React, { useEffect, useRef } from 'react';

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    title: 'Дневник развития',
    desc: 'Автоматическое ведение журнала прогресса с графиками и сравнением по неделям.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    title: 'Мониторинг здоровья',
    desc: 'Интеграция с носимыми устройствами, отслеживание сна, активности и самочувствия.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: 'Трекер эмоций',
    desc: 'AI-анализ эмоционального состояния ребёнка через мимику и поведение во время занятий.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: 'RPG-награды',
    desc: 'Система уровней, достижений и персонажей, которая мотивирует детей возвращаться каждый день.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: 'Социальный модуль РАС',
    desc: 'Безопасная среда для развития социальных навыков у детей с расстройствами аутистического спектра.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
    title: 'Мультиязычность СНГ',
    desc: 'Полная поддержка русского, казахского, украинского, узбекского и других языков региона.',
  },
];

export default function FeaturesSection() {
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            el.style.opacity = '1';
            el.style.transform = 'translateY(0) scale(1)';
          }
        });
      },
      { threshold: 0.1 }
    );
    cardsRef.current.forEach((c) => c && observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="features" className="py-24 bg-muted">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-700 tracking-widest text-primary uppercase px-4 py-2 bg-white rounded-full mb-4 border border-border">
            Возможности
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-900 text-foreground leading-tight">
            Инструменты, которых
            <br />
            <span className="gradient-text">ещё не было в СНГ</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Каждая функция разработана совместно с практикующими дефектологами, нейропсихологами и родителями.
          </p>
        </div>

        {/* 6 cards — 3 cols
            Row 1: [Diary cs-1] [Health cs-1] [Emotions cs-1]
            Row 2: [RPG cs-1]   [Social cs-1] [Multilingual cs-1]
        */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <div
              key={feat.title}
              ref={(el) => { cardsRef.current[i] = el; }}
              className="bg-white rounded-3xl p-8 border border-border card-hover relative overflow-hidden"
              style={{
                opacity: 1,
                transform: 'translateY(0) scale(1)',
                transition: `opacity 0.6s ${i * 0.08}s ease, transform 0.6s ${i * 0.08}s ease`,
              }}
            >
              {/* NEW badge */}
              <span className="new-badge absolute top-5 right-5">NEW</span>

              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-primary mb-5">
                {feat.icon}
              </div>
              <h3 className="font-display text-xl font-700 text-foreground mb-3">{feat.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feat.desc}</p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-0 h-1 w-0 transition-all duration-500 group-hover:w-full"
                style={{ background: 'linear-gradient(90deg, #028090, #02C39A)' }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}