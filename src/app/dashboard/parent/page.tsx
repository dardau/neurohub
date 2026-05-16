'use client';

import React, { useState } from 'react';
import {
  Home,
  Calendar,
  BookOpen,
  MessageCircle,
  Settings,
  TrendingUp,
  CheckCircle2,
  Sparkles,
  Brain,
  Target,
  ArrowRight,
  AlertCircle,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import DashboardShell, { NavItem } from '@/components/dashboard/DashboardShell';
import SosModal from '@/components/dashboard/SosModal';

const NAV: NavItem[] = [
  { label: 'Обзор', href: '/dashboard/parent', Icon: Home, active: true },
  { label: 'Расписание', href: '/dashboard/parent', Icon: Calendar },
  { label: 'Дневник', href: '/dashboard/parent', Icon: BookOpen },
  { label: 'Чат с врачом', href: '/dashboard/parent', Icon: MessageCircle },
  { label: 'Настройки', href: '/dashboard/parent', Icon: Settings },
];

const WEEKLY_PROGRESS = [
  { day: 'Пн', value: 42 },
  { day: 'Вт', value: 58 },
  { day: 'Ср', value: 51 },
  { day: 'Чт', value: 67 },
  { day: 'Пт', value: 74 },
  { day: 'Сб', value: 82 },
  { day: 'Вс', value: 78 },
];

const SKILLS = [
  { label: 'Речь', value: 72, delta: '+8%' },
  { label: 'Внимание', value: 65, delta: '+5%' },
  { label: 'Моторика', value: 81, delta: '+3%' },
];

const TODAY_TASKS = [
  {
    Icon: Sparkles,
    title: 'Артикуляционная разминка',
    meta: '5 мин · Речевой модуль',
    body: 'Повторите 6 упражнений из видео-карточки перед основным занятием.',
    color: 'bg-teal-50 text-primary',
  },
  {
    Icon: Brain,
    title: 'Игра «Найди пару»',
    meta: '10 мин · Когнитивный модуль',
    body: 'Совместная игра на развитие памяти и распознавания эмоций.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    Icon: Target,
    title: 'Прогулка с заданием',
    meta: '15 мин · Сенсорная интеграция',
    body: 'Найдите 3 предмета по списку: красный, мягкий, шершавый.',
    color: 'bg-cyan-50 text-cyan-600',
  },
];

export default function ParentDashboard() {
  const [sosOpen, setSosOpen] = useState(false);
  const [done, setDone] = useState<Record<number, boolean>>({});

  const toggle = (i: number) => setDone((d) => ({ ...d, [i]: !d[i] }));

  return (
    <DashboardShell
      role="Родитель"
      userName="Айгерим К."
      userMeta="Мама Алихана, 7 лет"
      navItems={NAV}
      rightSlot={
        <button
          type="button"
          onClick={() => setSosOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition-all hover:-translate-y-0.5"
        >
          <AlertCircle className="w-4 h-4" />
          SOS-помощь
        </button>
      }
    >
      <div className="flex items-start justify-between flex-wrap gap-4 mb-7">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-graphite">
            Обзор недели
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Профиль ребёнка · Алихан К., 7 лет · Программа «Речь + Внимание»
          </p>
        </div>

        <button
          type="button"
          onClick={() => setSosOpen(true)}
          className="lg:hidden inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-semibold shadow-md shadow-red-500/20 transition-all"
        >
          <AlertCircle className="w-4 h-4" />
          SOS-помощь
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
        {/* Weekly chart */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-border p-5 md:p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-graphite">
                Прогресс за неделю
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Среднее вовлечение в ежедневные задания
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary text-primary text-xs font-semibold">
              <TrendingUp className="w-3.5 h-3.5" />
              +12% за 7 дней
            </div>
          </div>

          <div className="h-56 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={WEEKLY_PROGRESS} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="parentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#14B8A6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748B', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94A3B8', fontSize: 11 }}
                  width={28}
                  domain={[0, 100]}
                />
                <Tooltip
                  cursor={{ stroke: '#14B8A6', strokeOpacity: 0.2 }}
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #E8ECF0',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`${v}%`, 'Вовлечение']}
                  labelStyle={{ color: '#1E293B', fontWeight: 600 }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#0D9488"
                  strokeWidth={2.5}
                  fill="url(#parentGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skills */}
        <div className="rounded-2xl bg-white border border-border p-5 md:p-6 shadow-sm">
          <h2 className="text-base md:text-lg font-semibold text-graphite mb-1">
            Динамика навыков
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Относительно прошлой недели</p>

          <ul className="space-y-4">
            {SKILLS.map((s) => (
              <li key={s.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium text-foreground">{s.label}</span>
                  <span className="text-xs font-semibold text-primary">{s.delta}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                    style={{ width: `${s.value}%` }}
                  />
                </div>
                <div className="flex justify-end">
                  <span className="text-[11px] text-muted-foreground mt-1">{s.value} / 100</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Today's tasks */}
      <div className="rounded-2xl bg-white border border-border p-5 md:p-6 shadow-sm">
        <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
          <div>
            <h2 className="text-base md:text-lg font-semibold text-graphite">Задания на сегодня</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              3 микро-задания · ~30 минут совместной работы
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted text-xs font-medium text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Выполнено {Object.values(done).filter(Boolean).length} из 3
          </span>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {TODAY_TASKS.map((t, i) => {
            const isDone = !!done[i];
            return (
              <li
                key={t.title}
                className={`rounded-xl border p-4 md:p-5 transition-all ${
                  isDone
                    ? 'border-primary/40 bg-secondary/40'
                    : 'border-border bg-white hover:border-primary/30 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.color}`}
                  >
                    <t.Icon className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-primary border-primary text-white'
                        : 'border-border hover:border-primary'
                    }`}
                    aria-label={isDone ? 'Снять отметку' : 'Отметить выполненным'}
                  >
                    {isDone && <CheckCircle2 className="w-4 h-4" strokeWidth={2.5} />}
                  </button>
                </div>
                <p className="text-xs font-medium text-muted-foreground mb-1">{t.meta}</p>
                <h3
                  className={`text-sm font-semibold mb-1.5 ${
                    isDone ? 'text-primary line-through' : 'text-graphite'
                  }`}
                >
                  {t.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t.body}</p>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:gap-2 transition-all"
                >
                  Открыть карточку
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <SosModal open={sosOpen} onClose={() => setSosOpen(false)} />
    </DashboardShell>
  );
}
