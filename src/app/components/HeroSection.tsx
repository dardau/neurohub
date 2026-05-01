'use client';

import React, { useEffect, useRef } from 'react';
import AppImage from '@/components/ui/AppImage';

const stats = [
{ value: '$52B', label: 'Объём рынка', sub: 'глобально' },
{ value: '7%', label: 'Ежегодный рост', sub: 'CAGR' },
{ value: '93M+', label: 'Детей нуждаются', sub: 'в реабилитации' },
{ value: '0', label: 'AI-решений', sub: 'в СНГ' }];


export default function HeroSection() {
  const blobRef1 = useRef<HTMLDivElement>(null);
  const blobRef2 = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleMouse = (e: MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      if (blobRef1.current) {
        blobRef1.current.style.transform = `translate(${x * 30}px, ${y * 20}px)`;
      }
      if (blobRef2.current) {
        blobRef2.current.style.transform = `translate(${-x * 20}px, ${-y * 15}px)`;
      }
    };
    const el = containerRef.current;
    el?.addEventListener('mousemove', handleMouse);
    return () => el?.removeEventListener('mousemove', handleMouse);
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden dot-pattern animated-gradient-bg">

      {/* Atmospheric blobs */}
      <div
        ref={blobRef1}
        className="pointer-events-none absolute top-[-80px] right-[-80px] w-[480px] h-[480px] rounded-full opacity-30 blur-3xl transition-transform duration-700"
        style={{ background: 'radial-gradient(circle, #02C39A 0%, #028090 60%, transparent 100%)' }} />

      <div
        ref={blobRef2}
        className="pointer-events-none absolute bottom-[-60px] left-[-60px] w-[360px] h-[360px] rounded-full opacity-20 blur-3xl transition-transform duration-700"
        style={{ background: 'radial-gradient(circle, #028090 0%, #02C39A 50%, transparent 100%)' }} />


      <div className="relative z-10 max-w-7xl mx-auto px-5 w-full">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Left: Text */}
          <div className="lg:col-span-7 flex flex-col gap-7">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-primary/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              <span className="text-xs font-700 tracking-widest text-primary uppercase">
                AI-платформа реабилитации детей
              </span>
            </div>

            <h1 className="font-display text-[clamp(2.8rem,7vw,5.5rem)] font-900 leading-[0.92] tracking-tight text-foreground">
              Реабилитация
              <br />
              <span className="gradient-text italic">нового поколения</span>
              <br />
              для каждого ребёнка
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg leading-relaxed font-400">
              NeuroHub AI — первая платформа в СНГ, которая объединяет искусственный интеллект,
              геймификацию и клиническую экспертизу для детей с ЗРР, ЗПР, РАС и ДЦП.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <a href="#pricing" className="btn-primary">
                Попробовать бесплатно
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
              <a href="#solution" className="btn-outline">
                Узнать больше
              </a>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
              {stats.map((stat) =>
              <div
                key={stat.value}
                className="bg-white/80 backdrop-blur border border-border rounded-2xl p-4 text-center card-hover">

                  <div className="font-display text-2xl font-900 gradient-text">{stat.value}</div>
                  <div className="text-xs font-600 text-foreground mt-1">{stat.label}</div>
                  <div className="text-xs text-muted-foreground">{stat.sub}</div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            {/* Main card */}
            <div className="relative w-full max-w-sm">
              <div className="rounded-3xl overflow-hidden border border-border shadow-2xl teal-glow -rotate-2 hover:rotate-0 transition-transform duration-700">
                <AppImage
                  src="https://img.rocket.new/generatedImages/rocket_gen_img_1bc8f135a-1767952371596.png"
                  alt="Child engaged in therapy session on tablet device in bright clinical setting"
                  width={600}
                  height={700}
                  className="w-full h-80 object-cover"
                  priority />

                <div className="bg-white p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-2xl bg-secondary flex items-center justify-center">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-700 text-foreground">Прогресс Алины, 6 лет</div>
                      <div className="text-xs text-muted-foreground">Речевой модуль · 3 недели</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-[78%] rounded-full" style={{ background: 'linear-gradient(90deg, #028090, #02C39A)' }} />
                    </div>
                    <span className="text-sm font-700 text-primary">78%</span>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl border border-border shadow-lg p-4 floating text-center">
                <div className="font-display text-2xl font-900 text-accent">+47%</div>
                <div className="text-xs text-muted-foreground">речевой прогресс</div>
              </div>

              <div className="absolute -bottom-6 -left-6 bg-primary rounded-2xl shadow-lg p-4 floating-delayed">
                <div className="font-display text-xl font-900 text-white">1 200+</div>
                <div className="text-xs text-primary-foreground/80">активных детей</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}