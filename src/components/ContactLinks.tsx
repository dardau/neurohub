import React from 'react';
import { CONTACTS } from '@/lib/contacts';

type ContactLinksProps = {
  className?: string;
  linkClassName?: string;
  direction?: 'row' | 'col';
  variant?: 'default' | 'prominent';
};

export default function ContactLinks({
  className = '',
  linkClassName,
  direction = 'row',
  variant = 'default',
}: ContactLinksProps) {
  const prominent = variant === 'prominent';
  const phoneClass =
    linkClassName ??
    (prominent
      ? 'inline-flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary'
      : 'text-sm font-medium text-foreground hover:text-primary');
  const tgClass =
    linkClassName ??
    (prominent
      ? 'inline-flex items-center gap-2 text-base font-semibold text-foreground hover:text-primary'
      : 'text-sm font-medium text-foreground hover:text-primary');

  return (
    <div
      className={`flex gap-5 ${direction === 'col' ? 'flex-col items-start' : 'flex-wrap items-center'} ${className}`}
    >
      <a href={`tel:${CONTACTS.phoneTel}`} className={phoneClass}>
        {prominent && (
          <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
          </span>
        )}
        {CONTACTS.phoneDisplay}
      </a>
      <a
        href={CONTACTS.telegramUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={tgClass}
      >
        {prominent && (
          <span className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 text-xs font-bold">
            TG
          </span>
        )}
        {CONTACTS.telegramHandle}
      </a>
    </div>
  );
}
