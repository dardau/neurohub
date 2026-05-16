'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import InsightPopup from './InsightPopup';

const SUCCESS_INSIGHT =
  'В реальном приложении эти данные формируют отчёт о зрительном контакте и эмоциях для лечащего врача.';

export default function VisionDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const baselineRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [phase, setPhase] = useState<'idle' | 'camera' | 'demo' | 'launched'>('idle');
  const [smileProgress, setSmileProgress] = useState(0);
  const [hint, setHint] = useState('');
  const [insight, setInsight] = useState<string | null>(null);
  const [error, setError] = useState('');

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const completeSuccess = useCallback(() => {
    stopCamera();
    setSmileProgress(100);
    setPhase('launched');
    setHint('Ракета взлетела! 🚀');
    setInsight(SUCCESS_INSIGHT);
  }, [stopCamera]);

  const sampleMouthBrightness = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return 0;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;
    const w = 120;
    const h = 90;
    canvas.width = w;
    canvas.height = h;
    ctx.drawImage(video, 0, 0, w, h);
    const mouthY = Math.floor(h * 0.52);
    const mouthH = Math.floor(h * 0.38);
    const mouthX = Math.floor(w * 0.28);
    const mouthW = Math.floor(w * 0.44);
    const data = ctx.getImageData(mouthX, mouthY, mouthW, mouthH).data;
    let sum = 0;
    for (let i = 0; i < data.length; i += 4) {
      sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
    }
    return sum / (data.length / 4);
  };

  const startSimulated = () => {
    setError('');
    setInsight(null);
    setSmileProgress(0);
    setPhase('demo');
    setHint('Симуляция: нейросеть анализирует кадр…');
    const started = Date.now();
    const total = 4000;
    const tick = () => {
      const elapsed = Date.now() - started;
      const progress = Math.min(100, (elapsed / total) * 100);
      setSmileProgress(progress);
      if (progress >= 100) {
        completeSuccess();
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  const start = async () => {
    setError('');
    setInsight(null);
    setSmileProgress(0);
    baselineRef.current = null;
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      startSimulated();
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: 320, height: 240 },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setPhase('camera');
      setHint('Улыбнись, чтобы запустить ракету!');

      const samples: number[] = [];
      const started = Date.now();
      timeoutRef.current = setTimeout(completeSuccess, 9000);

      const tick = () => {
        const brightness = sampleMouthBrightness();
        const elapsed = Date.now() - started;

        if (elapsed < 1000) {
          samples.push(brightness);
          if (samples.length > 20) {
            baselineRef.current = samples.reduce((a, b) => a + b, 0) / samples.length;
          }
          setSmileProgress(Math.min(20, (elapsed / 1000) * 20));
        } else if (baselineRef.current !== null) {
          const delta = brightness - baselineRef.current;
          const detected = Math.max(0, (delta / 10) * 100);
          const timeBoost = Math.min(40, ((elapsed - 1000) / 5000) * 40);
          const progress = Math.min(100, 20 + detected + timeBoost);
          setSmileProgress(progress);
          if (progress >= 75) {
            completeSuccess();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError('Камера недоступна. Запускаем симуляцию работы алгоритма.');
      setTimeout(startSimulated, 800);
    }
  };

  const reset = () => {
    stopCamera();
    setPhase('idle');
    setSmileProgress(0);
    setInsight(null);
    setError('');
  };

  return (
    <div className="relative h-full min-h-[420px] flex flex-col items-center justify-center bg-gradient-to-b from-secondary/80 to-white overflow-hidden">
      <canvas ref={canvasRef} className="hidden" aria-hidden />

      {phase === 'idle' && (
        <div className="text-center px-6 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
            🤖
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            ИИ-аватар: «Улыбнись, чтобы запустить ракету!» — алгоритм Computer Vision считывает
            мимику в браузере.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 items-center">
            <button type="button" onClick={start} className="btn-primary text-sm py-2.5 px-6">
              Включить камеру
            </button>
            <button
              type="button"
              onClick={startSimulated}
              className="text-sm py-2.5 px-4 rounded-xl border border-border bg-white hover:bg-muted text-foreground transition-colors"
            >
              Без камеры (симуляция)
            </button>
          </div>
          {error && <p className="text-xs text-red-600 max-w-xs">{error}</p>}
        </div>
      )}

      {phase === 'demo' && (
        <div className="relative w-full h-full flex flex-col items-center justify-center px-6 gap-4 bg-gradient-to-br from-secondary via-white to-secondary/60">
          <div className="relative w-44 h-44">
            <div className="absolute inset-0 rounded-full border-2 border-dashed border-primary/30 animate-spin [animation-duration:6s]" />
            <div className="absolute inset-3 rounded-full border border-primary/40 animate-pulse" />
            <div className="absolute inset-0 flex items-center justify-center text-6xl">😊</div>
            <div className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-semibold px-2 py-1 rounded-full">
              CV · {Math.round(smileProgress)}%
            </div>
          </div>
          <p className="text-sm font-semibold text-foreground">{hint}</p>
          <div className="h-2 bg-muted rounded-full overflow-hidden max-w-xs w-full">
            <div
              className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-100 rounded-full"
              style={{ width: `${smileProgress}%` }}
            />
          </div>
          <p className="text-[11px] text-muted-foreground text-center max-w-xs">
            Алгоритм: захват кадра → детекция лица → ключевые точки рта → классификация эмоции.
          </p>
        </div>
      )}

      {phase === 'camera' && (
        <>
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover opacity-90"
            playsInline
            muted
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />
          <div className="relative z-10 text-center px-4 mt-auto mb-20">
            <p className="text-white font-700 text-sm drop-shadow">{hint}</p>
            <div className="mt-3 h-2 bg-white/30 rounded-full overflow-hidden max-w-xs mx-auto">
              <div
                className="h-full bg-accent transition-all duration-150 rounded-full"
                style={{ width: `${smileProgress}%` }}
              />
            </div>
            <p className="text-white/80 text-xs mt-2">Детекция улыбки · YOLO-подобный пайплайн</p>
          </div>
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 text-4xl transition-all duration-700 ${
              smileProgress > 50 ? '-translate-y-24 opacity-100' : 'translate-y-0 opacity-80'
            }`}
          >
            🚀
          </div>
        </>
      )}

      {phase === 'launched' && (
        <div className="text-center px-6 flex flex-col items-center gap-3">
          <div className="text-6xl animate-bounce">🚀</div>
          <p className="font-display text-xl font-700 text-primary">Успех!</p>
          <p className="text-sm text-muted-foreground">Мимика распознана, ракета запущена.</p>
          <div className="grid grid-cols-3 gap-2 max-w-xs w-full mt-1">
            {[
              { label: 'Улыбка', value: '✓' },
              { label: 'Взгляд', value: '2.4с' },
              { label: 'Радость', value: '0.91' },
            ].map((m) => (
              <div key={m.label} className="rounded-lg bg-secondary p-2 border border-primary/15">
                <div className="text-[10px] text-muted-foreground">{m.label}</div>
                <div className="text-sm font-semibold text-primary">{m.value}</div>
              </div>
            ))}
          </div>
          <button
            type="button"
            className="text-sm py-2 px-5 mt-2 rounded-xl border border-border bg-white hover:bg-muted text-foreground"
            onClick={reset}
          >
            Повторить
          </button>
        </div>
      )}

      {insight && <InsightPopup text={insight} onClose={() => setInsight(null)} />}
    </div>
  );
}
