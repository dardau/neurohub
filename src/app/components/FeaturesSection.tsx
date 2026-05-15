'use client';

import React, { useEffect, useRef } from 'react';

const advantages = [
  {
    emoji: '🌐',
    title: 'Bilingual ИИ',
    desc: 'Полная поддержка казахского и русского — западные аналоги только на английском.',
  },
  {
    emoji: '🏆',
    title: 'RPG-система наград',
    desc: 'Очки и уровни родители конвертируют в реальные подарки дома — phygital-мотивация.',
  },
  {
    emoji: '📊',
    title: 'Мониторинг здоровья',
    desc: 'Корреляция сна и настроения с результатами игр для врача и семьи.',
  },
  {
    emoji: '🛡️',
    title: 'Защита данных',
    desc: 'Телеметрия шифруется в PostgreSQL и Cloud Storage.',
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
            el.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 },
    );
    cardsRef.current.forEach((c) => c && observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="advantages" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14 max-w-xl mx-auto">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-foreground leading-tight">
            Создано для наших реалий
          </h2>
          <p className="mt-4 text-muted-foreground">
            Преимущества перед Floreo, Akili и Brightline в контексте KZ/RU.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {advantages.map((feat, i) => (
            <div
              key={feat.title}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="rounded-2xl p-6 border border-border bg-muted/30 card-hover"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: `opacity 0.5s ${i * 0.06}s ease`,
              }}
            >
              <span className="text-2xl mb-3 block">{feat.emoji}</span>
              <h3 className="text-base font-semibold text-foreground mb-2">{feat.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
