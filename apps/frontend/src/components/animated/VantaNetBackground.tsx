"use client";

import React, { useEffect, useRef, useState } from "react";

interface VantaNetBackgroundProps {
  color?: number;
  backgroundColor?: number;
  points?: number;
  maxDistance?: number;
  spacing?: number;
  showDots?: boolean;
  className?: string;
  children?: React.ReactNode;
  gradientOverlay?: boolean;
  overlayVariant?: "linear" | "radial" | "both" | "none";
}

export function VantaNetBackground({
  color = 0x0284c7, // IEEE sky/ocean blue (#0284c7) matching brand token
  backgroundColor = 0x030712, // Slate 950 deep background
  points = 12.00,
  maxDistance = 22.00,
  spacing = 16.00,
  showDots = true,
  className = "",
  children,
  gradientOverlay = true,
  overlayVariant = "both",
}: VantaNetBackgroundProps) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    let effect: any = null;

    const initVanta = () => {
      if (
        typeof window !== "undefined" &&
        (window as any).VANTA &&
        (window as any).THREE &&
        vantaRef.current
      ) {
        try {
          effect = (window as any).VANTA.NET({
            el: vantaRef.current,
            THREE: (window as any).THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color: color,
            backgroundColor: backgroundColor,
            points: points,
            maxDistance: maxDistance,
            spacing: spacing,
            showDots: showDots,
          });
          setVantaEffect(effect);
        } catch (err) {
          console.error("Vanta.NET initialization error:", err);
        }
      }
    };

    if (typeof window !== "undefined") {
      if ((window as any).VANTA && (window as any).THREE) {
        initVanta();
      } else {
        const interval = setInterval(() => {
          if ((window as any).VANTA && (window as any).THREE) {
            clearInterval(interval);
            initVanta();
          }
        }, 100);

        return () => clearInterval(interval);
      }
    }

    return () => {
      if (effect) {
        effect.destroy();
      }
    };
  }, [color, backgroundColor, points, maxDistance, spacing, showDots]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Vanta.NET WebGL 3D Canvas */}
      <div ref={vantaRef} className="absolute inset-0 z-0 w-full h-full" />

      {/* Styled Gradient Overlays for Seamless Theme Integration */}
      {gradientOverlay && (
        <>
          {(overlayVariant === "linear" || overlayVariant === "both") && (
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-b from-slate-950/80 via-slate-950/40 to-slate-950" />
          )}
          {(overlayVariant === "radial" || overlayVariant === "both") && (
            <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(ellipse_at_center,rgba(0,98,155,0.18)_0%,transparent_75%)]" />
          )}
        </>
      )}

      {/* Interactive Foreground Content */}
      <div className="relative z-20">{children}</div>
    </div>
  );
}
