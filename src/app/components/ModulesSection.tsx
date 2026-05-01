'use client';

import React, { useEffect, useRef, useState } from 'react';
import AppImage from '@/components/ui/AppImage';
import CognitiveGameModal from '@/app/components/CognitiveGameModal';

const modules = [
{
  tag: 'Speech AI',
  title: 'Речевой модуль',
  desc: 'Нейросеть анализирует речь ребёнка в реальном времени: распознаёт фонемы, оценивает произношение и строит индивидуальный маршрут коррекции. Более 500 адаптивных упражнений для ЗРР и дизартрии.',
  highlights: ['Распознавание фонем', 'Адаптивные упражнения', '500+ заданий', 'Оценка произношения'],
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1bc8f135a-1767952371596.png",
  imageAlt: 'Child speaking into microphone in bright well-lit therapy room with white walls and natural daylight',
  reverse: false
},
{
  tag: 'Cognitive AI',
  title: 'Когнитивный модуль',
  desc: 'Тренировка памяти, внимания и логического мышления через интерактивные игры. AI отслеживает когнитивный профиль и динамически усложняет задания, поддерживая зону ближайшего развития.',
  highlights: ['Память и внимание', 'Логика и мышление', 'Адаптивная сложность', 'ZPD-алгоритм'],
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_1d550e2eb-1775036050748.png",
  imageAlt: 'Child working on puzzle game on bright tablet screen in airy open classroom with large windows',
  reverse: true
},
{
  tag: 'Computer Vision',
  title: 'Моторный модуль',
  desc: 'Computer Vision через камеру планшета анализирует движения ребёнка. Система оценивает координацию, мелкую и крупную моторику, предоставляя биомеханические отчёты специалисту по ДЦП.',
  highlights: ['Анализ движений', 'Мелкая моторика', 'Биомеханика', 'Отчёты для ДЦП'],
  image: "https://img.rocket.new/generatedImages/rocket_gen_img_175bb5476-1777578409545.png",
  imageAlt: 'Child doing hand coordination exercises in bright clinic with sunlight streaming through large windows',
  reverse: false
}];


export default function ModulesSection() {
  const [cognitiveGameOpen, setCognitiveGameOpen] = useState(false);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);

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
      { threshold: 0.15 }
    );
    rowsRef.current.forEach((r) => r && observer.observe(r));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="modules" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <span className="inline-block text-xs font-700 tracking-widest text-primary uppercase px-4 py-2 bg-secondary rounded-full mb-4">
            Модули
          </span>
          <h2 className="font-display text-[clamp(2rem,5vw,3.5rem)] font-900 text-foreground leading-tight">
            Три клинических
            <br />
            <span className="gradient-text">направления</span>
          </h2>
        </div>

        <div className="flex flex-col gap-20">
          {modules.map((mod, i) =>
          <div
            key={mod.tag}
            ref={(el) => {rowsRef.current[i] = el;}}
            className={`grid lg:grid-cols-2 gap-12 items-center ${mod.reverse ? 'lg:direction-rtl' : ''}`}
            style={{
              opacity: 1,
              transform: 'translateY(0)',
              transition: `opacity 0.8s ${i * 0.15}s ease, transform 0.8s ${i * 0.15}s ease`
            }}>

              {/* Text */}
              <div className={`flex flex-col gap-6 ${mod.reverse ? 'lg:order-2' : ''}`}>
                <span className="inline-flex items-center gap-2 text-xs font-700 tracking-widest text-primary uppercase px-3 py-1.5 bg-secondary rounded-full w-fit">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {mod.tag}
                </span>
                <h3 className="font-display text-[clamp(1.8rem,4vw,2.8rem)] font-900 text-foreground leading-tight">
                  {mod.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{mod.desc}</p>
                <div className="grid grid-cols-2 gap-3">
                  {mod.highlights.map((h) =>
                <div key={h} className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-3">
                      <svg className="w-4 h-4 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-sm font-600 text-foreground">{h}</span>
                    </div>
                )}
                </div>
                {mod.tag === 'Cognitive AI' && (
                  <button
                    onClick={() => setCognitiveGameOpen(true)}
                    className="btn-primary w-fit mt-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Сыграть в демо
                  </button>
                )}
              </div>

              {/* Visual */}
              <div className={`relative ${mod.reverse ? 'lg:order-1' : ''}`}>
                <div
                className={`rounded-3xl overflow-hidden border border-border shadow-xl ${mod.reverse ? 'rotate-2' : '-rotate-2'} hover:rotate-0 transition-transform duration-700`}>

                  <AppImage
                  src={mod.image}
                  alt={mod.imageAlt}
                  width={700}
                  height={500}
                  className="w-full h-72 object-cover" />

                  <div className="bg-white p-5 border-t border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                      <span className="text-sm font-600 text-foreground">AI анализирует в реальном времени</span>
                    </div>
                  </div>
                </div>
                {/* Decorative glow */}
                <div
                className="absolute -z-10 inset-4 rounded-3xl blur-2xl opacity-20"
                style={{ background: 'linear-gradient(135deg, #028090, #02C39A)' }} />

              </div>
            </div>
          )}
        </div>
      </div>
      {cognitiveGameOpen && <CognitiveGameModal onClose={() => setCognitiveGameOpen(false)} />}
    </section>);

}