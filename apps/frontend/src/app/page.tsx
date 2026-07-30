import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HeroEntrance } from "@/components/animated/HeroEntrance";
import { ScrollReveal } from "@/components/animated/ScrollReveal";
import { GlassCard } from "@/components/animated/GlassCard";
import { AnimatedCounter } from "@/components/animated/AnimatedCounter";
import { HeroCarousel } from "@/components/common/HeroCarousel";
import { ExecutiveCommitteeShowcase } from "@/components/common/ExecutiveCommitteeShowcase";
import { VantaNetBackground } from "@/components/animated/VantaNetBackground";
import { ArrowRight, Sparkles, Shield, Rocket } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section with Interactive Vanta 3D Network Backdrop */}
      <VantaNetBackground
        color={0x0284c7} // IEEE Ocean/Sky Blue (#0284c7)
        backgroundColor={0x030712} // Slate 950
        points={14.00}
        maxDistance={22.00}
        spacing={15.00}
        className="py-16 md:py-24"
        overlayVariant="both"
      >
        <div className="container mx-auto px-4 md:px-8 text-center space-y-6">
          <HeroEntrance delay={0.1}>
            <Badge variant="ieee" className="px-4 py-1.5 text-sm gap-2">
              <Sparkles className="h-4 w-4 text-sky-400" />
              <span>MMIT IEEE Student Branch Platform 2.0</span>
            </Badge>
          </HeroEntrance>

          <HeroEntrance delay={0.2}>
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-tight text-slate-100">
              Advancing Technology for <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">Humanity & Innovation</span>
            </h1>
          </HeroEntrance>

          <HeroEntrance delay={0.3}>
            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Empowering future engineers and leaders through technical excellence, research publications, hackathons, and global IEEE networking.
            </p>
          </HeroEntrance>

          <HeroEntrance delay={0.4}>
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <Link href="/events">
                <Button variant="gradient" size="lg" className="gap-2">
                  <span>Explore Events</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="outline" size="lg">
                  Learn About Us
                </Button>
              </Link>
            </div>
          </HeroEntrance>
        </div>
      </VantaNetBackground>

      {/* Featured Landing Slideshow with 50/50 Split Layout */}
      <section className="container mx-auto px-4 md:px-8">
        <ScrollReveal direction="up" delay={0.1}>
          <HeroCarousel />
        </ScrollReveal>
      </section>

      {/* Dynamic Impact Counters */}
      <section className="container mx-auto px-4 md:px-8">
        <ScrollReveal direction="up" delay={0.1}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <GlassCard className="text-center space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-sky-400">
                <AnimatedCounter value={250} prefix="" suffix="+" />
              </div>
              <p className="text-sm font-medium text-slate-400">Active Members</p>
            </GlassCard>

            <GlassCard className="text-center space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-blue-400">
                <AnimatedCounter value={45} prefix="" suffix="+" />
              </div>
              <p className="text-sm font-medium text-slate-400">Technical Events</p>
            </GlassCard>

            <GlassCard className="text-center space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-indigo-400">
                <AnimatedCounter value={18} prefix="" suffix="+" />
              </div>
              <p className="text-sm font-medium text-slate-400">Awards & Honors</p>
            </GlassCard>

            <GlassCard className="text-center space-y-2">
              <div className="text-3xl md:text-4xl font-extrabold text-sky-300">
                <AnimatedCounter value={100} prefix="" suffix="%" />
              </div>
              <p className="text-sm font-medium text-slate-400">Dynamic CMS Powered</p>
            </GlassCard>
          </div>
        </ScrollReveal>
      </section>

      {/* Dynamic Executive Committee Members Showcase */}
      <ExecutiveCommitteeShowcase />

      {/* Feature Highlights Grid with Secondary Themed Vanta Background */}
      <section className="container mx-auto px-4 md:px-8">
        <VantaNetBackground
          color={0x00629b} // IEEE Deep Brand Blue (#00629B)
          backgroundColor={0x090d16} // Slate dark blue tone
          points={10.00}
          maxDistance={20.00}
          spacing={18.00}
          className="rounded-3xl p-8 md:p-12 border border-sky-500/20 shadow-2xl shadow-sky-950/30"
          overlayVariant="both"
        >
          <div className="space-y-12">
            <ScrollReveal direction="up" delay={0.1} className="text-center space-y-3">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
                Enterprise Architecture & Capabilities
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto">
                Engineered for high availability, zero latency, dynamic content governance, and accessible user experience.
              </p>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ScrollReveal direction="up" delay={0.2}>
                <GlassCard className="space-y-4 h-full">
                  <div className="h-12 w-12 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
                    <Rocket className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Next.js App Router & ISR</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Incremental Static Regeneration delivers sub-100ms load times with automated background content revalidation.
                  </p>
                </GlassCard>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.3}>
                <GlassCard className="space-y-4 h-full">
                  <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Shield className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">JWT & Granular RBAC</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Secure httpOnly dual-token authentication paired with fine-grained permission controls across roles.
                  </p>
                </GlassCard>
              </ScrollReveal>

              <ScrollReveal direction="up" delay={0.4}>
                <GlassCard className="space-y-4 h-full">
                  <div className="h-12 w-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold text-white">Cloudinary Asset Pipeline</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Direct client-to-cloud signed uploads with on-the-fly image optimization, responsive formats, and blur placeholders.
                  </p>
                </GlassCard>
              </ScrollReveal>
            </div>
          </div>
        </VantaNetBackground>
      </section>
    </div>
  );
}
