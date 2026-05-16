'use client';

import React, { useMemo, useState } from 'react';
import {
  Home,
  Users,
  ClipboardList,
  BarChart3,
  Settings,
  Search,
  Plus,
  ChevronRight,
  ChevronDown,
  Activity,
  Eye,
  Hand,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from 'recharts';
import DashboardShell, { NavItem } from '@/components/dashboard/DashboardShell';

const NAV: NavItem[] = [
  { label: 'Обзор', href: '/dashboard/doctor', Icon: Home, active: true },
  { label: 'Пациенты', href: '/dashboard/doctor', Icon: Users },
  { label: 'Назначения', href: '/dashboard/doctor', Icon: ClipboardList },
  { label: 'Аналитика', href: '/dashboard/doctor', Icon: BarChart3 },
  { label: 'Настройки', href: '/dashboard/doctor', Icon: Settings },
];

type Status = 'green' | 'yellow' | 'red';

type Patient = {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  status: Status;
  lastVisit: string;
  program: string;
  engagement: number;
  eyeContact: number;
  motor: number;
  trend: { week: string; eng: number; eye: number; mot: number }[];
};

const PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Алихан К.',
    age: 7,
    diagnosis: 'РАС, лёгкая степень',
    status: 'green',
    lastVisit: '14 мая',
    program: 'Речь + Внимание',
    engagement: 78,
    eyeContact: 64,
    motor: 81,
    trend: [
      { week: 'Нед. 1', eng: 52, eye: 40, mot: 60 },
      { week: 'Нед. 2', eng: 58, eye: 47, mot: 67 },
      { week: 'Нед. 3', eng: 64, eye: 55, mot: 72 },
      { week: 'Нед. 4', eng: 70, eye: 60, mot: 76 },
      { week: 'Нед. 5', eng: 78, eye: 64, mot: 81 },
    ],
  },
  {
    id: 'p2',
    name: 'Дария М.',
    age: 6,
    diagnosis: 'СДВГ',
    status: 'yellow',
    lastVisit: '12 мая',
    program: 'Когнитивный модуль',
    engagement: 58,
    eyeContact: 71,
    motor: 65,
    trend: [
      { week: 'Нед. 1', eng: 60, eye: 65, mot: 60 },
      { week: 'Нед. 2', eng: 55, eye: 68, mot: 62 },
      { week: 'Нед. 3', eng: 52, eye: 70, mot: 63 },
      { week: 'Нед. 4', eng: 55, eye: 72, mot: 64 },
      { week: 'Нед. 5', eng: 58, eye: 71, mot: 65 },
    ],
  },
  {
    id: 'p3',
    name: 'Тимур О.',
    age: 5,
    diagnosis: 'ЗПР',
    status: 'red',
    lastVisit: '8 мая',
    program: 'Моторика + Речь',
    engagement: 34,
    eyeContact: 28,
    motor: 41,
    trend: [
      { week: 'Нед. 1', eng: 40, eye: 35, mot: 50 },
      { week: 'Нед. 2', eng: 38, eye: 32, mot: 47 },
      { week: 'Нед. 3', eng: 36, eye: 30, mot: 44 },
      { week: 'Нед. 4', eng: 35, eye: 30, mot: 42 },
      { week: 'Нед. 5', eng: 34, eye: 28, mot: 41 },
    ],
  },
  {
    id: 'p4',
    name: 'Сабина Е.',
    age: 8,
    diagnosis: 'РАС, умеренная',
    status: 'green',
    lastVisit: '15 мая',
    program: 'Социальные навыки',
    engagement: 82,
    eyeContact: 75,
    motor: 70,
    trend: [
      { week: 'Нед. 1', eng: 65, eye: 55, mot: 60 },
      { week: 'Нед. 2', eng: 70, eye: 60, mot: 63 },
      { week: 'Нед. 3', eng: 75, eye: 67, mot: 65 },
      { week: 'Нед. 4', eng: 80, eye: 72, mot: 68 },
      { week: 'Нед. 5', eng: 82, eye: 75, mot: 70 },
    ],
  },
];

const STATUS_META: Record<Status, { dot: string; bg: string; text: string; label: string }> = {
  green: {
    dot: 'bg-emerald-500',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    label: 'Стабильно',
  },
  yellow: {
    dot: 'bg-amber-500',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    label: 'Требует внимания',
  },
  red: {
    dot: 'bg-red-500',
    bg: 'bg-red-50',
    text: 'text-red-700',
    label: 'Регресс',
  },
};

