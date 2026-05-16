'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Camera, Hand, LifeBuoy } from 'lucide-react';

import MotorDemo from './demos/MotorDemo';
import SosDemo from './demos/SosDemo';
import VisionDemo from './demos/VisionDemo';

type DemoTab = 'vision' | 'motor' | 'sos';

const tabs: {
  id: DemoTab;
  label: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  {
    id: 'vision',
    label: 'Тест Computer Vision',
    description: 'Камера и распознавание мимики',
    Icon: Camera,
  },
  {
    id: 'motor',
    label: 'Трекинг моторики',
    description: 'Спираль с метриками точности',
    Icon: Hand,
  },
  {
    id: 'sos',
    label: 'Кнопка SOS',
    description: 'Сценарии для родителя',
    Icon: LifeBuoy,
  },
];

export default function InteractiveDemoSection() {
  const [activeTab, setActiveTab] = useState<DemoTab>('vision');
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="demo"
      ref={ref}
      className="relative py-24 bg-gradient-to-b from-secondary/40 via-white to-secondary/40 overflow-hidden"
    >
      <div className="absolute inset-0 tech-grid opacity-40 pointer-events-none" />

      <div
        className={`relative max-w-6xl mx-auto px-5 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-xs font-semibold text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Живая демонстрация
          </span>
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-foreground leading-tight">
            Оцените технологии NeuroHub в один клик
          </h2>
          <p className="mt-3 text-muted-foreground">
            Выберите сценарий слева — справа откроется мини-симуляция. Данные не сохраняются и не
            покидают ваш браузер.
          </p>
        </div>

        <div className="relative rounded-3xl bg-white shadow-2xl ring-1 ring-border overflow-hidden">
          <div className="absolute -inset-2 bg-gradient-to-br from-primary/20 via-accent/10 to-transparent rounded-[2rem] blur-2xl -z-10" />

          <div className="bg-gradient-to-b from-muted to-muted/70 px-4 py-3 flex items-center gap-2 border-b border-border">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
            <div className="ml-3 flex-1 max-w-xs">
              <div className="bg-white/70 rounded-md px-3 py-1 border border-border/70 text-[11px] font-medium text-muted-foreground flex items-center gap-2">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-primary"
                >
                  <path
                    d="M12 17v-3m0-7v3m0-3a4 4 0 110 8 4 4 0 010-8z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                neurohub.ai/demo
              </div>
            </div>
            <span className="hidden md:inline text-[11px] text-muted-foreground/80 font-medium">
              интерактивная симуляция
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] min-h-[500px]">
            <nav className="border-b md:border-b-0 md:border-r border-border bg-secondary/30 p-3 md:p-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
              {tabs.map((tab) => {
                const Icon = tab.Icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`group text-left rounded-xl p-3 md:p-4 transition-all flex items-start gap-3 shrink-0 md:shrink min-w-[220px] md:min-w-0 border-l-4 ${
                      isActive
                        ? 'bg-primary/10 border-primary'
                        : 'border-transparent bg-white/50 hover:bg-white'
                    }`}
                  >
                    <span
                      className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'bg-secondary text-primary group-hover:bg-primary/15'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span
                        className={`text-sm font-semibold leading-tight ${
                          isActive ? 'text-primary' : 'text-foreground'
                        }`}
                      >
                        {tab.label}
                      </span>
                      <span className="text-[11px] text-muted-foreground leading-snug">
                        {tab.description}
                      </span>
                    </span>
                  </button>
                );
              })}

              <div className="hidden md:block mt-auto pt-4 border-t border-border/60">
                <p className="text-[11px] text-muted-foreground/80 leading-relaxed">
                  Демо работает в браузере — камера и рисунок не передаются на сервер.
                </p>
              </div>
            </nav>

            <div key={activeTab} className="relative animate-in fade-in duration-300">
              {activeTab === 'vision' && <VisionDemo />}
              {activeTab === 'motor' && <MotorDemo />}
              {activeTab === 'sos' && <SosDemo />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
