'use client';

import React, { useEffect, useRef } from 'react';

const roles = [
  {
    emoji: '👨‍⚕️',
    title: 'Кабинет Врача (SaaS)',
    desc: 'Автоматические ИИ-отчёты по каждому ребёнку, графики вовлечённости и назначение домашней терапии в один клик.',
  },
  {
    emoji: '👩‍👦',
    title: 'Кабинет Родителя',
    desc: 'Трекер прогресса, дневник развития, SOS-система и статистика дня — прозрачность без лишних звонков.',
  },
  {
    emoji: '🧸',
    title: 'Phygital-среда Ребёнка',
    desc: 'Игры выводят в реальность: моторика, поиск предметов в комнате, коммуникация — не «залипание» в экран.',
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
      { threshold: 0.1 },
    );
    cardsRef.current.forEach((c) => c && observer.observe(c));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="ecosystem" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold text-foreground leading-tight">
            Единый цифровой мост
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Трёхсторонняя платформа: данные мгновенно синхронизируются между врачом, родителем и
            ребёнком.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {roles.map((role, i) => (
            <div
              key={role.title}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="bg-white rounded-2xl p-8 border border-border card-hover flex flex-col gap-4"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: `opacity 0.5s ${i * 0.08}s ease`,
              }}
            >
              <span className="text-3xl">{role.emoji}</span>
              <h3 className="text-lg font-semibold text-foreground">{role.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed flex-1">{role.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
