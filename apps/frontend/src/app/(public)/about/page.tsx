import React from "react";
import Metadata from "next";
import { Badge } from "@/components/ui/badge";
import { GlassCard } from "@/components/animated/GlassCard";
import { HeroEntrance } from "@/components/animated/HeroEntrance";
import { ScrollReveal } from "@/components/animated/ScrollReveal";
import { VantaNetBackground } from "@/components/animated/VantaNetBackground";
import { Shield, Target, Lightbulb, Compass, Award, Globe, Users, BookOpen, Calendar, MapPin } from "lucide-react";

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
              STB60226400 | IEEE Region 10 | Pune Section
            </Badge>
          </HeroEntrance>

          <HeroEntrance delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto">
              About MMIT IEEE <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Student Branch</span>
            </h1>
          </HeroEntrance>

          <HeroEntrance delay={0.3}>
            <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed font-light">
              &ldquo;Aiming to Build Products for Society&rdquo; — Empowering students through technology, innovation, and global collaboration at Marathwada Mitra Mandal&apos;s Institute of Technology, Lohgaon, Pune.
            </p>
          </HeroEntrance>
        </div>
      </VantaNetBackground>

      {/* History & Establishment Timeline Section */}
      <section className="container mx-auto px-4 md:px-8">
        <GlassCard className="p-8 md:p-12 space-y-6 border-sky-500/30">
          <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
            <Compass className="h-6 w-6 text-sky-400" />
            <h2 className="text-2xl md:text-3xl font-extrabold text-white">Our Journey & Establishment</h2>
          </div>

          <div className="space-y-4 text-slate-300 leading-relaxed text-sm md:text-base">
            <p>
              The MMIT journey into IEEE activities began with the formation of the <strong>&ldquo;MMIT IEEE Club&rdquo;</strong> initiated by the Computer Engineering Department under the guidance and leadership of <strong>Dr. Monika Dangore</strong> on <strong>26th August 2024</strong>. The club&apos;s committee structure followed the standard IEEE Student Branch Executive and Operational Committee model.
            </p>
            <p>
              After receiving official approval from the IEEE Society on <strong>5th December 2024</strong>, the MMIT IEEE Club was formally established as the <strong>MMIT IEEE Student Branch</strong>. Since then, the branch has been actively engaging students through international expert sessions, hands-on workshops, supercomputing visits, and community projects aimed at advancing technology for humanity.
            </p>
          </div>

          {/* Quick Institutional Metadata Badge Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-800/80">
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">IEEE REGION</span>
              <span className="text-white font-bold text-base flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-sky-400" /> Region 10 (Asia-Pacific)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">STUDENT BRANCH CODE</span>
              <span className="text-white font-bold text-base font-mono text-sky-300">
                STB60226400 (STB99311)
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
              <span className="text-xs text-slate-400 font-semibold block">SCHOOL CODE</span>
              <span className="text-white font-bold text-base font-mono text-sky-300">
                60227769
              </span>
            </div>
          </div>
        </GlassCard>
      </section>

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
                To foster technological innovation and engineering excellence for the benefit of humanity. We provide students with hands-on technical training, research guidance, hackathon opportunities, and global leadership experiences.
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
                To be recognized as a premier student branch in IEEE Pune Section, empowering students to solve real-world industrial and societal problems through cutting-edge engineering products.
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
                Hands-on training in AI Agents, Supercomputing, Dark Web, and Cloud Computing.
              </p>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.3}>
            <GlassCard className="space-y-3">
              <Award className="h-8 w-8 text-blue-400" />
              <h3 className="font-bold text-white text-lg">Knowledge Exchange</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monthly PRAXIS series in collaboration with IEEE Pune Section.
              </p>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.4}>
            <GlassCard className="space-y-3">
              <Globe className="h-8 w-8 text-indigo-400" />
              <h3 className="font-bold text-white text-lg">Global Networking</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct connections with Microsoft experts, C-DAC scientists, and IEEE Region 10 leads.
              </p>
            </GlassCard>
          </ScrollReveal>

          <ScrollReveal direction="up" delay={0.5}>
            <GlassCard className="space-y-3">
              <Users className="h-8 w-8 text-sky-300" />
              <h3 className="font-bold text-white text-lg">Leadership Development</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Empowering student members to direct events, technical chapters, and branch operations.
              </p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
