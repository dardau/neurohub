import React from 'react';

import AppLogo from '@/components/ui/AppLogo';
import ContactLinks from '@/components/ContactLinks';

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white py-12">
      <div className="max-w-7xl mx-auto px-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-8 border-b border-border">
          <div className="flex items-center gap-2">
            <AppLogo size={28} />
            <span className="text-base font-semibold text-foreground">NeuroHub AI</span>
          </div>

          <ContactLinks variant="prominent" direction="col" />

          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#contacts" className="hover:text-foreground transition-colors">
              Контакты
            </a>
            <a href="#ecosystem" className="hover:text-foreground transition-colors">
              Экосистема
            </a>
            <a href="#cta" className="hover:text-foreground transition-colors">
              Пилот
            </a>
            <a href="#" className="hover:text-foreground transition-colors">
              Конфиденциальность
            </a>
          </nav>
        </div>

        <p className="text-xs text-muted-foreground mt-6">
          © 2026 NeuroHub AI. Phygital-реабилитация для детей с РАС, СДВГ и ЗПР.
        </p>
      </div>
    </footer>
  );
}
