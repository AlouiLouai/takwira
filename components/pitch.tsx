"use client";

import { ReactNode } from "react";

type PitchProps = {
  children: ReactNode;
};

export function Pitch({ children }: PitchProps) {
  return (
    <section className="flex flex-1 items-center justify-center px-4 pb-[calc(1.5rem+var(--safe-bottom))] pt-2">
      <div className="relative w-full max-w-[520px]">
        {/* Blurred stands add stadium depth without sacrificing performance */}
        <div className="pointer-events-none absolute inset-x-6 -top-10 h-16 rounded-full bg-gradient-to-b from-black/60 to-transparent blur-2xl" aria-hidden />
        <div className="pointer-events-none absolute inset-x-6 -bottom-10 h-16 rounded-full bg-gradient-to-t from-black/60 to-transparent blur-2xl" aria-hidden />
        <div className="relative aspect-[9/16] w-full rounded-[32px] bg-gradient-to-b from-[#0f4d2d] via-[#0d3f27] to-[#0a2b1b] shadow-pitch overflow-hidden">
          {/* Subtle alternating stripes suggest real grass without heavy imagery */}
          <div
            className="absolute inset-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.08)_0,rgba(255,255,255,0.08)_12%,transparent_12%,transparent_24%)] opacity-15"
            aria-hidden
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12),transparent_60%)]" aria-hidden />
          {/* Outer boundary */}
          <div className="absolute inset-4 rounded-[28px] border border-white/70 opacity-80" aria-hidden />
          {/* Horizontal center line */}
          <div className="absolute inset-x-5 top-1/2 h-px -translate-y-1/2 bg-white/70 opacity-80" aria-hidden />
          {/* Center circle */}
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70 opacity-80" aria-hidden />
          {/* Corner arcs */}
          <div className="absolute left-4 top-4 h-10 w-10 border-l border-t border-white/70 opacity-80 rounded-tl-full" aria-hidden />
          <div className="absolute right-4 top-4 h-10 w-10 border-r border-t border-white/70 opacity-80 rounded-tr-full" aria-hidden />
          <div className="absolute left-4 bottom-4 h-10 w-10 border-b border-l border-white/70 opacity-80 rounded-bl-full" aria-hidden />
          <div className="absolute right-4 bottom-4 h-10 w-10 border-b border-r border-white/70 opacity-80 rounded-br-full" aria-hidden />
          {/* Goalkeeper rectangles mimic 6-yard boxes with crisp corners */}
          <div className="absolute left-1/2 top-6 h-14 w-32 -translate-x-1/2 border border-white/70 opacity-80" aria-hidden />
          <div className="absolute left-1/2 bottom-6 h-14 w-32 -translate-x-1/2 border border-white/70 opacity-80" aria-hidden />
          <div className="absolute inset-0">{children}</div>
        </div>
      </div>
    </section>
  );
}
