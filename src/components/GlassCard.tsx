"use client";

import React, { useRef, useState, useEffect } from "react";

interface GlassCardProps {
  level?: "quiet" | "default" | "featured";
  interactive?: boolean;
  spotlight?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function GlassCard({
  level = "default",
  interactive = false,
  spotlight = true,
  children,
  className = "",
  onClick,
}: GlassCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || !spotlight) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setCoords({ x, y });
  };

  // Border and background classes depending on level
  const baseClasses = "relative overflow-hidden rounded-2xl border transition-all duration-500 ease-out";
  
  const levelClasses = {
    quiet: "bg-zinc-950/20 border-white/[0.04] backdrop-blur-sm",
    default: "bg-zinc-900/40 border-white/[0.08] backdrop-blur-md shadow-lg shadow-black/20",
    featured: "bg-zinc-900/60 border-white/[0.15] backdrop-blur-lg shadow-xl shadow-black/40",
  };

  const interactiveClasses = interactive
    ? "hover:border-white/[0.2] hover:bg-zinc-900/50 hover:shadow-2xl hover:shadow-black/50 cursor-pointer focus-within:ring-2 focus-within:ring-white/30 focus-within:outline-none"
    : "";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          onClick?.();
        }
      }}
      tabIndex={onClick ? 0 : undefined}
      className={`${baseClasses} ${levelClasses[level]} ${interactiveClasses} ${className}`}
      style={
        spotlight && isHovered
          ? ({
              "--mouse-x": `${coords.x}px`,
              "--mouse-y": `${coords.y}px`,
            } as React.CSSProperties)
          : {}
      }
    >
      {/* Spotlight highlight layer */}
      {spotlight && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)`,
          }}
        />
      )}
      
      {/* Light border spotlight layer */}
      {spotlight && isHovered && (
        <div
          className="pointer-events-none absolute -inset-px rounded-2xl opacity-100 transition-opacity duration-500"
          style={{
            background: `radial-gradient(120px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.15), transparent 80%)`,
            maskImage: "linear-gradient(black, black)",
            WebkitMaskImage: "linear-gradient(black, black)",
          }}
        />
      )}

      {/* Card Content */}
      <div className="relative z-10 h-full w-full">{children}</div>
    </div>
  );
}
