import React from 'react';
import ContactLinks from '@/components/ContactLinks';

export default function ContactBar() {
  return (
    <section id="contacts" className="py-6 bg-white border-y border-border">
      <div className="max-w-7xl mx-auto px-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm font-semibold text-foreground">Связаться с командой NeuroHub AI</p>
        <ContactLinks variant="prominent" />
      </div>
    </section>
  );
}