const THERAPY_MODULES = [
  { id: 'speech', label: 'Речевой модуль', desc: 'Артикуляция, фонематический слух' },
  { id: 'cognitive', label: 'Когнитивный модуль', desc: 'Память, внимание, логика' },
  { id: 'motor', label: 'Моторный модуль', desc: 'Крупная и мелкая моторика' },
  { id: 'social', label: 'Социальные навыки', desc: 'Эмоции, коммуникация' },
];

export default function DoctorDashboard() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [assigned, setAssigned] = useState<string | null>(null);

  const selected = useMemo(
    () => PATIENTS.find((p) => p.id === selectedId) || null,
    [selectedId],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PATIENTS;
    return PATIENTS.filter(
      (p) => p.name.toLowerCase().includes(q) || p.diagnosis.toLowerCase().includes(q),
    );
  }, [query]);

  return (
    <DashboardShell
      role="Врач"
      userName="Жанна А."
      userMeta="Детский нейропсихолог"
      navItems={NAV}
    >
      {!selected ? (
        <PatientListView
          patients={filtered}
          query={query}
          setQuery={setQuery}
          onSelect={(id) => setSelectedId(id)}
        />
      ) : (
        <PatientDetailView
          patient={selected}
          onBack={() => {
            setSelectedId(null);
            setAssigned(null);
            setDropdownOpen(false);
          }}
          dropdownOpen={dropdownOpen}
          setDropdownOpen={setDropdownOpen}
          assigned={assigned}
          setAssigned={setAssigned}
        />
      )}
    </DashboardShell>
  );
}

