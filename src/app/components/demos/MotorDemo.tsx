'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import InsightPopup from './InsightPopup';

const TARGET_POINTS = 60;

export default function MotorDemo() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawingRef = useRef(false);
  const pointsRef = useRef<{ x: number; y: number; t: number }[]>([]);
  const autoRafRef = useRef<number>(0);
  const [done, setDone] = useState(false);
  const [insight, setInsight] = useState<string | null>(null);
  const [metrics, setMetrics] = useState<{ name: string; value: number }[]>([]);
  const [drawProgress, setDrawProgress] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(false);

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
    if (pts.length < 10) return;
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
    setInsight('Так мы отслеживаем развитие мелкой моторики без специальных датчиков.');
  };

  const reset = () => {
    cancelAnimationFrame(autoRafRef.current);
    pointsRef.current = [];
    setDone(false);
    setInsight(null);
    setMetrics([]);
    setDrawProgress(0);
    setAutoPlaying(false);
    redraw();
  };

  useEffect(() => () => cancelAnimationFrame(autoRafRef.current), []);

  const playAuto = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    reset();
    setAutoPlaying(true);
    const w = canvas.width;
    const h = canvas.height;
    const started = performance.now();
    const duration = 2500;

    const tick = (now: number) => {
      const elapsed = now - started;
      const t = Math.min(1, elapsed / duration);
      const targetT = t;
      const stepsCount = Math.floor(targetT * 90);
      const pts: { x: number; y: number; t: number }[] = [];
      for (let i = 0; i <= stepsCount; i++) {
        const k = i / 90;
        const ideal = getSpiralPoint(k, w, h);
        const jitter = (Math.sin(k * 40) + Math.cos(k * 27)) * 1.2;
        pts.push({
          x: ideal.x + jitter,
          y: ideal.y + jitter * 0.8,
          t: started + i * (duration / 90),
        });
      }
      pointsRef.current = pts;
      setDrawProgress(Math.min(100, (pts.length / TARGET_POINTS) * 100));
      redraw();

      if (t < 1) {
        autoRafRef.current = requestAnimationFrame(tick);
      } else {
        setAutoPlaying(false);
        finish();
      }
    };
    autoRafRef.current = requestAnimationFrame(tick);
  };

  return (
    <div className="relative h-full min-h-[420px] flex flex-col">
      {!done ? (
        <>
          <div className="flex items-center justify-between px-4 py-2 shrink-0 gap-3">
            <p className="text-xs text-muted-foreground">
              Проведите мышкой или пальцем по пунктирной спирали
            </p>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-mono text-primary">
                {pointsRef.current.length}/{TARGET_POINTS}
              </span>
              <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all"
                  style={{ width: `${drawProgress}%` }}
                />
              </div>
            </div>
          </div>
          <canvas
            ref={canvasRef}
            className={`flex-1 w-full touch-none bg-white ${
              autoPlaying ? 'cursor-wait' : 'cursor-crosshair'
            }`}
            onPointerDown={(e) => {
              if (autoPlaying) return;
              drawingRef.current = true;
              pointsRef.current = [pos(e)];
              setDrawProgress(0);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!drawingRef.current) return;
              pointsRef.current.push(pos(e));
              setDrawProgress(Math.min(100, (pointsRef.current.length / TARGET_POINTS) * 100));
              redraw();
            }}
            onPointerUp={() => {
              if (!drawingRef.current) return;
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
          <div className="flex items-center justify-center gap-3 py-2 border-t border-border bg-muted/30">
            <button
              type="button"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={reset}
              disabled={autoPlaying}
            >
              Сбросить
            </button>
            <span className="w-1 h-1 rounded-full bg-border" />
            <button
              type="button"
              className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
              onClick={playAuto}
              disabled={autoPlaying}
            >
              {autoPlaying ? 'Авто-демо…' : '▶ Показать пример'}
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col p-4 gap-3">
          <p className="text-sm font-600 text-center">Результаты трекинга</p>
          <div className="grid grid-cols-3 gap-2">
            {metrics.map((m) => (
              <div
                key={m.name}
                className="rounded-lg bg-secondary border border-primary/15 p-2 text-center"
              >
                <div className="text-[10px] text-muted-foreground">{m.name}</div>
                <div className="text-lg font-bold text-primary">{m.value}%</div>
              </div>
            ))}
          </div>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={metrics} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2eef0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v: number) => [`${v}%`, '']} />
                <Bar dataKey="value" fill="#0D9488" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <button
            type="button"
            className="text-sm py-2 px-5 mx-auto rounded-xl border border-border bg-white hover:bg-muted text-foreground"
            onClick={reset}
          >
            Пройти снова
          </button>
        </div>
      )}
      {insight && <InsightPopup text={insight} onClose={() => setInsight(null)} />}
    </div>
  );
}
