"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { GlassCard } from "@/components/animated/GlassCard";
import { ScrollReveal } from "@/components/animated/ScrollReveal";
import { Calendar, Network, ListFilter, Loader2, Award, UserCheck, Shield } from "lucide-react";

const fallbackArchiveData: Record<string, any[]> = {
  "2024-2025": [
    {
      _id: "arch-1",
      name: "Dr. Subhash Rathod",
      designation: "Branch Counselor",
      academicYear: "2024-2025",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Guided IEEE Student Branch activities, industrial visits to C-DAC, and PRAXIS knowledge exchange.",
      ieeeMemberId: "STB99311-BC24",
    },
    {
      _id: "arch-2",
      name: "Abhishek S. Deshmukh",
      designation: "Chairperson",
      academicYear: "2024-2025",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
      bio: "Led student branch operations, Field2Frame documentary challenge, and IEEE Pune Section collaborations.",
      ieeeMemberId: "98765401",
    },
    {
      _id: "arch-3",
      name: "Pooja V. Kulkarni",
      designation: "Vice Chair & Secretary",
      academicYear: "2024-2025",
      avatarUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
      bio: "Managed inter-chapter communications, event documentations, and member onboarding.",
      ieeeMemberId: "98765402",
    },
    {
      _id: "arch-4",
      name: "Sanket M. Patil",
      designation: "Technical Lead & Webmaster",
      academicYear: "2024-2025",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
      bio: "Directed technical workshops, AI agent hands-on sessions, and website infrastructure.",
      ieeeMemberId: "98765403",
    },
  ],
  "2023-2024": [
    {
      _id: "arch-5",
      name: "Dr. Monika Dangore",
      designation: "Branch Counselor",
      academicYear: "2023-2024",
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80",
      bio: "Spearheaded initial student branch establishment and IEEE Pune Section affiliation.",
      ieeeMemberId: "STB99311-BC23",
    },
    {
      _id: "arch-6",
      name: "Rohan V. Sharma",
      designation: "Student Chair",
      academicYear: "2023-2024",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80",
      bio: "Pioneered early technical hackathons and student membership growth.",
      ieeeMemberId: "98765301",
    },
  ],
};

