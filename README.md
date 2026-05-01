# NeuroHub AI

AI-платформа персонализированной реабилитации для детей с ЗРР, ЗПР, РАС и ДЦП.

Built with Next.js 15 · React 19 · TypeScript · Tailwind CSS

---

## 🚀 Быстрый старт (локально)

```bash
npm install
npm run dev
```

Открой [http://localhost:4028](http://localhost:4028)

---

## ☁️ Деплой на Vercel (рекомендуется)

### Вариант 1 — через GitHub (проще всего)

1. Залей код на GitHub:
```bash
git init
git add .
git commit -m "initial commit"
git remote add origin https://github.com/ТВО_ИМЯ/neurohubai.git
git push -u origin main
```

2. Зайди на [vercel.com](https://vercel.com) → Sign up with GitHub (бесплатно)
3. Нажми **Add New Project** → выбери репозиторий → **Deploy**
4. Готово — через ~2 минуты получишь ссылку вида `neurohubai.vercel.app`

---

### Вариант 2 — через CLI (без GitHub)

```bash
npm i -g vercel
vercel
```

Vercel задаст несколько вопросов — на всё жми Enter. Ссылка появится в терминале.

---

### Переменные окружения

Если используешь API-ключи (Google Speech, OpenAI и т.д.) — добавь их в Vercel вручную:

**Vercel Dashboard → твой проект → Settings → Environment Variables**

Никогда не коммить `.env` в git.

---

## 📁 Структура проекта

```
src/
├── app/
│   ├── components/
│   │   ├── HeroSection.tsx          # Hero + кнопка "Попробовать бесплатно"
│   │   ├── SpeechDemoModal.tsx      # Демо речевого модуля (Web Speech API)
│   │   ├── CognitiveGameModal.tsx   # Игра на память (когнитивный модуль)
│   │   ├── ModulesSection.tsx       # Блок трёх модулей
│   │   ├── FeaturesSection.tsx      # Возможности платформы
│   │   ├── PricingSection.tsx       # Тарифы + форма регистрации
│   │   ├── ProblemSection.tsx
│   │   ├── SolutionSection.tsx
│   │   └── HowItWorksSection.tsx
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── ui/
└── styles/
    └── tailwind.css
```

---

## 📦 Скрипты

| Команда | Описание |
|---|---|
| `npm run dev` | Дев-сервер на порту 4028 |
| `npm run build` | Сборка для продакшена |
| `npm run serve` | Запуск продакшен-сборки |
| `npm run lint` | Проверка ESLint |
| `npm run format` | Форматирование Prettier |
