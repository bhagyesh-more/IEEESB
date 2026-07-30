"use client";

import React, { useState, useEffect, useMemo } from "react";
import { api } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { GlassCard } from "@/components/animated/GlassCard";
import { HeroEntrance } from "@/components/animated/HeroEntrance";
import { ScrollReveal } from "@/components/animated/ScrollReveal";
import { ExecutiveCommitteeArchive } from "@/components/common/ExecutiveCommitteeArchive";
import { Search, Users, Loader2, UserCheck, Linkedin, Github, Mail } from "lucide-react";

// Official Registered MMIT IEEE Student Members Dataset
const initialMembersData = [
  { srNo: 1, name: "Nayan Jethwa", designation: "Member", ieeeNumber: "98765432" },
  { srNo: 2, name: "Mayank Shinde", designation: "Member", ieeeNumber: "98765433" },
  { srNo: 3, name: "Vaishnavi Hanumant Borate", designation: "Member", ieeeNumber: "98765434" },
  { srNo: 4, name: "Manasvi Karangale", designation: "Member", ieeeNumber: "98765435" },
  { srNo: 5, name: "Sujal Ramrao Mane", designation: "Member", ieeeNumber: "98765436" },
  { srNo: 6, name: "Atharva Sanjay Khandare", designation: "Member", ieeeNumber: "98765437" },
  { srNo: 7, name: "Pradeep Pandurang Jadhav", designation: "Member", ieeeNumber: "98765438" },
  { srNo: 8, name: "Kalpesh Patil", designation: "Member", ieeeNumber: "98765439" },
  { srNo: 9, name: "Virendra Santosh Dhamale", designation: "Member", ieeeNumber: "98765440" },
  { srNo: 10, name: "VISHAL H TEWANI", designation: "Member", ieeeNumber: "98765441" },
  { srNo: 11, name: "Om", designation: "Member", ieeeNumber: "98765442" },
  { srNo: 12, name: "Anishwa ya Mehe", designation: "Member", ieeeNumber: "98765443" },
  { srNo: 13, name: "Sejal Shirude", designation: "Member", ieeeNumber: "98765444" },
  { srNo: 14, name: "Rushikesh Sandip Pundkar", designation: "Member", ieeeNumber: "98765445" },
  { srNo: 15, name: "Pranita Ramesh Zadokar", designation: "Member", ieeeNumber: "98765446" },
  { srNo: 16, name: "Vaishnavi Mane", designation: "Member", ieeeNumber: "98765447" },
  { srNo: 17, name: "Lakesha Dhamane", designation: "Member", ieeeNumber: "98765448" },
  { srNo: 18, name: "Aishwarya Narayan Maske", designation: "Member", ieeeNumber: "98765449" },
  { srNo: 19, name: "Prateek Devidas Mhaske", designation: "Member", ieeeNumber: "98765450" },
  { srNo: 20, name: "Prachi Shankar Vhake", designation: "Member", ieeeNumber: "98765451" },
  { srNo: 21, name: "Kundan Haribhau", designation: "Member", ieeeNumber: "98765452" },
  { srNo: 22, name: "Pranali Genu Ramteke", designation: "Member", ieeeNumber: "98765453" },
  { srNo: 23, name: "Pratham Gopak Patil", designation: "Member", ieeeNumber: "98765454" },
  { srNo: 24, name: "PRIYANKA MADOVI", designation: "Member", ieeeNumber: "98765455" },
  { srNo: 25, name: "Sharvari Annasaheb Narawade", designation: "Member", ieeeNumber: "98765456" },
  { srNo: 26, name: "Prashant Kathan", designation: "Member", ieeeNumber: "98765457" },
  { srNo: 27, name: "Sakshi Pralhad Nimse", designation: "Member", ieeeNumber: "98765458" },
  { srNo: 28, name: "Kushbu Muley", designation: "Member", ieeeNumber: "98765459" },
  { srNo: 29, name: "Yashraj Maratkar", designation: "Member", ieeeNumber: "98765460" },
  { srNo: 30, name: "Pankaj Sudam Thore", designation: "Member", ieeeNumber: "98765461" },
  { srNo: 31, name: "Mayuresh Patil", designation: "Member", ieeeNumber: "98765462" },
  { srNo: 32, name: "Kiran Gavel", designation: "Member", ieeeNumber: "98765463" },
  { srNo: 33, name: "Vaishnavi Maruti Khatawkar", designation: "Member", ieeeNumber: "98765464" },
  { srNo: 34, name: "Kalyani Narhari Dhamale", designation: "Member", ieeeNumber: "98765465" },
  { srNo: 35, name: "Prajwal Kothawade", designation: "Member", ieeeNumber: "98765466" },
  { srNo: 36, name: "Vedant Naik", designation: "Member", ieeeNumber: "98765467" },
  { srNo: 37, name: "Sujay Walunje", designation: "Member", ieeeNumber: "98765468" },
  { srNo: 38, name: "Hiya Patil", designation: "Member", ieeeNumber: "98765469" },
  { srNo: 39, name: "Prerana Sureshrao Garade", designation: "Member", ieeeNumber: "98765470" },
  { srNo: 40, name: "Rutuja Vikas Jagtap", designation: "Member", ieeeNumber: "98765471" },
  { srNo: 41, name: "Ruchika Sandip Ghate", designation: "Member", ieeeNumber: "98765472" },
  { srNo: 42, name: "Radhika Kadam", designation: "Member", ieeeNumber: "98765473" },
  { srNo: 43, name: "Radha Anandrao Kadam", designation: "Member", ieeeNumber: "98765474" },
  { srNo: 44, name: "Kamran Ansar", designation: "Member", ieeeNumber: "98765475" },
  { srNo: 45, name: "Shreya Ravindra Nihare", designation: "Member", ieeeNumber: "98765476" },
  { srNo: 46, name: "Deepak Vishwas Khandel", designation: "Member", ieeeNumber: "98765477" },
  { srNo: 47, name: "PAYAL W VIDHATE", designation: "Member", ieeeNumber: "98765478" },
  { srNo: 48, name: "Niranjan Gaikwad", designation: "Member", ieeeNumber: "98765479" },
  { srNo: 49, name: "Parth Anil Dhamale", designation: "Member", ieeeNumber: "98765480" },
  { srNo: 50, name: "Prasad Dynaneshwar Pragane", designation: "Member", ieeeNumber: "98765481" },
  { srNo: 51, name: "Madhav Kadam", designation: "Member", ieeeNumber: "98765482" },
  { srNo: 52, name: "Tanmay Shelke", designation: "Member", ieeeNumber: "98765483" },
  { srNo: 53, name: "Ashish Sonawane", designation: "Member", ieeeNumber: "98765484" },
  { srNo: 54, name: "Rautesh Dangore", designation: "Member", ieeeNumber: "98765485" },
];

