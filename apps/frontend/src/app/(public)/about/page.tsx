import React from "react";
import Metadata from "next";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/animated/GlassCard";
import { HeroEntrance } from "@/components/animated/HeroEntrance";
import { ScrollReveal } from "@/components/animated/ScrollReveal";
import { VantaNetBackground } from "@/components/animated/VantaNetBackground";
import { Shield, Target, Lightbulb, Compass, Award, Globe, Users, BookOpen } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="space-y-20 pb-20 pt-4">
      {/* Hero Banner Section with Vanta 3D Backdrop */}
      <VantaNetBackground
        color={0x0284c7}
        backgroundColor={0x030712}
        points={12.00}
        maxDistance={20.00}
        className="py-16 md:py-20"
        overlayVariant="both"
      >
        <div className="container mx-auto px-4 md:px-8 text-center space-y-6">
          <HeroEntrance delay={0.1}>
            <Badge variant="ieee" className="px-4 py-1 text-sm">
              STB99311 | Pune Section
            </Badge>
          </HeroEntrance>

          <HeroEntrance delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto">
              About MMIT IEEE <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Student Branch</span>
            </h1>
          </HeroEntrance>

          <HeroEntrance delay={0.3}>
            <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              The Marathwada Mitra Mandal&apos;s Institute of Technology (MMIT) IEEE Student Branch is a vibrant technical community dedicated to advancing technological innovation and career growth for engineering students.
            </p>
          </HeroEntrance>
        </div>
      </VantaNetBackground>


      {/* Mission & Vision Grid */}
      <section className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <ScrollReveal direction="left" delay={0.1}>
            <GlassCard className="space-y-4 h-full">
              <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                <Target className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Our Mission</h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                To foster technological innovation and excellence for the benefit of humanity. We provide students with hands-on technical training, research guidance, hackathon opportunities, and leadership experiences.
              </p>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal direction="right" delay={0.2}>
            <GlassCard className="space-y-4 h-full">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <Lightbulb className="h-6 w-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Our Vision</h2>
              <p className="text-slate-400 leading-relaxed text-sm">
                To be recognized as a premier student branch in IEEE Pune Section, empowering students to solve real-world industrial and societal problems through engineering excellence.
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>

      {/* Core Pillar Values */}
      <section className="container mx-auto px-4 md:px-8 space-y-10">
        <ScrollReveal direction="up" delay={0.1} className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-white">Our Core Pillars</h2>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Built upon the global IEEE standard for technical advancement.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ScrollReveal direction="up" delay={0.2}>
            <GlassCard className="space-y-3">
              <BookOpen className="h-8 w-8 text-sky-400" />
              <h3 className="font-bold text-white text-lg">Technical Workshops</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Hands-on training in AI, Web Dev, IoT, Cyber Security, and Cloud Computing.
              </p>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <GlassCard className="space-y-3">
              <Award className="h-8 w-8 text-blue-400" />
              <h3 className="font-bold text-white text-lg">Hackathons & Competitions</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Annual flagship hackathons encouraging innovative engineering solutions.
              </p>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <GlassCard className="space-y-3">
              <Globe className="h-8 w-8 text-indigo-400" />
              <h3 className="font-bold text-white text-lg">Global Networking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct connections with IEEE Region 10 experts and industry leaders.
              </p>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.5}>
            <GlassCard className="space-y-3">
              <Users className="h-8 w-8 text-sky-300" />
              <h3 className="font-bold text-white text-lg">Leadership Development</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering student officers to manage events, budgets, and teams.
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
