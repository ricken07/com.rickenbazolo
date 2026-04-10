"use client";

import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";

export interface GalleryImage {
  src: string;
  priority: number;
}

interface Bubble {
  id: number;
  src: string;
  priority: number;
  rotate: number;
  delay: number;
  duration: number;
}

interface BubbleGalleryProps {
  images: GalleryImage[];
}

const MAX_VISIBLE_BUBBLES = 6;
const FEATURED_PRIORITY_COUNT = 3;

export function BubbleGallery({ images }: BubbleGalleryProps) {
  const pool = useMemo(() => images.filter((image) => Boolean(image.src)), [images]);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const featuredThreshold = useMemo(() => {
    const ranked = [...pool]
      .map((image) => image.priority)
      .sort((left, right) => right - left);
    return ranked[Math.min(FEATURED_PRIORITY_COUNT - 1, ranked.length - 1)] ?? 0;
  }, [pool]);

  useEffect(() => {
    if (!pool.length) return;
    const initial = pickWeightedImages(
      pool,
      Math.min(MAX_VISIBLE_BUBBLES, pool.length),
    ).map((image, idx) => createBubble(idx, image));
    setBubbles(initial);
  }, [pool]);

  useEffect(() => {
    if (!pool.length || !bubbles.length) return;
    const interval = setInterval(() => {
      setBubbles((prev) => {
        if (!prev.length) return prev;
        const idx = Math.floor(Math.random() * prev.length);
        const visibleSources = new Set(
          prev
            .filter((_, bubbleIdx) => bubbleIdx !== idx)
            .map((bubble) => bubble.src),
        );
        const candidates = pool.filter((image) => !visibleSources.has(image.src));
        const nextImage = pickWeightedImages(
          candidates.length ? candidates : pool,
          1,
        )[0];

        if (!nextImage) return prev;
        const updated = [...prev];
        updated[idx] = createBubble(Date.now(), nextImage);
        return updated;
      });
    }, 5200);

    return () => clearInterval(interval);
  }, [pool, bubbles.length]);

  useEffect(() => {
    if (active === null || !pool.length) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
        return;
      }

      if (event.key === "ArrowRight") {
        setActive((current) => getNextIndex(current, pool.length, 1));
        return;
      }

      if (event.key === "ArrowLeft") {
        setActive((current) => getNextIndex(current, pool.length, -1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active, pool.length]);

  if (!pool.length) return null;

  const activeImage = active === null ? null : pool[active] ?? null;

  return (
    <div className="relative">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {bubbles.map((bubble) => (
          <button
            key={bubble.id}
            type="button"
            onClick={() =>
              setActive(pool.findIndex((candidate) => candidate.src === bubble.src))
            }
            className={clsx(
              "group relative block overflow-hidden rounded-2xl bg-card/70 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none hover:-translate-y-1 hover:scale-[1.02]",
              bubble.priority >= featuredThreshold
                ? "h-64 border border-accent/30 shadow-2xl shadow-[#0693e3]/20 sm:h-72"
                : "h-56 shadow-xl shadow-black/25 sm:h-64",
            )}
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

      {activeImage && (
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
          <div
            className="relative inline-flex max-h-[80vh] max-w-[min(92vw,1200px)] items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white shadow-lg backdrop-blur-sm transition hover:border-accent hover:bg-black/60 sm:left-4 sm:h-12 sm:w-12"
              onClick={() => setActive((current) => getNextIndex(current, pool.length, -1))}
            >
              <ChevronLeftIcon />
            </button>
            <img
              src={activeImage.src}
              alt="Vue agrandie - Image de galerie du portfolio de Ricken Bazolo"
              className="block max-h-[80vh] w-auto max-w-[min(92vw,1200px)] rounded-2xl border border-border/70 shadow-2xl"
            />
            <button
              type="button"
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-black/45 text-white shadow-lg backdrop-blur-sm transition hover:border-accent hover:bg-black/60 sm:right-4 sm:h-12 sm:w-12"
              onClick={() => setActive((current) => getNextIndex(current, pool.length, 1))}
            >
              <ChevronRightIcon />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function createBubble(id: number, image: GalleryImage): Bubble {
  const rotate = -6 + Math.random() * 12; // tilt aléatoire léger
  const delay = Math.floor(Math.random() * 2600);
  const duration = 9000 + Math.floor(Math.random() * 5000);
  return { id, src: image.src, priority: image.priority, rotate, delay, duration };
}

function pickWeightedImages(images: GalleryImage[], count: number): GalleryImage[] {
  const selected: GalleryImage[] = [];
  const remaining = [...images];

  while (remaining.length && selected.length < count) {
    const nextIndex = pickWeightedIndex(remaining);
    const [nextImage] = remaining.splice(nextIndex, 1);
    if (nextImage) selected.push(nextImage);
  }

  return selected;
}

function pickWeightedIndex(images: GalleryImage[]): number {
  const totalWeight = images.reduce((sum, image) => sum + getWeight(image.priority), 0);
  let cursor = Math.random() * totalWeight;

  for (let idx = 0; idx < images.length; idx += 1) {
    cursor -= getWeight(images[idx].priority);
    if (cursor <= 0) return idx;
  }

  return Math.max(images.length - 1, 0);
}

function getWeight(priority: number): number {
  return Math.max(priority, 1) ** 2;
}

function getNextIndex(
  current: number | null,
  length: number,
  direction: 1 | -1,
): number | null {
  if (!length) return null;
  if (current === null) return 0;
  return (current + direction + length) % length;
}

function ChevronLeftIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 sm:h-6 sm:w-6">
      <path
        d="m15 18-6-6 6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-5 w-5 sm:h-6 sm:w-6">
      <path
        d="m9 18 6-6-6-6"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}
