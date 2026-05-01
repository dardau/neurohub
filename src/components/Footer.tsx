import React from 'react';
import AppLogo from '@/components/ui/AppLogo';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white pt-14 pb-10">
      <div className="max-w-7xl mx-auto px-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
        {/* Left: Logo + tagline */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AppLogo size={32} />
            <span className="font-display text-lg font-bold text-foreground">NeuroHub AI</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            AI-реабилитация для детей с ЗРР, ЗПР, РАС и ДЦП.
          </p>
        </div>

        {/* Right: Links */}
        <nav className="flex flex-wrap gap-x-8 gap-y-3">
          {[
            { label: 'Решение', href: '#solution' },
            { label: 'Модули', href: '#modules' },
            { label: 'Тарифы', href: '#pricing' },
            { label: 'Конфиденциальность', href: '#' },
            { label: 'Условия', href: '#' },
          ]?.map((link) => (
            <a
              key={link?.href + link?.label}
              href={link?.href}
              className="text-sm font-500 text-muted-foreground hover:text-foreground transition-colors"
            >
              {link?.label}
            </a>
          ))}
        </nav>

        {/* Social + copyright */}
        <div className="flex flex-col items-start md:items-end gap-3">
          <div className="flex items-center gap-4">
            {[
              { label: 'Telegram', href: '#' },
              { label: 'WhatsApp', href: '#' },
              { label: 'Instagram', href: '#' },
            ]?.map((s) => (
              <a
                key={s?.label}
                href={s?.href}
                className="text-sm font-600 text-muted-foreground hover:text-primary transition-colors min-h-[44px] flex items-center"
              >
                {s?.label}
              </a>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">© 2026 NeuroHub AI. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}