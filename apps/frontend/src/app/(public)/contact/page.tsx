"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/animated/GlassCard";
import { HeroEntrance } from "@/components/animated/HeroEntrance";
import { ScrollReveal } from "@/components/animated/ScrollReveal";
import { Mail, MapPin, Phone, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 pb-20 pt-10">
      <section className="container mx-auto px-4 md:px-8 text-center space-y-4">
        <HeroEntrance delay={0.1}>
          <Badge variant="ieee" className="px-4 py-1 text-sm">
            Get in Touch
          </Badge>
        </HeroEntrance>

        <HeroEntrance delay={0.2}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Contact <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">MMIT IEEE SB</span>
          </h1>
        </HeroEntrance>

        <HeroEntrance delay={0.3}>
          <p className="text-slate-400 max-w-xl mx-auto text-base">
            Have questions about membership, events, sponsorship, or technical collaborations? Drop us a message below.
          </p>
        </HeroEntrance>
      </section>

      <section className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Contact Details & Map */}
          <ScrollReveal direction="left" delay={0.1}>
            <GlassCard className="space-y-6 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-white">Contact Information</h2>

                <div className="space-y-4 text-sm text-slate-300">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-sky-400 shrink-0 mt-1" />
                    <div>
                      <p className="font-semibold text-white">MMIT IEEE Student Branch</p>
                      <p className="text-slate-400 text-xs mt-0.5">
                        Marathwada Mitra Mandal&apos;s Institute of Technology (MMIT), Survey No. 35, Vadgaon Shinde Road, Lohgaon, Pune - 411047, Maharashtra, India.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-sky-400 shrink-0" />
                    <div>
                      <p className="font-semibold text-white">Email Inquiries</p>
                      <p className="text-slate-400 text-xs">ieee@mmit.edu.in</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl overflow-hidden border border-slate-800 h-48 bg-slate-900 flex items-center justify-center text-xs text-slate-500">
                <span>Google Maps Location: MMIT Lohgaon Campus</span>
              </div>
            </GlassCard>
          </ScrollReveal>

          {/* Contact Form */}
          <ScrollReveal direction="right" delay={0.2}>
            <GlassCard className="space-y-6">
              <h2 className="text-2xl font-bold text-white">Send Us a Message</h2>

              {submitted ? (
                <div className="text-center py-12 space-y-3">
                  <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
                  <h3 className="text-xl font-bold text-white">Message Sent Successfully!</h3>
                  <p className="text-sm text-slate-400 max-w-sm mx-auto">
                    Thank you for reaching out. An IEEE student officer will respond to your inquiry shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Your Full Name</label>
                    <Input required placeholder="John Doe" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Email Address</label>
                    <Input required type="email" placeholder="john@example.com" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Subject</label>
                    <Input required placeholder="Membership inquiry / Event sponsorship" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Message Body</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Write your message details..."
                      className="w-full rounded-lg border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <Button type="submit" variant="gradient" className="w-full h-11 gap-2">
                    <Send className="h-4 w-4" />
                    <span>Submit Message</span>
                  </Button>
                </form>
              )}
            </GlassCard>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
