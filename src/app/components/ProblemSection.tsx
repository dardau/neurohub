'use client';

import React, { useEffect, useRef } from 'react';

const problems = [
  {
    title: 'Нехватка специалистов',
    desc: 'Очереди 3–6 месяцев и до 25 000 ₸ за сеанс. На 237 000 детей — лишь 81 профильный центр на всю страну.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
  },
  {
    title: 'Откаты в прогрессе',
    desc: '165 часов в неделю ребёнок остаётся без структурированной помощи — навыки, добытые с трудом, теряются.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    title: 'Субъективность оценки',
    desc: 'Динамика измеряется на глаз раз в месяц — без объективных данных трудно понять, что реально работает.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
  },
  {
    title: 'Тревожность родителей',
    desc: 'Дома страшно сделать «не так». Нет понятных инструкций, нет связи со специалистом в моменте.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.8}
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
    ),
  },
];

export default function ProblemSection() {
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
    <section id="problem" className="py-24 bg-[#1E293B] text-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14 max-w-2xl mx-auto">
          <h2 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-tight text-white">
            Что происходит между визитами к врачу?
          </h2>
          <p className="mt-4 text-slate-300 leading-relaxed">
            Система не видит 165 часов «пустого» времени — и семья остаётся один на один с откатами.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((p, i) => (
            <div
              key={p.title}
              ref={(el) => {
                cardsRef.current[i] = el;
              }}
              className="rounded-2xl border border-slate-600/80 bg-slate-800/80 p-6 card-hover"
              style={{
                opacity: 1,
                transform: 'translateY(0)',
                transition: `opacity 0.5s ${i * 0.06}s ease, transform 0.5s ${i * 0.06}s ease`,
              }}
            >
              <div className="w-11 h-11 rounded-xl bg-teal-500/20 text-teal-300 flex items-center justify-center mb-4">
                {p.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2 text-white">{p.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
