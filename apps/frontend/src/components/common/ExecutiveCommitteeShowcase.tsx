"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/animated/GlassCard";
import { ScrollReveal } from "@/components/animated/ScrollReveal";
import { UserCheck, ArrowRight, Loader2, Linkedin } from "lucide-react";

const fallbackMembers = [
  {
    _id: "fb-1",
    name: "Dr Monika Dangore",
    designation: "IEEE Student Branch Counsellor",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    bio: "Faculty advisor guiding overall student branch strategy, research publications, and IEEE Region 10 governance.",
  },
  {
    _id: "fb-2",
    name: "Sankalp Indish",
    designation: "Branch Chair",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    bio: "Chief student executive overseeing annual event roadmaps, chapter leads, and IEEE Pune Section collaborations.",
  },
  {
    _id: "fb-3",
    name: "Soham Shinde",
    designation: "Branch Vice Chair",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    socialLinks: { linkedin: "https://www.linkedin.com/in/soham-shinde-99046127a/" },
    bio: "Directing operational activities, member onboarding, and inter-chapter coordination.",
  },
  {
    _id: "fb-4",
    name: "Maithilee Kedare",
    designation: "Student Branch Secretary",
    avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    socialLinks: { linkedin: "https://www.linkedin.com/in/maithileekedare/" },
    bio: "Managing official branch documentation, meeting proceedings, and IEEE reporting.",
  },
  {
    _id: "fb-5",
    name: "Tanmayi Gadge",
    designation: "Student Branch Joint Secretary",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    socialLinks: { linkedin: "https://www.linkedin.com/in/tanmayi-gadge-854723276/" },
    bio: "Assisting branch communications, membership drives, and event logistics.",
  },
  {
    _id: "fb-6",
    name: "Gargi Shinde",
    designation: "Student Branch Treasurer",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
    bio: "Managing financial allocation, event budgets, and sponsorship accounts.",
  },
  {
    _id: "fb-7",
    name: "Satyam Patil",
    designation: "Student Branch Web Master",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
    bio: "Engineering technical web applications and digital infrastructure.",
  },
  {
    _id: "fb-8",
    name: "Geet Jamdal",
    designation: "Student Branch Web Master",
    avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=80",
    bio: "Developing web platforms, user interfaces, and online media deployment.",
  },
];

export const ExecutiveCommitteeShowcase: React.FC = () => {
  const { data: members = [], isLoading } = useQuery({
    queryKey: ["public-committee-showcase"],
    queryFn: async () => {
      try {
        const res = await api.get("/committee?isExecutive=true");
        return res.data?.data || [];
      } catch (err) {
        return [];
      }
    },
  });

  const displayList = members.length > 0 ? members.slice(0, 8) : fallbackMembers;

  return (
    <section id="executive-committee" className="container mx-auto px-4 md:px-8 space-y-10 scroll-mt-24">
      <ScrollReveal direction="up" delay={0.1} className="text-center space-y-3">
        <Badge variant="ieee" className="px-3.5 py-1 text-xs gap-1.5">
          <UserCheck className="h-3.5 w-3.5 text-sky-400" />
          <span>Branch Leadership</span>
        </Badge>
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">
          Executive Committee Members
        </h2>
        <p className="text-slate-400 max-w-xl mx-auto text-sm">
          Meet the student leaders, team leads, and faculty counselors directing activities at MMIT IEEE Student Branch.
        </p>
      </ScrollReveal>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayList.map((member: any, index: number) => (
            <ScrollReveal key={member._id || index} direction="up" delay={index * 0.05}>
              <GlassCard className="space-y-4 p-6 hover:border-sky-500/40 transition-all text-center h-full flex flex-col justify-between">
                <div className="space-y-4">
                  <Avatar
                    src={member.avatarUrl}
                    alt={member.name}
                    fallback={member.name ? member.name.substring(0, 2).toUpperCase() : "EX"}
                    className="h-24 w-24 mx-auto border-2 border-sky-500/40 shadow-lg shadow-sky-500/10"
                  />

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-white tracking-tight">{member.name}</h3>
                    <p className="text-sm font-semibold text-sky-400">{member.designation}</p>
                  </div>

                  {member.bio && (
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {member.bio}
                    </p>
                  )}
                </div>

                {member.socialLinks?.linkedin && (
                  <div className="pt-2 flex justify-center">
                    <a
                      href={member.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 px-3 py-1.5 rounded-full border border-sky-500/30 transition-all"
                    >
                      <Linkedin className="h-3.5 w-3.5 text-sky-400" />
                      <span>LinkedIn Profile</span>
                    </a>
                  </div>
                )}
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      )}

      <div className="text-center pt-2">
        <Link href="/members">
          <Button variant="outline" className="gap-2 border-sky-500/30 text-sky-300 hover:text-white">
            <span>View Full Roster & Members</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
};
