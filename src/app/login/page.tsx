'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { HeartHandshake, Stethoscope, Sparkles, ArrowRight, ArrowLeft } from 'lucide-react';
import AppLogo from '@/components/ui/AppLogo';

type Role = {
  id: 'parent' | 'doctor' | 'child';
  title: string;
  description: string;
  hint: string;
  href: string;
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  accent: string;
};

const ROLES: Role[] = [
  {
    id: 'parent',
    title: 'Я — Родитель',
    description: 'Отслеживание прогресса и поддержка',
    hint: 'Дневник, задания и SOS-помощь',
    href: '/dashboard/parent',
    Icon: HeartHandshake,
    accent: 'from-teal-50 to-emerald-50',
  },
  {
    id: 'doctor',
    title: 'Я — Врач',
    description: 'Управление терапией и аналитика',
    hint: 'Пациенты, ИИ-метрики, назначения',
    href: '/dashboard/doctor',
    Icon: Stethoscope,
    accent: 'from-emerald-50 to-cyan-50',
  },
  {
    id: 'child',
    title: 'Я — Ребёнок',
    description: 'Интерактивная среда',
    hint: 'Игры и весёлые задания',
    href: '/app/child',
    Icon: Sparkles,
    accent: 'from-cyan-50 to-teal-50',
  },
];

export default function RoleSelectionPage() {
  const router = useRouter();

  return (
    <main className="relative min-h-screen hero-gradient overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-60 pointer-events-none" aria-hidden />
      <div
        className="absolute -top-32 -right-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #5EEAD4 0%, transparent 70%)' }}
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -left-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #99F6E4 0%, transparent 70%)' }}
        aria-hidden
      />

      <div className="relative z-10 max-w-6xl mx-auto px-5 py-10 md:py-14 min-h-screen flex flex-col">
        <div className="flex items-center justify-between mb-10 md:mb-16">
          <Link href="/" className="flex items-center gap-2">
            <AppLogo size={36} />
            <span className="text-lg font-semibold tracking-tight">NeuroHub AI</span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            На главную
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 backdrop-blur-sm border border-border text-xs font-medium text-primary mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Демо-режим
            </span>
            <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-graphite mb-4">
              Добро пожаловать в <span className="gradient-text">Neurohub</span>
            </h1>
            <p className="text-base md:text-lg text-muted-foreground">
              Выберите вашу роль для входа в систему
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
            {ROLES.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => router.push(role.href)}
                className={`group relative text-left rounded-2xl border border-border bg-gradient-to-br ${role.accent} glass-card card-hover p-6 md:p-7 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2`}
              >
                <div className="flex flex-col h-full gap-5">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-border flex items-center justify-center text-primary">
                      <role.Icon className="w-6 h-6" strokeWidth={1.75} />
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                  </div>

                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-graphite mb-1.5">
                      {role.title}
                    </h2>
                    <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-border/70">
                    <span className="text-xs font-medium text-muted-foreground">{role.hint}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-10 md:mt-14 text-center text-xs text-muted-foreground">
          Это демонстрационная сборка. Регистрация и пароли отключены.
        </p>
      </div>
    </main>
  );
}