export const ExecutiveCommitteeArchive: React.FC = () => {
  const [selectedYear, setSelectedYear] = useState("2024-2025");
  const [viewFormat, setViewFormat] = useState<"chart" | "list">("chart");

  const { data: dbMembers = [], isLoading } = useQuery({
    queryKey: ["committee-archive", selectedYear],
    queryFn: async () => {
      try {
        const res = await api.get(`/committee?year=${selectedYear}`);
        return res.data?.data || [];
      } catch (err) {
        return [];
      }
    },
  });

  const activeMembers =
    dbMembers.length > 0
      ? dbMembers
      : fallbackArchiveData[selectedYear] || fallbackArchiveData["2024-2025"];

  return (
    <section className="container mx-auto px-4 md:px-8 space-y-10 pt-10 border-t border-slate-800/80">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-800 pb-6">
        <ScrollReveal direction="up" delay={0.1} className="space-y-2 text-center md:text-left">
          <Badge variant="ieee" className="px-3.5 py-1 text-xs gap-1.5">
            <Award className="h-3.5 w-3.5 text-sky-400" />
            <span>Executive Archives</span>
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Past Executive Committee Archives (A.Y. {selectedYear})
          </h2>
          <p className="text-slate-400 text-sm max-w-xl">
            Explore previous student branch leadership hierarchies, counselor guidance, and team structures year-by-year.
          </p>
        </ScrollReveal>

        {/* Dropdown Selector & View Toggle */}
        <ScrollReveal direction="up" delay={0.2} className="flex flex-wrap items-center gap-3">
          {/* Year Dropdown */}
          <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-xl px-3 py-2 text-sm">
            <Calendar className="h-4 w-4 text-sky-400 shrink-0" />
            <span className="text-xs text-slate-400 font-semibold whitespace-nowrap">A.Y.</span>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="bg-transparent text-white font-bold text-sm focus:outline-none cursor-pointer pr-1"
            >
              <option value="2025-2026" className="bg-slate-950 text-white">2025 - 2026 (Current)</option>
              <option value="2024-2025" className="bg-slate-950 text-white">2024 - 2025</option>
              <option value="2023-2024" className="bg-slate-950 text-white">2023 - 2024</option>
              <option value="2022-2023" className="bg-slate-950 text-white">2022 - 2023</option>
            </select>
          </div>

          {/* Format Toggle Buttons */}
          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 text-xs">
            <button
              onClick={() => setViewFormat("chart")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewFormat === "chart"
                  ? "bg-ieee-blue text-white shadow-md shadow-sky-900/30 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              <span>Org Chart</span>
            </button>
            <button
              onClick={() => setViewFormat("list")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                viewFormat === "list"
                  ? "bg-ieee-blue text-white shadow-md shadow-sky-900/30 font-bold"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>Table Roster</span>
            </button>
          </div>
        </ScrollReveal>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
        </div>
      ) : activeMembers.length === 0 ? (
        <GlassCard className="text-center py-12 text-slate-400">
          No past committee records found for A.Y. {selectedYear}.
        </GlassCard>
      ) : viewFormat === "chart" ? (
        /* FORMAT 1: ORGANIZATIONAL HIERARCHY CHART */
        <ScrollReveal direction="up" delay={0.2} className="space-y-8">
          <GlassCard className="p-6 md:p-10 border-sky-500/20 bg-slate-950/90 shadow-2xl">
            <div className="space-y-10 text-center">
              {/* Level 1: Counselor / Advisor */}
              <div className="flex flex-col items-center space-y-3">
                <Badge variant="ieee" className="px-3 py-0.5 text-[11px] gap-1">
                  <Shield className="h-3 w-3 text-sky-400" />
                  <span>Faculty Counselor & Guidance</span>
                </Badge>

                {activeMembers
                  .filter((m: any) => m.designation.toLowerCase().includes("counselor") || m.designation.toLowerCase().includes("advisor"))
                  .map((m: any) => (
                    <GlassCard key={m._id} className="max-w-md w-full p-4 border-sky-500/40 bg-sky-950/20">
                      <div className="flex items-center gap-4 text-left">
                        <Avatar src={m.avatarUrl} alt={m.name} className="h-16 w-16 border-2 border-sky-400" />
                        <div>
                          <h4 className="font-bold text-white text-base">{m.name}</h4>
                          <p className="text-xs text-sky-400 font-semibold">{m.designation}</p>
                          <span className="text-[10px] text-slate-400 font-mono">A.Y. {m.academicYear || selectedYear}</span>
                        </div>
                      </div>
                    </GlassCard>
                  ))}
              </div>

              {/* Hierarchy Tree Line */}
              <div className="w-0.5 h-8 bg-gradient-to-b from-sky-500 to-blue-500 mx-auto" />

              {/* Level 2: Executive Leadership */}
              <div className="space-y-4">
                <Badge variant="secondary" className="px-3 py-0.5 text-[11px] gap-1">
                  <UserCheck className="h-3 w-3 text-blue-400" />
                  <span>Executive Leadership</span>
                </Badge>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                  {activeMembers
                    .filter((m: any) => !m.designation.toLowerCase().includes("counselor") && !m.designation.toLowerCase().includes("advisor"))
                    .map((m: any) => (
                      <GlassCard key={m._id} className="p-5 border-slate-800 hover:border-sky-500/40 transition-all text-center space-y-3">
                        <Avatar src={m.avatarUrl} alt={m.name} className="h-20 w-20 mx-auto border-2 border-sky-500/30" />
                        <div className="space-y-1">
                          <h4 className="font-bold text-white text-base tracking-tight">{m.name}</h4>
                          <p className="text-xs text-sky-400 font-semibold">{m.designation}</p>
                          {m.ieeeMemberId && (
                            <span className="text-[10px] text-slate-500 font-mono block">ID: {m.ieeeMemberId}</span>
                          )}
                        </div>
                      </GlassCard>
                    ))}
                </div>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      ) : (
        /* FORMAT 2: STRUCTURED ROSTER TABLE VIEW */
        <ScrollReveal direction="up" delay={0.2}>
          <GlassCard className="p-0 overflow-hidden border-slate-800 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead className="bg-slate-950 border-b border-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4">MEMBER NAME</th>
                    <th scope="col" className="px-6 py-4">DESIGNATION / ROLE</th>
                    <th scope="col" className="px-6 py-4">ACADEMIC YEAR</th>
                    <th scope="col" className="px-6 py-4">IEEE MEMBER ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {activeMembers.map((m: any) => (
                    <tr key={m._id} className="hover:bg-sky-500/5 transition-colors">
                      <td className="px-6 py-4 font-bold text-white flex items-center gap-3">
                        <Avatar src={m.avatarUrl} alt={m.name} className="h-9 w-9 border border-sky-500/30" />
                        <span>{m.name}</span>
                      </td>
                      <td className="px-6 py-4 font-medium text-sky-400">{m.designation}</td>
                      <td className="px-6 py-4 font-mono text-slate-400">A.Y. {m.academicYear || selectedYear}</td>
                      <td className="px-6 py-4 font-mono text-slate-300">{m.ieeeMemberId || "STB99311"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </ScrollReveal>
      )}
    </section>
  );
};
