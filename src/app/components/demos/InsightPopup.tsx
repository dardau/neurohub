'use client';

import React from 'react';

export default function InsightPopup({ text, onClose }: { text: string; onClose: () => void }) {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-20 animate-in fade-in slide-in-from-bottom-2">
      <div className="bg-foreground text-white rounded-2xl p-4 shadow-xl flex gap-3 items-start">
        <p className="text-sm leading-relaxed flex-1">{text}</p>
        <button
          type="button"
          onClick={onClose}
          className="text-white/60 hover:text-white text-lg leading-none shrink-0"
          aria-label="Закрыть"
        >
          ×
        </button>
      </div>
    </div>
  );
}
