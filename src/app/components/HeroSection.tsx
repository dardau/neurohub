'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';
import ContactLinks from '@/components/ContactLinks';

const stats = [
  { value: '237 000+', label: 'детей с особыми потребностями в РК' },
  { value: '81', label: 'профильный центр на всю страну' },
  { value: '0', label: 'локализованных ИИ-решений (KZ/RU)' },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center pt-28 pb-12 overflow-hidden hero-gradient tech-grid"
    >
      <div className="relative z-10 max-w-7xl mx-auto px-5 w-full flex-1 flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col gap-6 text-left">
            <span className="inline-flex w-fit items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 border border-primary/15 text-xs font-semibold text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Доступно для пилотного тестирования
            </span>

            <h1 className="text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.12] tracking-tight text-foreground">
              Заполняем{' '}
              <span className="gradient-text">165 часов</span>
              <br />
              терапевтического вакуума
            </h1>

            <p className="text-base md:text-lg text-muted-foreground max-w-lg leading-relaxed">
              Phygital-экосистема для непрерывной реабилитации детей с РАС, СДВГ и ЗПР.
              Домашние игры превращаются в объективные медицинские данные для врачей —
              без поездок в клинику.
            </p>

            <div className="flex flex-col items-start gap-4 pt-1">
              <a href="#cta" className="btn-primary text-base px-8 py-3.5">
                Запросить ранний доступ
              </a>
              <ContactLinks variant="prominent" direction="col" className="pl-0.5" />
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-end min-h-[320px] sm:min-h-[380px]">
            <div className="relative w-full max-w-md">
              <div className="rounded-2xl border border-border bg-white shadow-lg overflow-hidden -rotate-1">
                <div className="bg-muted px-4 py-2.5 border-b border-border flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <span className="w-2 h-2 rounded-full bg-green-400" />
                  <span className="text-[10px] text-muted-foreground ml-2 font-medium">
                    Кабинет врача · SaaS
                  </span>
                </div>
                <AppImage
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_1bc8f135a-1767952371596.png"
                  alt="Doctor dashboard on tablet with patient analytics"
                  width={600}
                  height={400}
                  className="w-full h-48 sm:h-56 object-cover"
                  priority
                />
                <div className="p-4 space-y-2">
                  <div className="flex justify-between text-xs font-medium text-muted-foreground">
                    <span>Пациенты</span>
                    <span className="text-primary">12 активных</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full w-[72%] bg-primary rounded-full" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-1">
                    {['Вовлечённость', 'Речь', 'Моторика'].map((l) => (
                      <div key={l} className="bg-secondary rounded-lg p-2 text-center">
                        <div className="text-[10px] text-muted-foreground">{l}</div>
                        <div className="text-sm font-semibold text-primary">↑</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-4 -right-2 sm:right-0 w-[52%] rounded-2xl border border-border bg-white shadow-xl overflow-hidden rotate-2 z-10">
                <div className="bg-primary px-3 py-1.5">
                  <span className="text-[10px] font-semibold text-white">Игра ребёнка</span>
                </div>
                <AppImage
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_1d550e2eb-1775036050748.png"
                  alt="Child development game on smartphone"
                  width={300}
                  height={400}
                  className="w-full h-36 sm:h-44 object-cover"
                />
                <div className="p-3 flex items-center gap-2">
                  <span className="text-lg">🚀</span>
                  <div>
                    <p className="text-xs font-semibold text-foreground">Улыбнись!</p>
                    <p className="text-[10px] text-muted-foreground">+15 очков</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-14 lg:mt-16">
          {stats.map((stat) => (
            <div key={stat.value} className="glass-card rounded-2xl p-5 text-center">
              <p className="text-2xl sm:text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-2 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
