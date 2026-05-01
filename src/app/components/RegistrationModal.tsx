'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization?: string;
  childAge?: string;
  message?: string;
}

interface Props {
  plan: 'b2b' | 'b2c';
  onClose: () => void;
}

export default function RegistrationModal({ plan, onClose }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<FormData>();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const onSubmit = async (data: FormData) => {
    // Mock submit — replace with actual API call
    await new Promise((res) => setTimeout(res, 1200));
    console.log('Form submitted:', data);
  };

  const isClinic = plan === 'b2b';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-foreground/50 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-border px-8 py-5 flex items-center justify-between rounded-t-3xl">
          <div>
            <h3 className="font-display text-xl font-900 text-foreground">
              {isClinic ? 'Подключить клинику' : 'Начать бесплатно'}
            </h3>
            <p className="text-sm text-muted-foreground mt-0.5">
              {isClinic ? 'Тариф Для клиник · 15 000 ₸/мес' : 'Тариф Для семьи · 14 дней бесплатно'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center hover:bg-border transition-colors"
            aria-label="Закрыть"
          >
            <svg className="w-4 h-4 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-8 py-6">
          {isSubmitSuccessful ? (
            <div className="text-center py-10 flex flex-col items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-secondary flex items-center justify-center">
                <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h4 className="font-display text-2xl font-900 text-foreground">Заявка принята!</h4>
              <p className="text-muted-foreground text-sm max-w-xs">
                Наш менеджер свяжется с вами в течение 24 часов для подтверждения и настройки доступа.
              </p>
              <button onClick={onClose} className="btn-primary mt-4">
                Закрыть
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5" noValidate>
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-600 text-foreground">
                  Имя и фамилия <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('name', {
                    required: 'Введите ваше имя',
                    minLength: { value: 2, message: 'Минимум 2 символа' },
                  })}
                  type="text"
                  placeholder="Айгерим Сейткали"
                  className={`w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                    errors.name ? 'border-red-400 bg-red-50' : 'border-border bg-muted'
                  }`}
                />
                {errors.name && (
                  <span className="text-xs text-red-500">{errors.name.message}</span>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-600 text-foreground">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('email', {
                    required: 'Введите email',
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: 'Некорректный email',
                    },
                  })}
                  type="email"
                  placeholder="name@clinic.kz"
                  className={`w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                    errors.email ? 'border-red-400 bg-red-50' : 'border-border bg-muted'
                  }`}
                />
                {errors.email && (
                  <span className="text-xs text-red-500">{errors.email.message}</span>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-600 text-foreground">
                  Телефон <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('phone', {
                    required: 'Введите номер телефона',
                    pattern: {
                      value: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
                      message: 'Некорректный номер',
                    },
                  })}
                  type="tel"
                  placeholder="+7 700 000 00 00"
                  className={`w-full border rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all ${
                    errors.phone ? 'border-red-400 bg-red-50' : 'border-border bg-muted'
                  }`}
                />
                {errors.phone && (
                  <span className="text-xs text-red-500">{errors.phone.message}</span>
                )}
              </div>

              {/* Conditional fields */}
              {isClinic ? (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-600 text-foreground">Название клиники / организации</label>
                  <input
                    {...register('organization')}
                    type="text"
                    placeholder="Центр реабилитации «Надежда»"
                    className="w-full border border-border bg-muted rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  />
                </div>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-600 text-foreground">Возраст ребёнка</label>
                  <select
                    {...register('childAge')}
                    className="w-full border border-border bg-muted rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                  >
                    <option value="">Выберите возраст</option>
                    {['2-3 года', '4-5 лет', '6-7 лет', '8-10 лет', '11-14 лет'].map((a) => (
                      <option key={a} value={a}>{a}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-600 text-foreground">Комментарий (необязательно)</label>
                <textarea
                  {...register('message')}
                  rows={3}
                  placeholder={isClinic ? 'Расскажите о вашей клинике...' : 'Расскажите о вашем ребёнке...'}
                  className="w-full border border-border bg-muted rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all resize-none"
                />
              </div>

              <p className="text-xs text-muted-foreground">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <a href="#" className="text-primary hover:underline">Политикой конфиденциальности</a>
              </p>

              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary justify-center w-full py-4 text-base disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Отправляем...
                  </>
                ) : (
                  isClinic ? 'Отправить заявку' : 'Начать бесплатно'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}