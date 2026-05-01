'use client';

import React, { useState } from 'react';
import RegistrationModal from '@/app/components/RegistrationModal';

const plans = [
  {
    id: 'b2b',
    badge: 'B2B',
    title: 'Для клиник',
    subtitle: 'Реабилитационные центры и специалисты',
    price: '15 000',
    period: 'тг / мес',
    desc: 'Полный доступ к платформе для работы с пациентами клиники. Кабинет специалиста, аналитика, интеграции.',
    features: [
      'До 50 активных пациентов',
      'Кабинет специалиста',
      'Все 3 терапевтических модуля',
      'Аналитика и отчёты',
      'Видеосессии с родителями',
      'Приоритетная поддержка',
      'Кастомный брендинг',
      'API-интеграция',
    ],
    cta: 'Подключить клинику',
    dark: true,
  },
  {
    id: 'b2c',
    badge: 'B2C · Freemium',
    title: 'Для семьи',
    subtitle: 'Родители и домашние занятия',
    price: '4 990',
    period: 'тг / мес',
    desc: 'Персонализированная программа для вашего ребёнка дома. Начните бесплатно — первые 14 дней без оплаты.',
    features: [
      'Бесплатный период 14 дней',
      '1 ребёнок',
      'Все 3 терапевтических модуля',
      'Дневник развития',
      'Трекер прогресса',
      'Трекер эмоций',
      'RPG-геймификация',
      'Чат с куратором',
    ],
    cta: 'Попробовать бесплатно',
    dark: false,
  },
];

export default function PricingSection() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'b2b' | 'b2c'>('b2c');

  const handleCta = (planId: 'b2b' | 'b2c') => {
    setSelectedPlan(planId);
    setModalOpen(true);
  };

  return (
    <section id="pricing" className="py-24 bg-muted dot-pattern">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-14">
          <span className="inline-block text-xs font-700 tracking-widest text-primary uppercase px-4 py-2 bg-white rounded-full mb-4 border border-border">
            Тарифы
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-900 text-foreground leading-tight">
            Прозрачные цены
            <br />
            <span className="gradient-text">без скрытых комиссий</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-xl mx-auto">
            Два тарифа — для клиник и для семей. Начните бесплатно, масштабируйтесь по мере роста.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-8 border card-hover flex flex-col gap-6 ${
                plan.dark
                  ? 'bg-foreground text-white border-transparent'
                  : 'bg-white border-border'
              }`}
              style={{
                marginTop: i === 1 ? '1.5rem' : '0',
              }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <span
                    className={`text-xs font-700 tracking-widest uppercase px-3 py-1 rounded-full ${
                      plan.dark ? 'bg-white/10 text-accent' : 'bg-secondary text-primary'
                    }`}
                  >
                    {plan.badge}
                  </span>
                  <h3 className={`font-display text-2xl font-900 mt-3 ${plan.dark ? 'text-white' : 'text-foreground'}`}>
                    {plan.title}
                  </h3>
                  <p className={`text-sm mt-1 ${plan.dark ? 'text-white/60' : 'text-muted-foreground'}`}>
                    {plan.subtitle}
                  </p>
                </div>
              </div>

              <div className="flex items-end gap-1">
                <span className={`font-display text-5xl font-900 ${plan.dark ? 'text-white' : 'text-foreground'}`}>
                  {plan.price} ₸
                </span>
                <span className={`text-sm mb-2 ${plan.dark ? 'text-white/50' : 'text-muted-foreground'}`}>
                  {plan.period}
                </span>
              </div>

              <p className={`text-sm leading-relaxed ${plan.dark ? 'text-white/70' : 'text-muted-foreground'}`}>
                {plan.desc}
              </p>

              <ul className="flex flex-col gap-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm">
                    <svg
                      className={`w-4 h-4 flex-shrink-0 ${plan.dark ? 'text-accent' : 'text-primary'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className={plan.dark ? 'text-white/80' : 'text-foreground'}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCta(plan.id as 'b2b' | 'b2c')}
                className={`w-full py-4 rounded-2xl font-700 text-sm transition-all duration-300 mt-auto ${
                  plan.dark
                    ? 'bg-accent text-white hover:bg-[#01a882] hover:scale-[1.02]'
                    : 'bg-primary text-white hover:bg-[#026d7a] hover:scale-[1.02]'
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          Нужно корпоративное решение?{' '}
          <button
            onClick={() => handleCta('b2b')}
            className="text-primary font-600 hover:underline"
          >
            Свяжитесь с нами
          </button>
        </p>
      </div>

      {modalOpen && (
        <RegistrationModal
          plan={selectedPlan}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}