"use client";

import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

interface Bubble {
  id: number;
  src: string;
  rotate: number;
  delay: number;
  duration: number;
}

interface BubbleGalleryProps {
  images: string[];
}

export function BubbleGallery({ images }: BubbleGalleryProps) {
  const pool = useMemo(() => images.filter(Boolean), [images]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    if (!pool.length) return;
    const initial = Array.from({ length: pool.length }).map((_, idx) =>
      createBubble(idx, pool[idx % pool.length]),
    );
    setBubbles(initial);
  }, [pool]);

  useEffect(() => {
    if (!pool.length || !bubbles.length) return;
    const interval = setInterval(() => {
      setBubbles((prev) => {
        if (!prev.length) return prev;
        const idx = Math.floor(Math.random() * prev.length);
        const nextImage = pool[Math.floor(Math.random() * pool.length)];
        const updated = [...prev];
        updated[idx] = createBubble(Date.now(), nextImage);
        return updated;
      });
    }, 5200);

    return () => clearInterval(interval);
  }, [pool, bubbles.length]);

  if (!pool.length) return null;

  return (
    <div className="relative">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            type="button"
            onClick={() => setActive(bubble.src)}
            className="group relative block h-56 sm:h-64 overflow-hidden rounded-2xl bg-card/70 shadow-xl shadow-black/25 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none hover:-translate-y-1 hover:scale-[1.02]"
            style={{ transform: `rotate(${bubble.rotate}deg)` }}
          >
            <span className="absolute inset-0 z-10 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-40" />
            <img
              src={bubble.src}
              alt="Image de galerie - Portfolio visuel de Ricken Bazolo"
              className="h-full w-full object-cover"
              style={
                {
                  animation: `float-slow ${bubble.duration}ms ease-in-out infinite`,
                  animationDelay: `${bubble.delay}ms`,
                } as CSSProperties
              }
            />
          </button>
        ))}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setActive(null)}
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-full border border-border/60 bg-card/80 px-3 py-1 text-sm text-foreground transition hover:border-accent hover:text-accent"
            onClick={(e) => {
              e.stopPropagation();
              setActive(null);
            }}
          >
            ×
          </button>
          <img
            src={active}
            alt="Vue agrandie - Image de galerie du portfolio de Ricken Bazolo"
            className="max-h-[80vh] max-w-full rounded-2xl border border-border/70 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

function createBubble(id: number, src: string): Bubble {
  const rotate = -6 + Math.random() * 12; // tilt aléatoire léger
  const delay = Math.floor(Math.random() * 2600);
  const duration = 9000 + Math.floor(Math.random() * 5000);
  return { id, src, rotate, delay, duration };
}
