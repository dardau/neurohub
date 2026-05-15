'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

type DemoTab = 'vision' | 'motor' | 'sos';

const tabs: { id: DemoTab; label: string }[] = [
  { id: 'vision', label: 'Тест Computer Vision' },
  { id: 'motor', label: 'Трекинг моторики' },
  { id: 'sos', label: 'Кнопка SOS' },
];

const sosScenarios = {
  tantrum: {
    title: 'Истерика',
    steps: [
      'Снизьте стимулы: приглушите свет и уберите лишние звуки.',
      'Дайте «тихий уголок» и предложите знакомый предмет-успокоитель.',
      'Говорите короткими фразами, без дополнительных требований — дождитесь снижения напряжения.',
    ],
  },
  sensory: {
    title: 'Сенсорный перегруз',
    steps: [
      'Уведите ребёнка из шумной среды в спокойное пространство.',
      'Используйте наушники с шумоподавлением или плотное одеяло (по переносимости).',
      'Дышите вместе медленно 4–6 раз, затем предложите одно простое действие.',
    ],
  },
};

function InsightPopup({ text, onClose }: { text: string; onClose: () => void }) {
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

function VisionDemo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const baselineRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const [phase, setPhase] = useState<'idle' | 'camera' | 'launched'>('idle');
  const [smileProgress, setSmileProgress] = useState(0);
  const [hint, setHint] = useState('');
  const [insight, setInsight] = useState<string | null>(null);
  const [error, setError] = useState('');

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  useEffect(() => () => stopCamera(), [stopCamera]);

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

  const start = async () => {
    setError('');
    setInsight(null);
    setSmileProgress(0);
    baselineRef.current = null;
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

      const tick = () => {
        const brightness = sampleMouthBrightness();
        const elapsed = Date.now() - started;

        if (elapsed < 1500) {
          samples.push(brightness);
          if (samples.length > 30) {
            baselineRef.current =
              samples.reduce((a, b) => a + b, 0) / samples.length;
          }
          setSmileProgress(Math.min(15, (elapsed / 1500) * 15));
        } else if (baselineRef.current !== null) {
          const delta = brightness - baselineRef.current;
          const progress = Math.min(100, Math.max(0, (delta / 18) * 100));
          setSmileProgress(progress);
          if (progress >= 85) {
            setPhase('launched');
            setHint('Ракета взлетела! 🚀');
            setInsight(
              'В реальном приложении эти данные формируют отчёт о зрительном контакте и эмоциях для лечащего врача.',
            );
            stopCamera();
            return;
          }
        }
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError('Нужен доступ к камере. Разрешите веб-камеру в браузере и попробуйте снова.');
    }
  };

  return (
    <div className="relative h-[340px] flex flex-col items-center justify-center bg-gradient-to-b from-secondary/80 to-white rounded-2xl overflow-hidden">
      <canvas ref={canvasRef} className="hidden" aria-hidden />

      {phase === 'idle' && (
        <div className="text-center px-6 flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-3xl">
            🤖
          </div>
          <p className="text-sm text-muted-foreground max-w-xs">
            ИИ-аватар: «Улыбнись, чтобы запустить ракету!» — алгоритм Computer Vision
            считывает мимику в браузере.
          </p>
          <button type="button" onClick={start} className="btn-primary text-sm py-2.5 px-6">
            Старт
          </button>
          {error && <p className="text-xs text-red-600">{error}</p>}
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
          <button
            type="button"
            className="btn-outline text-sm py-2 px-5 mt-2"
            onClick={() => {
              setPhase('idle');
              setSmileProgress(0);
            }}
          >
            Повторить
          </button>
        </div>
      )}

      {insight && <InsightPopup text={insight} onClose={() => setInsight(null)} />}
    </div>
  );
}

function MotorDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const pointsRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const [done, setDone] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{ name: string; value: number }[]>([]);

  const spiralPath = useCallback((ctx: CanvasRenderingContext2D, w: number, h: number) => {
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath();
    const cx = w / 2;
    const cy = h / 2;
    for (let a = 0; a < 6 * Math.PI; a += 0.08) {
      const r = 8 + a * 5.5;
      const x = cx + r * Math.cos(a);
      const y = cy + r * Math.sin(a);
      if (a === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.setLineDash([]);
  }, []);

  const getSpiralPoint = (t: number, w: number, h: number) => {
    const a = t * 6 * Math.PI;
    const r = 8 + a * 5.5;
    return {
      x: w / 2 + r * Math.cos(a),
      y: h / 2 + r * Math.sin(a),
    };
  };

  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width: w, height: h } = canvas;
    ctx.clearRect(0, 0, w, h);
    spiralPath(ctx, w, h);
    if (pointsRef.current.length > 1) {
      ctx.strokeStyle = '#028090';
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      pointsRef.current.forEach((p, i) => {
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();
    }
  }, [spiralPath]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      canvas.width = rect.width;
      canvas.height = rect.height;
      redraw();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [redraw]);

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      t: performance.now(),
    };
  };

  const finish = () => {
    const pts = pointsRef.current;
    if (pts.length < 20) return;
    const canvas = canvasRef.current!;
    const w = canvas.width;
    const h = canvas.height;
    let totalDev = 0;
    let tremor = 0;
    const duration = (pts[pts.length - 1].t - pts[0].t) / 1000;
    pts.forEach((p, i) => {
      const t = i / pts.length;
      const ideal = getSpiralPoint(t, w, h);
      const d = Math.hypot(p.x - ideal.x, p.y - ideal.y);
      totalDev += d;
      if (i > 2) {
        const prev = pts[i - 1];
        const angle = Math.abs(Math.atan2(p.y - prev.y, p.x - prev.x));
        tremor += Math.min(angle, Math.PI - angle);
      }
    });
    const accuracy = Math.max(0, Math.min(100, 100 - totalDev / pts.length / 2));
    const speed = Math.min(100, (pts.length / duration) * 2);
    const tremorScore = Math.max(0, 100 - tremor * 40);
    setMetrics([
      { name: 'Точность', value: Math.round(accuracy) },
      { name: 'Скорость', value: Math.round(speed) },
      { name: 'Тремор', value: Math.round(tremorScore) },
    ]);
    setDone(true);
    setInsight(
      'Так мы отслеживаем развитие мелкой моторики без специальных датчиков.',
    );
  };

  const reset = () => {
    pointsRef.current = [];
    setDone(false);
    setInsight(null);
    setMetrics([]);
    redraw();
  };

  return (
    <div className="relative h-[340px] flex flex-col">
      {!done ? (
        <>
          <p className="text-xs text-muted-foreground text-center px-4 py-2 shrink-0">
            Проведите мышкой или пальцем по пунктирной спирали
          </p>
          <canvas
            ref={canvasRef}
            className="flex-1 w-full touch-none cursor-crosshair bg-white"
            onPointerDown={(e) => {
              drawingRef.current = true;
              pointsRef.current = [pos(e)];
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drawingRef.current) return;
              pointsRef.current.push(pos(e));
              redraw();
            }}
            onPointerUp={() => {
              drawingRef.current = false;
              finish();
            }}
            onPointerLeave={() => {
              if (drawingRef.current) {
                drawingRef.current = false;
                finish();
              }
            }}
          />
          <button type="button" className="text-xs text-primary py-2" onClick={reset}>
            Сбросить
          </button>
        </>
      ) : (
        <div className="flex-1 flex flex-col p-4 gap-3">
          <p className="text-sm font-600 text-center">Результаты трекинга</p>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2eef0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, '']} />
                <Bar dataKey="value" fill="#028090" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <button type="button" className="btn-outline text-sm py-2 mx-auto" onClick={reset}>
            Пройти снова
          </button>
        </div>
      )}
      {insight && <InsightPopup text={insight} onClose={() => setInsight(null)} />}
    </div>
  );
}

