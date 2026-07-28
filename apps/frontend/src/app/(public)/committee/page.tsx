"use client";

import React, { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { GlassCard } from "@/components/animated/GlassCard";
import { HeroEntrance } from "@/components/animated/HeroEntrance";
import { ScrollReveal } from "@/components/animated/ScrollReveal";
import { Linkedin, Github, Mail, ShieldCheck, Loader2 } from "lucide-react";

export default function CommitteePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCommittee() {
      try {
        const res = await api.get("/committee");
        setMembers(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCommittee();
  }, []);

  return (
    <div className="space-y-16 pb-20 pt-10">
      {/* Header */}
      <section className="container mx-auto px-4 md:px-8 text-center space-y-4">
        <HeroEntrance delay={0.1}>
          <Badge variant="ieee" className="px-4 py-1 text-sm">
            Academic Year 2025 - 2026
          </Badge>
        </HeroEntrance>

        <HeroEntrance delay={0.2}>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
            Executive <span className="bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Committee</span>
          </h1>
        </HeroEntrance>

        <HeroEntrance delay={0.3}>
          <p className="text-slate-400 max-w-2xl mx-auto text-base">
            Meet the passionate student leaders, faculty counselors, and mentors driving technological activities at MMIT IEEE Student Branch.
          </p>
        </HeroEntrance>
      </section>

      {/* Roster Grid */}
      <section className="container mx-auto px-4 md:px-8">
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
          </div>
        ) : members.length === 0 ? (
          <GlassCard className="text-center py-12 text-slate-400">
            No committee records found yet.
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member, index) => (
              <ScrollReveal key={member._id} direction="up" delay={index * 0.1}>
                <GlassCard className="text-center space-y-4 p-6">
                  <Avatar
                    src={member.avatarUrl}
                    alt={member.name}
                    fallback={member.name.substring(0, 2).toUpperCase()}
                    className="h-24 w-24 mx-auto border-2 border-sky-500/40 shadow-lg shadow-sky-500/10"
                  />

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-sm font-semibold text-sky-400">{member.designation}</p>
                    <Badge variant="secondary" className="text-xs">
                      {member.category}
                    </Badge>
                  </div>

                  {member.bio && (
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {member.bio}
                    </p>
                  )}

                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-3 pt-2">
                    {member.socialLinks?.linkedin && (
                      <a
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-sky-400 transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    )}
                    {member.socialLinks?.github && (
                      <a
                        href={member.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {member.socialLinks?.email && (
                      <a
                        href={`mailto:${member.socialLinks.email}`}
                        className="text-slate-400 hover:text-sky-400 transition-colors"
                      >
                        <Mail className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </GlassCard>
              </ScrollReveal>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
