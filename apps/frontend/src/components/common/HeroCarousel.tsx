"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface CarouselSlide {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  imageUrl: string;
  linkHref?: string;
  linkText?: string;
}

const defaultSlides: CarouselSlide[] = [
  {
    id: "slide-1",
    title: "Industrial Visit to National PARAM Supercomputing Facility",
    subtitle:
      "Explored advanced supercomputing systems including PARAM Siddhi-AI, PARAM Brahma, and AIRAWAT with C-DAC Pune experts.",
    tag: "Flagship Industrial Visit",
    imageUrl:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1600&auto=format&fit=crop&q=80",
    linkHref: "/events",
    linkText: "Read Visit Details",
  },
  {
    id: "slide-2",
    title: "Building AI Agents: International Hands-on Expert Session",
    subtitle:
      "Master deep learning models, autonomous workflows, and LLM integrations with international IEEE guest scholars.",
    tag: "Technical Workshop",
    imageUrl:
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1600&auto=format&fit=crop&q=80",
    linkHref: "/events",
    linkText: "Explore Session Details",
  },
  {
    id: "slide-3",
    title: "PRAXIS: Premier Scholar's Knowledge Exchange",
    subtitle:
      "A monthly recurring global hands-on workshop series hosted by MMIT IEEE Student Branch in collaboration with IEEE JCTS Pune Section.",
    tag: "Scholar Series",
    imageUrl:
      "https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&auto=format&fit=crop&q=80",
    linkHref: "/about",
    linkText: "Discover MMIT IEEE SB",
  },
];

interface HeroCarouselProps {
  slides?: CarouselSlide[];
  autoPlayInterval?: number;
}

export const HeroCarousel: React.FC<HeroCarouselProps> = ({
  slides: propSlides,
  autoPlayInterval = 6000,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Fetch Public Active Hero Slides from Backend API
  const { data: apiSlides = [] } = useQuery({
    queryKey: ["public-hero-slides"],
    queryFn: async () => {
      try {
        const res = await api.get("/hero-slides/public");
        const list = res.data?.data || [];
        return list.map((s: any) => ({
          id: s._id || s.id,
          title: s.title,
          subtitle: s.subtitle,
          tag: s.tag,
          imageUrl: s.imageUrl,
          linkHref: s.linkHref,
          linkText: s.linkText,
        }));
      } catch (err) {
        return [];
      }
    },
  });

  const activeSlides: CarouselSlide[] =
    propSlides || (apiSlides.length > 0 ? apiSlides : defaultSlides);

  // Preload slide images
  useEffect(() => {
    activeSlides.forEach((slide) => {
      if (typeof window !== "undefined" && slide.imageUrl) {
        const img = new window.Image();
        img.src = slide.imageUrl;
      }
    });
  }, [activeSlides]);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    setProgressKey((prev) => prev + 1);
  }, [activeSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
    setProgressKey((prev) => prev + 1);
  }, [activeSlides.length]);

  // Auto-play timer
  useEffect(() => {
    if (isHovered || isPaused) return;
    const interval = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(interval);
  }, [nextSlide, isHovered, isPaused, autoPlayInterval]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (carouselRef.current && carouselRef.current.contains(document.activeElement)) {
        if (e.key === "ArrowLeft") {
          prevSlide();
        } else if (e.key === "ArrowRight") {
          nextSlide();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    const swipeThreshold = 50;
    if (info.offset.x < -swipeThreshold) {
      nextSlide();
    } else if (info.offset.x > swipeThreshold) {
      prevSlide();
    }
  };

  const safeIndex = currentIndex % activeSlides.length;
  const activeSlide = activeSlides[safeIndex] || defaultSlides[0];

  return (
    <div
      ref={carouselRef}
      tabIndex={0}
      className="relative w-full overflow-hidden rounded-3xl border border-sky-500/20 bg-slate-950/90 backdrop-blur-xl shadow-2xl shadow-sky-950/40 group focus:outline-none focus:ring-2 focus:ring-sky-500/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="MMIT IEEE Featured Slideshow"
    >
      {/* 50 / 50 Split Layout: Short Description Half & Slideshow Half */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 md:p-10 min-h-[440px] md:min-h-[480px]">
        {/* Left Side (6 Columns / 50% Width): Short Description & Action Controls */}
        <div className="lg:col-span-6 space-y-6 z-10 flex flex-col justify-between h-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${activeSlide.id || safeIndex}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.45 }}
              className="space-y-4"
            >
              <Badge
                variant="ieee"
                className="px-3.5 py-1 text-xs gap-1.5 shadow-lg shadow-sky-500/20 bg-sky-500/10 border-sky-500/30"
              >
                <Sparkles className="h-3.5 w-3.5 text-sky-400" />
                <span>{activeSlide.tag}</span>
              </Badge>

              <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
                {activeSlide.title}
              </h2>

              <p className="text-sm md:text-base text-slate-300 line-clamp-4 leading-relaxed">
                {activeSlide.subtitle}
              </p>

              {activeSlide.linkHref && (
                <div className="pt-2">
                  <Link href={activeSlide.linkHref}>
                    <Button variant="gradient" size="lg" className="gap-2 shadow-lg shadow-sky-500/20">
                      <span>{activeSlide.linkText || "View Details"}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Controls Bar: Pause & Dot Indicators */}
          <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80">
            <button
              onClick={() => setIsPaused((prev) => !prev)}
              className="text-slate-400 hover:text-white transition-colors p-1.5 rounded-lg bg-slate-900 border border-slate-800"
              aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
              title={isPaused ? "Resume auto-play" : "Pause auto-play"}
            >
              {isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
            </button>

            <div className="h-3 w-px bg-slate-800" />

            <div className="flex items-center gap-2">
              {activeSlides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setProgressKey((prev) => prev + 1);
                  }}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    idx === safeIndex
                      ? "w-7 bg-gradient-to-r from-sky-400 to-blue-500 shadow-sm shadow-sky-400/50"
                      : "w-2.5 bg-slate-700 hover:bg-slate-500"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Side (6 Columns / 50% Width): 3D Visual Slide Showcase */}
        <div className="lg:col-span-6 relative h-[320px] md:h-[400px] w-full rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-900 group/image">
          <AnimatePresence mode="wait">
            <motion.div
              key={`img-${activeSlide.id || safeIndex}`}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleDragEnd}
              className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing"
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
                className="relative w-full h-full"
              >
                {activeSlide.imageUrl ? (
                  <Image
                    src={activeSlide.imageUrl}
                    alt={activeSlide.title}
                    fill
                    priority={safeIndex === 0}
                    sizes="(max-width: 768px) 100vw, 600px"
                    quality={85}
                    className="object-cover object-center"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-500">
                    Slide Banner
                  </div>
                )}
              </motion.div>

              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60" />
            </motion.div>
          </AnimatePresence>

          {/* Navigation Chevron Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-slate-950/70 border border-slate-700/80 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover/image:opacity-100 hover:bg-sky-600 transition-all duration-300 shadow-xl"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-slate-950/70 border border-slate-700/80 text-white backdrop-blur-md flex items-center justify-center opacity-0 group-hover/image:opacity-100 hover:bg-sky-600 transition-all duration-300 shadow-xl"
            aria-label="Next Slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Live Auto-Play Countdown Progress Bar */}
      {!isPaused && !isHovered && (
        <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-slate-900/60">
          <motion.div
            key={progressKey}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
            className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-sky-400"
          />
        </div>
      )}
    </div>
  );
};
