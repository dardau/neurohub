'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

import ContactLinks from '@/components/ContactLinks';

type LeadForm = {
  email: string;
  role: 'doctor' | 'parent' | 'investor';
};

const roleOptions = [
  { value: 'doctor', label: 'Врач' },
  { value: 'parent', label: 'Родитель' },
  { value: 'investor', label: 'Инвестор' },
] as const;

export default function CTASection() {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LeadForm>({
    defaultValues: { role: 'parent' },
  });

  const onSubmit = async () => {
    await new Promise((r) => setTimeout(r, 500));
    setSubmitted(true);
    reset();
  };

  return (
    <section
      id="cta"
      className="relative py-24 text-white overflow-hidden bg-gradient-to-br from-primary via-primary to-accent"
    >
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.6) 0, transparent 40%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.4) 0, transparent 45%)',
        }}
      />
      <div className="absolute inset-0 tech-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-5 text-center">
        <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight mb-4">
          Готовы стереть границы терапии?
        </h2>
        <p className="text-white/85 text-base leading-relaxed mb-8 max-w-lg mx-auto">
          Присоединяйтесь к закрытому пилотному тестированию с клиниками и волонтёрами — первыми
          внедрите ИИ-реабилитацию в Казахстане.
        </p>

        <div className="mb-8 rounded-2xl bg-white p-5 max-w-md mx-auto text-left shadow-md">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Контакты
          </p>
          <ContactLinks
            variant="prominent"
            direction="col"
            linkClassName="text-base font-semibold text-foreground hover:text-primary"
          />
        </div>

        {submitted ? (
          <div className="bg-white/15 backdrop-blur rounded-2xl p-8 border border-white/25">
            <p className="text-xl font-semibold mb-2">Заявка отправлена</p>
            <p className="text-white/80 text-sm mb-4">
              Свяжемся с вами в течение 48 часов. Или напишите нам в Telegram.
            </p>
            <button
              type="button"
              className="text-sm font-medium underline"
              onClick={() => setSubmitted(false)}
            >
              Отправить ещё раз
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-white rounded-2xl p-6 text-left shadow-lg max-w-md mx-auto"
          >
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="lead-email"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Email
                </label>
                <input
                  id="lead-email"
                  type="email"
                  placeholder="email@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('email', {
                    required: 'Укажите email',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Некорректный email',
                    },
                  })}
                />
                {errors.email && (
                  <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="lead-role"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Ваша роль
                </label>
                <select
                  id="lead-role"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-muted text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('role', { required: true })}
                >
                  {roleOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full justify-center py-3.5 px-6 rounded-xl bg-foreground text-white font-semibold text-base hover:bg-foreground/90 transition-colors shadow-lg disabled:opacity-60 flex items-center"
              >
                {isSubmitting ? 'Отправка…' : 'Запросить ранний доступ'}
              </button>
            </div>
          </form>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-white/70">
          <a href="#" className="hover:text-white underline-offset-2 hover:underline">
            Политика конфиденциальности
          </a>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <a href="#cta" className="hover:text-white underline-offset-2 hover:underline">
            Контакты
          </a>
          <span className="w-1 h-1 rounded-full bg-white/30" />
          <span>© 2026 NeuroHub AI</span>
        </div>

        <p className="text-white/50 text-xs mt-3">
          Нажимая кнопку, вы соглашаетесь на обработку email для связи по пилоту.
        </p>
      </div>
    </section>
  );
}