function PatientListView({
  patients,
  query,
  setQuery,
  onSelect,
}: {
  patients: Patient[];
  query: string;
  setQuery: (v: string) => void;
  onSelect: (id: string) => void;
}) {
  const counts = {
    green: patients.filter((p) => p.status === 'green').length,
    yellow: patients.filter((p) => p.status === 'yellow').length,
    red: patients.filter((p) => p.status === 'red').length,
  };

  return (
    <>
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-graphite">
            Мои пациенты
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {patients.length} активных карт · обновлено сегодня
          </p>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" />
          Новый пациент
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Всего" value={patients.length} accent="bg-secondary text-primary" />
        <StatCard label="Стабильно" value={counts.green} accent="bg-emerald-50 text-emerald-700" />
        <StatCard
          label="Внимание"
          value={counts.yellow}
          accent="bg-amber-50 text-amber-700"
        />
        <StatCard label="Регресс" value={counts.red} accent="bg-red-50 text-red-700" />
      </div>

      <div className="rounded-2xl bg-white border border-border shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-border flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по имени или диагнозу"
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-border bg-muted/40 text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-primary transition-all"
            />
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Пациент</th>
                <th className="px-5 py-3">Возраст</th>
                <th className="px-5 py-3">Программа</th>
                <th className="px-5 py-3">Статус</th>
                <th className="px-5 py-3">Последний визит</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => {
                const s = STATUS_META[p.status];
                return (
                  <tr
                    key={p.id}
                    onClick={() => onSelect(p.id)}
                    className="border-t border-border hover:bg-muted/40 cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-secondary text-primary font-semibold flex items-center justify-center text-xs">
                          {p.name.split(' ').map((s) => s[0]).join('')}
                        </div>
                        <div>
                          <p className="font-semibold text-foreground">{p.name}</p>
                          <p className="text-xs text-muted-foreground">{p.diagnosis}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{p.age} лет</td>
                    <td className="px-5 py-4 text-muted-foreground">{p.program}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{p.lastVisit}</td>
                    <td className="px-5 py-4">
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ul className="md:hidden divide-y divide-border">
          {patients.map((p) => {
            const s = STATUS_META[p.status];
            return (
              <li
                key={p.id}
                onClick={() => onSelect(p.id)}
                className="px-5 py-4 hover:bg-muted/40 cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-secondary text-primary font-semibold flex items-center justify-center text-xs">
                      {p.name.split(' ').map((s) => s[0]).join('')}
                    </div>
                    <div>
                      <p className="font-semibold text-foreground text-sm">{p.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {p.age} лет · {p.diagnosis}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{p.program}</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full font-medium ${s.bg} ${s.text}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
                    {s.label}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  return (
    <div className="rounded-2xl bg-white border border-border p-4 shadow-sm">
      <p className="text-xs text-muted-foreground mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <span className="text-2xl font-semibold text-graphite">{value}</span>
        <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full ${accent}`}>
          карт
        </span>
      </div>
    </div>
  );
}

function PatientDetailView({
  patient,
  onBack,
  dropdownOpen,
  setDropdownOpen,
  assigned,
  setAssigned,
}: {
  patient: Patient;
  onBack: () => void;
  dropdownOpen: boolean;
  setDropdownOpen: (v: boolean) => void;
  assigned: string | null;
  setAssigned: (v: string | null) => void;
}) {
  const s = STATUS_META[patient.status];

  const radial = [
    { name: 'Вовлечённость', value: patient.engagement, fill: '#0D9488' },
  ];

  return (
    <>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary mb-5 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        К списку пациентов
      </button>

      <div className="flex items-start justify-between gap-4 flex-wrap mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-secondary text-primary font-semibold flex items-center justify-center text-lg">
            {patient.name.split(' ').map((s) => s[0]).join('')}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-graphite">
              {patient.name}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {patient.age} лет · {patient.diagnosis} · Программа «{patient.program}»
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${s.bg} ${s.text}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-semibold transition-colors"
            >
              <Plus className="w-4 h-4" />
              Назначить терапию
              <ChevronDown
                className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {dropdownOpen && (
              <>
                <div
                  role="presentation"
                  className="fixed inset-0 z-10"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-72 rounded-xl bg-white border border-border shadow-xl p-2 z-20">
                  {THERAPY_MODULES.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setAssigned(m.label);
                        setDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-secondary/60 transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary">
                          {m.label}
                        </p>
                        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary" />
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{m.desc}</p>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {assigned && (
        <div className="mb-6 rounded-xl border border-primary/30 bg-secondary/60 px-4 py-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">
              «{assigned}» назначен пациенту {patient.name.split(' ')[0]}
            </p>
            <p className="text-xs text-muted-foreground">
              Программа появится в кабинете родителя в течение часа.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setAssigned(null)}
            className="text-xs font-medium text-muted-foreground hover:text-foreground"
          >
            Отменить
          </button>
        </div>
      )}

      {/* Metric cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <MetricCard
          Icon={Activity}
          label="Вовлечённость"
          value={patient.engagement}
          tone="primary"
        />
        <MetricCard Icon={Eye} label="Зрительный контакт" value={patient.eyeContact} tone="cyan" />
        <MetricCard Icon={Hand} label="Моторика" value={patient.motor} tone="emerald" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-border p-5 md:p-6 shadow-sm">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-graphite">
                ИИ-аналитика по неделям
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Computer Vision: вовлечённость, зрительный контакт, моторика
              </p>
            </div>
          </div>

          <div className="h-64 -mx-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={patient.trend} margin={{ top: 10, right: 12, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF0" vertical={false} />
                <XAxis
                  dataKey="week"
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
                  contentStyle={{
                    background: '#fff',
                    border: '1px solid #E8ECF0',
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#1E293B', fontWeight: 600 }}
                />
                <Line
                  type="monotone"
                  dataKey="eng"
                  name="Вовлечённость"
                  stroke="#0D9488"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#0D9488' }}
                />
                <Line
                  type="monotone"
                  dataKey="eye"
                  name="Зрит. контакт"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#06B6D4' }}
                />
                <Line
                  type="monotone"
                  dataKey="mot"
                  name="Моторика"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center gap-5 mt-3 flex-wrap text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              Вовлечённость
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              Зрит. контакт
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Моторика
            </span>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-border p-5 md:p-6 shadow-sm">
          <h2 className="text-base md:text-lg font-semibold text-graphite mb-1">
            Общий индекс
          </h2>
          <p className="text-xs text-muted-foreground mb-3">Композитный показатель сессии</p>

          <div className="h-48 relative">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                innerRadius="70%"
                outerRadius="100%"
                data={radial}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: '#F4F6F8' }} dataKey="value" cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-3xl font-semibold text-graphite">{patient.engagement}</p>
                <p className="text-xs text-muted-foreground">из 100</p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border">
            <p className="text-xs font-semibold text-foreground mb-1">Рекомендация ИИ</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {patient.status === 'red'
                ? 'Снизить сложность задач на 1 уровень и добавить сенсорные паузы.'
                : patient.status === 'yellow'
                  ? 'Усилить блок внимания, сократить длительность сессии до 12 минут.'
                  : 'Текущая программа работает. Можно вводить новый модуль на следующей неделе.'}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function MetricCard({
  Icon,
  label,
  value,
  tone,
}: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  label: string;
  value: number;
  tone: 'primary' | 'cyan' | 'emerald';
}) {
  const toneCls = {
    primary: 'bg-secondary text-primary',
    cyan: 'bg-cyan-50 text-cyan-600',
    emerald: 'bg-emerald-50 text-emerald-600',
  }[tone];

  return (
    <div className="rounded-2xl bg-white border border-border p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${toneCls}`}>
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
        <span className="text-xs font-semibold text-muted-foreground">{value}/100</span>
      </div>
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
