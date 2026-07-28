"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/animated/GlassCard";
import { HeroEntrance } from "@/components/animated/HeroEntrance";
import { ScrollReveal } from "@/components/animated/ScrollReveal";
import { Image as ImageIcon, Sparkles } from "lucide-react";

const sampleAlbums = [
  {
    id: 1,
    title: "IEEE Annual Hackathon 2025",
    category: "Hackathon",
    date: "March 2025",
    coverUrl: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80",
    photoCount: 42,
  },
  {
    id: 2,
    title: "AI & Machine Learning Bootcamp",
    category: "Workshop",
    date: "February 2025",
    coverUrl: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80",
    photoCount: 28,
  },
  {
    id: 3,
    title: "IEEE Day Celebrations",
    category: "Social Event",
    date: "October 2024",
    coverUrl: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80",
    photoCount: 65,
  },
];

export default function GalleryPage() {
  return (
    <div className="space-y-16 pb-20 pt-10">
      <section className="container mx-auto px-4 md:px-8 text-center space-y-4">
        <HeroEntrance delay={0.1}>
          <Badge variant="ieee" className="px-4 py-1 text-sm">
            Event Memories & Highlights
          </Badge>
        </HeroEntrance>

        <HeroEntrance delay={0.2}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Photo <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Gallery</span>
          </h1>
        </HeroEntrance>

        <HeroEntrance delay={0.3}>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Capturing the spirit of innovation, collaboration, and learning across our student branch activities.
          </p>
        </HeroEntrance>
      </section>

      <section className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {sampleAlbums.map((album, index) => (
            <ScrollReveal key={album.id} direction="up" delay={index * 0.1}>
              <GlassCard className="space-y-4 overflow-hidden group cursor-pointer">
                <div className="relative h-56 w-full overflow-hidden rounded-xl bg-slate-900">
                  <img
                    src={album.coverUrl}
                    alt={album.title}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <Badge variant="ieee">{album.category}</Badge>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-xs text-slate-300 flex items-center gap-1.5 border border-slate-700">
                    <ImageIcon className="h-3.5 w-3.5 text-sky-400" />
                    <span>{album.photoCount} Photos</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-lg text-white group-hover:text-sky-400 transition-colors">
                    {album.title}
                  </h3>
                  <p className="text-xs text-slate-400">{album.date}</p>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