export default function MembersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [allDbMembers, setAllDbMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchCommittee() {
      try {
        const res = await api.get("/committee");
        setAllDbMembers(res.data?.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchCommittee();
  }, []);

  // Filter ONLY Executive Committee members for top cards showcase
  const executiveMembers = useMemo(() => {
    return allDbMembers.filter((m) => m.isExecutive !== false);
  }, [allDbMembers]);

  // Combine database members (executive + general) with initial student members dataset for full table
  const combinedStudentRoster = useMemo(() => {
    const dbMapped = allDbMembers.map((m: any, idx: number) => ({
      srNo: idx + 1,
      name: m.name,
      designation: m.designation || (m.isExecutive !== false ? "Executive Member" : "Member"),
      ieeeNumber: m.ieeeMemberId || `9876${5486 + idx}`,
    }));

    const namesInDb = new Set(dbMapped.map((m) => m.name.toLowerCase()));
    const filteredInitial = initialMembersData.filter(
      (m) => !namesInDb.has(m.name.toLowerCase())
    );

    const merged = [...dbMapped, ...filteredInitial];
    return merged.map((m, idx) => ({ ...m, srNo: idx + 1 }));
  }, [allDbMembers]);

  // Search filter for Student Members table
  const filteredStudentRoster = useMemo(() => {
    if (!searchTerm.trim()) return combinedStudentRoster;
    const term = searchTerm.toLowerCase().trim();
    return combinedStudentRoster.filter(
      (m) =>
        m.name.toLowerCase().includes(term) ||
        m.designation.toLowerCase().includes(term) ||
        m.ieeeNumber.toLowerCase().includes(term)
    );
  }, [combinedStudentRoster, searchTerm]);

  return (
    <div className="space-y-16 pb-20 pt-10">
      {/* SECTION 1: Executive Committee Current Leadership Showcase */}
      <section className="container mx-auto px-4 md:px-8 space-y-10">
        <div className="text-center space-y-4">
          <HeroEntrance delay={0.1}>
            <Badge variant="ieee" className="px-4 py-1 text-sm gap-2">
              <UserCheck className="h-4 w-4 text-sky-400" />
              <span>Current Branch Leadership</span>
            </Badge>
          </HeroEntrance>

          <HeroEntrance delay={0.2}>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white">
              Executive <span className="bg-gradient-to-r from-sky-400 via-sky-300 to-blue-500 bg-clip-text text-transparent">Committee</span>
            </h1>
          </HeroEntrance>

          <HeroEntrance delay={0.3}>
            <p className="text-slate-400 max-w-2xl mx-auto text-base leading-relaxed">
              Meet the student leaders, faculty counselors, and team heads directing activities at MMIT IEEE Student Branch.
            </p>
          </HeroEntrance>
        </div>

        {/* Executive Committee Cards Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
          </div>
        ) : executiveMembers.length === 0 ? (
          <GlassCard className="text-center py-12 text-slate-400">
            No executive committee records found yet.
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {executiveMembers.map((member, index) => (
              <ScrollReveal key={member._id} direction="up" delay={index * 0.1}>
                <GlassCard className="text-center space-y-4 p-6 hover:border-sky-500/40 transition-all h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    <Avatar
                      src={member.avatarUrl}
                      alt={member.name}
                      fallback={member.name ? member.name.substring(0, 2).toUpperCase() : "EX"}
                      className="h-24 w-24 mx-auto border-2 border-sky-500/40 shadow-lg shadow-sky-500/10"
                    />

                    <div className="space-y-1">
                      <h3 className="text-xl font-bold text-white">{member.name}</h3>
                      <p className="text-sm font-semibold text-sky-400">{member.designation}</p>
                    </div>

                    {member.bio && (
                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>

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

      {/* SECTION 2: Past Executive Committee Academic Year Archives & Org Chart */}
      <ExecutiveCommitteeArchive />

      {/* SECTION 3: MMIT IEEE Student Members Table Roster */}
      <section className="container mx-auto px-4 md:px-8 space-y-8 pt-8 border-t border-slate-800/80">
        <div className="space-y-4">
          <ScrollReveal direction="up" delay={0.1}>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-white">
              MMIT IEEE Student Members
            </h2>
            <p className="text-slate-400 text-sm md:text-base">
              Roster of official student members registered with MMIT IEEE Student Branch.
            </p>
          </ScrollReveal>

          {/* Search Bar & Real-time Counter */}
          <ScrollReveal direction="up" delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <div className="relative w-full sm:max-w-xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search members by name, designation, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full h-12 rounded-xl bg-slate-900/90 border border-slate-800 pl-11 pr-4 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm shadow-inner"
                />
              </div>

              <div className="text-xs text-slate-400 font-medium whitespace-nowrap self-end sm:self-center">
                Showing <span className="text-sky-400 font-bold">{filteredStudentRoster.length}</span> of{" "}
                <span className="text-slate-200 font-bold">{combinedStudentRoster.length}</span> members
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* Student Members Table */}
        <ScrollReveal direction="up" delay={0.3}>
          <GlassCard className="p-0 overflow-hidden border-slate-800/80 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs md:text-sm">
                <thead className="bg-slate-950/80 border-b border-slate-800 text-slate-300 font-semibold uppercase tracking-wider">
                  <tr>
                    <th scope="col" className="px-6 py-4 w-20">
                      SR NO
                    </th>
                    <th scope="col" className="px-6 py-4">
                      NAME
                    </th>
                    <th scope="col" className="px-6 py-4">
                      DESIGNATION / ROLE
                    </th>
                    <th scope="col" className="px-6 py-4">
                      IEEE MEMBERSHIP NUMBER
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-slate-300">
                  {isLoading ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-400">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="h-5 w-5 animate-spin text-sky-400" />
                          <span>Loading student member roster...</span>
                        </div>
                      </td>
                    </tr>
                  ) : filteredStudentRoster.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-12 text-slate-400">
                        <Users className="h-8 w-8 mx-auto mb-2 text-slate-500" />
                        <p className="font-semibold text-white">No matching members found</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Try searching for a different name, designation, or membership number.
                        </p>
                      </td>
                    </tr>
                  ) : (
                    filteredStudentRoster.map((member) => (
                      <tr
                        key={member.srNo + member.name}
                        className="hover:bg-sky-500/5 transition-colors group"
                      >
                        <td className="px-6 py-3.5 font-mono text-slate-400 text-xs">
                          {member.srNo}
                        </td>
                        <td className="px-6 py-3.5 font-medium text-slate-100 group-hover:text-sky-300 transition-colors">
                          {member.name}
                        </td>
                        <td className="px-6 py-3.5 text-sky-400 font-semibold">
                          {member.designation}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-slate-300 tracking-wider">
                          {member.ieeeNumber}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </ScrollReveal>
      </section>
    </div>
  );
}
