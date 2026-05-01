'use client';

import React, { useState, useEffect } from 'react';

import AppLogo from '@/components/ui/AppLogo';

const navLinks = [
  { label: 'Проблема', href: '#problem' },
  { label: 'Решение', href: '#solution' },
  { label: 'Модули', href: '#modules' },
  { label: 'Возможности', href: '#features' },
  { label: 'Тарифы', href: '#pricing' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNavClick = () => setMenuOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-border py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AppLogo
            size={36}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          />
          <span className="font-display text-xl font-bold text-foreground tracking-tight hidden sm:block">
            NeuroHub AI
          </span>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navLinks?.map((link) => (
            <a
              key={link?.href}
              href={link?.href}
              className="text-sm font-600 text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {link?.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a href="#pricing" className="btn-outline text-sm py-2.5 px-5">
            Войти
          </a>
          <a href="#hero" className="btn-primary text-sm py-2.5 px-5">
            Попробовать бесплатно
          </a>
        </div>

        {/* Hamburger */}
        <button
          className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5 rounded-xl border border-border bg-white/80 backdrop-blur"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
        >
          <span
            className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`}
          />
          <span
            className={`block w-5 h-0.5 bg-foreground transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}
          />
        </button>
      </div>
      {/* Mobile overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 top-0 z-40 bg-white/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          onClick={handleNavClick}
        >
          <div className="flex items-center gap-2 absolute top-5 left-5">
            <AppLogo size={32} />
            <span className="font-display text-lg font-bold">NeuroHub AI</span>
          </div>
          {navLinks?.map((link) => (
            <a
              key={link?.href}
              href={link?.href}
              className="text-2xl font-display font-bold text-foreground hover:text-primary transition-colors"
              onClick={handleNavClick}
            >
              {link?.label}
            </a>
          ))}
          <div className="flex flex-col gap-3 w-56 mt-4">
            <a href="#pricing" className="btn-outline text-center" onClick={handleNavClick}>
              Войти
            </a>
            <a href="#hero" className="btn-primary justify-center" onClick={handleNavClick}>
              Попробовать бесплатно
            </a>
          </div>
        </div>
      )}
    </header>
  );
}