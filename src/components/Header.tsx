'use client';

import React, { useState, useEffect } from 'react';

import AppLogo from '@/components/ui/AppLogo';
import { CONTACTS } from '@/lib/contacts';

const navLinks = [
  { label: 'Проблема', href: '#problem' },
  { label: 'Экосистема', href: '#ecosystem' },
  { label: 'Демо-игры', href: '#demo' },
  { label: 'Модули', href: '#modules' },
  { label: 'Инвесторам', href: '#cta' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-border py-3'
          : 'bg-white/70 backdrop-blur-sm py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 grid grid-cols-[auto_1fr_auto] items-center gap-4 xl:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center gap-2 xl:justify-self-start">
          <AppLogo size={36} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />
          <span className="text-lg font-semibold text-foreground tracking-tight hidden sm:block">
            NeuroHub AI
          </span>
        </div>

        <nav className="hidden xl:flex items-center justify-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4 justify-self-end">
          <a
            href={`tel:${CONTACTS.phoneTel}`}
            className="text-sm font-semibold text-primary hover:underline hidden xl:inline"
          >
            {CONTACTS.phoneDisplay}
          </a>
          <a href="/login" className="btn-ghost text-sm">
            Вход
          </a>
          <a href="/login" className="btn-primary text-sm py-2.5 px-5">
            Попробовать демо
          </a>
        </div>

        <button
          type="button"
          className="lg:hidden justify-self-end flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-lg border border-border bg-white"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          <span
            className={`block w-5 h-0.5 bg-foreground transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-foreground transition-all ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-foreground transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>

      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-6 md:hidden"
          onClick={closeMenu}
        >
          <div className="absolute top-5 left-5 flex items-center gap-2">
            <AppLogo size={32} />
            <span className="text-lg font-semibold">NeuroHub AI</span>
          </div>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-xl font-semibold text-foreground hover:text-primary"
              onClick={closeMenu}
            >
              {link.label}
            </a>
          ))}
          <div className="flex flex-col gap-2 text-center">
            <a href={`tel:${CONTACTS.phoneTel}`} className="text-lg font-semibold text-primary">
              {CONTACTS.phoneDisplay}
            </a>
            <a
              href={CONTACTS.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold text-primary"
            >
              {CONTACTS.telegramHandle}
            </a>
          </div>
          <div className="flex flex-col gap-3 w-56 mt-2">
            <a href="/login" className="btn-primary justify-center" onClick={closeMenu}>
              Попробовать демо
            </a>
            <a href="#demo" className="btn-ghost justify-center" onClick={closeMenu}>
              Поиграть в демки
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
