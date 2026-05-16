'use client';

import React from 'react';
import Link from 'next/link';
import { Rocket, Sparkles, Music, ArrowLeft, Star } from 'lucide-react';

const GAMES = [
  {
    title: 'Космический маршрут',
    subtitle: 'Помоги ракете пролететь сквозь звёзды',
    Icon: Rocket,
    bg: 'from-teal-400 to-cyan-500',
    deco: '🚀',
  },
  {
    title: 'Умное зеркало',
    subtitle: 'Покажи эмоцию — зеркало угадает',
    Icon: Sparkles,
    bg: 'from-emerald-400 to-teal-500',
    deco: '✨',
  },
  {
    title: 'Музыкальный лес',
    subtitle: 'Собери мелодию из голосов животных',
    Icon: Music,
    bg: 'from-cyan-400 to-sky-500',
    deco: '🎵',
  },
];

export default function ChildApp() {
  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #ECFEFF 0%, #F0FDFA 50%, #FFFFFF 100%)',
      }}
    >
      <div
        className="absolute -top-32 -left-24 w-[460px] h-[460px] rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #5EEAD4 0%, transparent 70%)' }}
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -right-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #67E8F9 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative z-10 max-w-5xl mx-auto px-5 py-8 md:py-12">
        <div className="flex items-center justify-between mb-10">
          <Link
            href="/login"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-white/70 backdrop-blur-sm border border-border rounded-full px-3 py-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Выйти
          </Link>

          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-border rounded-full px-3 py-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-graphite">128 звёзд</span>
          </div>
        </div>

        {/* AI Avatar greeting */}
        <section className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-xl p-6 md:p-8 mb-10 md:mb-12">
          <div className="flex items-center gap-5 md:gap-6">
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-gradient-to-br from-teal-400 via-cyan-400 to-emerald-400 flex items-center justify-center text-4xl md:text-5xl shadow-lg">
                <span aria-hidden>🤖</span>
              </div>
              <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-400 border-4 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                Робот Нейро
              </p>
              <h1 className="text-2xl md:text-4xl font-bold text-graphite leading-tight mb-2">
                Привет, друг! Что будем делать сегодня?
              </h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Выбери игру — и мы отправимся в приключение!
              </p>
            </div>
          </div>
        </section>

        {/* Game tiles */}
        <section>
          <h2 className="text-lg md:text-xl font-semibold text-graphite mb-5">Мои игры</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {GAMES.map((g) => (
              <button
                key={g.title}
                type="button"
                className={`group relative overflow-hidden rounded-3xl text-left text-white shadow-xl bg-gradient-to-br ${g.bg} p-6 md:p-7 min-h-[200px] md:min-h-[240px] focus:outline-none focus:ring-4 focus:ring-white/60 transition-all hover:-translate-y-1 hover:shadow-2xl`}
              >
                <div className="absolute top-3 right-3 text-3xl md:text-4xl opacity-80 group-hover:scale-110 transition-transform">
                  {g.deco}
                </div>
                <div className="absolute -bottom-12 -right-8 w-40 h-40 rounded-full bg-white/15 blur-2xl" />
                <div className="absolute -top-8 -left-6 w-32 h-32 rounded-full bg-white/10 blur-2xl" />

                <div className="relative flex flex-col h-full">
                  <div className="w-12 h-12 rounded-2xl bg-white/25 backdrop-blur-sm flex items-center justify-center mb-auto">
                    <g.Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl md:text-2xl font-bold mb-1.5 drop-shadow-sm">
                      {g.title}
                    </h3>
                    <p className="text-sm text-white/90 leading-snug">{g.subtitle}</p>
                  </div>

                  <div className="mt-5 inline-flex items-center gap-2 self-start px-4 py-2 rounded-full bg-white text-graphite text-sm font-semibold shadow-md">
                    Играть
                    <span aria-hidden>→</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground mt-10">
          Нажми на любую игру, чтобы начать
        </p>
      </div>
    </main>
  );
}
