'use client';

import React, { useEffect } from 'react';
import { X, Wind, Volume2, Hand, Heart, Phone } from 'lucide-react';

type SosModalProps = {
  open: boolean;
  onClose: () => void;
};

const STEPS = [
  {
    Icon: Volume2,
    title: 'Снизьте сенсорную нагрузку',
    body: 'Приглушите свет, выключите телевизор и музыку. Уведите ребёнка в тихое место.',
  },
  {
    Icon: Hand,
    title: 'Не настаивайте на контакте',
    body: 'Не обнимайте насильно и не смотрите в глаза — это может усилить перегрузку. Будьте рядом.',
  },
  {
    Icon: Wind,
    title: 'Дыхание 4-7-8',
    body: 'Сделайте вместе вдох на 4 счёта, задержку на 7 и медленный выдох на 8. Повторите 3 раза.',
  },
  {
    Icon: Heart,
    title: 'Используйте якорь',
    body: 'Предложите любимую игрушку, утяжелённое одеяло или мягкий предмет — это вернёт чувство безопасности.',
  },
];

export default function SosModal({ open, onClose }: SosModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-graphite/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sos-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white border border-border shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-border px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-semibold mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              SOS-помощь
            </span>
            <h3 id="sos-title" className="text-xl font-semibold text-graphite">
              Что делать при сенсорной перегрузке
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Спокойный пошаговый протокол. Действуйте без спешки.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors flex-shrink-0"
            aria-label="Закрыть"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ol className="px-6 py-5 space-y-3">
          {STEPS.map((s, i) => (
            <li
              key={s.title}
              className="flex items-start gap-4 p-4 rounded-xl border border-border bg-muted/40"
            >
              <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-primary flex-shrink-0">
                <s.Icon className="w-5 h-5" strokeWidth={1.75} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-primary">Шаг {i + 1}</span>
                </div>
                <h4 className="text-sm font-semibold text-graphite mb-1">{s.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="px-6 pb-6">
          <div className="rounded-xl border border-red-100 bg-red-50/60 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-red-700">Если эпизод длится дольше 30 минут</p>
              <p className="text-xs text-red-600/80 mt-0.5">Свяжитесь с лечащим специалистом.</p>
            </div>
            <a
              href="tel:103"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors"
            >
              <Phone className="w-4 h-4" />
              Позвонить
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