function SosDemo() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState<keyof typeof sosScenarios | null>(null);
  const [insight, setInsight] = useState<string | null>(null);

  const select = (key: keyof typeof sosScenarios) => {
    setActive(key);
    setMenuOpen(false);
    setInsight('Алгоритмы действий за 2 секунды, когда нет времени гуглить');
  };

  return (
    <div className="relative h-[340px] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-red-50/50 to-white">
      {!active ? (
        <>
          {!menuOpen ? (
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="w-28 h-28 rounded-full bg-red-600 text-white font-display text-lg font-900 shadow-lg shadow-red-600/40 hover:scale-105 active:scale-95 transition-transform animate-pulse"
            >
              SOS
            </button>
          ) : (
            <div className="flex flex-col gap-3 w-full max-w-xs">
              <p className="text-center text-sm font-600 text-foreground mb-1">Выберите ситуацию</p>
              {(Object.keys(sosScenarios) as (keyof typeof sosScenarios)[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => select(key)}
                  className="w-full py-3 px-4 rounded-xl border-2 border-red-200 bg-white hover:bg-red-50 font-600 text-foreground transition-colors"
                >
                  {sosScenarios[key].title}
                </button>
              ))}
              <button
                type="button"
                className="text-sm text-muted-foreground"
                onClick={() => setMenuOpen(false)}
              >
                Отмена
              </button>
            </div>
          )}
          <p className="text-xs text-muted-foreground mt-6 text-center max-w-xs">
            Сценарий родителя: мгновенная первая помощь без поиска в интернете
          </p>
        </>
      ) : (
        <div className="w-full max-w-sm">
          <h4 className="font-display text-lg font-700 text-red-700 mb-4 text-center">
            {sosScenarios[active].title}
          </h4>
          <ol className="space-y-3">
            {sosScenarios[active].steps.map((step, i) => (
              <li
                key={step}
                className="flex gap-3 bg-white rounded-xl p-3 border border-border text-sm"
              >
                <span className="w-7 h-7 rounded-full bg-red-100 text-red-700 font-700 flex items-center justify-center shrink-0 text-xs">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
          <button
            type="button"
            className="btn-outline text-sm py-2 w-full mt-4"
            onClick={() => {
              setActive(null);
              setInsight(null);
            }}
          >
            Назад
          </button>
        </div>
      )}
      {insight && <InsightPopup text={insight} onClose={() => setInsight(null)} />}
    </div>
  );
}

export default function InteractiveDemoSection() {
  const [activeTab, setActiveTab] = useState<DemoTab>('vision');

  return (
    <section id="demo" className="py-24 bg-muted/50">
      <div className="max-w-6xl mx-auto px-5">
        <div className="text-center mb-12">
          <h2 className="text-[clamp(1.75rem,4vw,2.5rem)] font-bold text-foreground leading-tight">
            Оцените технологии NeuroHub в один клик
          </h2>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
            Выберите сценарий слева — справа откроется мини-симуляция. Данные не сохраняются.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-white shadow-lg overflow-hidden">
          <div className="bg-muted/80 px-4 py-2.5 flex items-center gap-2 border-b border-border">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
            <span className="text-[11px] text-muted-foreground font-medium ml-1">neurohub.demo</span>
          </div>
          <div className="flex flex-col md:flex-row min-h-[380px]">
            <nav className="md:w-56 shrink-0 border-b md:border-b-0 md:border-r border-border bg-muted/30 p-3 flex md:flex-col gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-left text-sm py-3 px-4 rounded-xl font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-muted-foreground hover:bg-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            <div className="flex-1 relative min-h-[340px]">
              {activeTab === 'vision' && <VisionDemo />}
              {activeTab === 'motor' && <MotorDemo />}
              {activeTab === 'sos' && <SosDemo />}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
