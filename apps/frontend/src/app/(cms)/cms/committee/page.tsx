"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { GlassCard } from "@/components/animated/GlassCard";
import { ImageUploader } from "@/components/common/ImageUploader";
import { Users, Plus, Trash2, ArrowLeft, Loader2, CheckCircle2, AlertCircle, Linkedin, CreditCard, Calendar, Crown, User } from "lucide-react";

export default function CMSCommitteePage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [memberCategory, setMemberCategory] = useState<"EXECUTIVE" | "MEMBER">("EXECUTIVE");
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [selectedYearFilter, setSelectedYearFilter] = useState("ALL");
  const [ieeeMemberId, setIeeeMemberId] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80");
  const [bio, setBio] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  async function fetchMembers() {
    setIsLoading(true);
    try {
      const res = await api.get("/committee");
      setMembers(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) {
      setStatusMessage({ type: "error", text: "Please provide Full Name." });
      return;
    }
    const finalDesignation =
      memberCategory === "MEMBER"
        ? designation.trim() || "Student Member"
        : designation.trim() || "Executive Member";

    setIsSubmitting(true);
    setStatusMessage(null);
    try {
      const res = await api.post("/committee", {
        name,
        designation: finalDesignation,
        isExecutive: memberCategory === "EXECUTIVE",
        ieeeMemberId: ieeeMemberId.trim() || undefined,
        avatarUrl,
        bio,
        socialLinks: {
          linkedin: linkedinUrl.trim() || undefined,
        },
        academicYear,
        isActive: true,
      });

      setName("");
      setDesignation("");
      setIeeeMemberId("");
      setLinkedinUrl("");
      setBio("");
      setStatusMessage({
        type: "success",
        text: `'${res.data?.data?.name}' added successfully as ${
          memberCategory === "EXECUTIVE" ? "Executive Committee Member" : "General Member"
        }!`,
      });
      await fetchMembers();
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.response?.data?.error?.message || "Failed to add member.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string, memberName: string) => {
    if (!confirm(`Are you sure you want to delete member '${memberName}'?`)) return;
    try {
      await api.delete(`/committee/${id}`);
      setStatusMessage({ type: "success", text: `Member '${memberName}' deleted successfully.` });
      setMembers((prev) => prev.filter((m) => m._id !== id));
    } catch (err: any) {
      setStatusMessage({
        type: "error",
        text: err.response?.data?.error?.message || "Failed to delete member.",
      });
    }
  };

  const filteredMembers = selectedYearFilter === "ALL"
    ? members
    : members.filter((m) => m.academicYear === selectedYearFilter);

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 space-y-8">
      <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
        <Link href="/cms/dashboard">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold text-white">Committee & Member Governance</h1>
          <p className="text-sm text-slate-400">Add, manage, or delete executive committee members and general branch members</p>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`flex items-center gap-2.5 p-3.5 rounded-xl text-sm border ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/30 text-rose-300"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Member Form */}
        <GlassCard className="space-y-4 h-fit border-sky-500/30">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Plus className="h-5 w-5 text-sky-400" />
            <span>Add Member Record</span>
          </h2>

          <form onSubmit={handleCreate} className="space-y-4 text-sm">
            {/* Category Option: Executive vs Member */}
            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Member Classification</label>
              <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setMemberCategory("EXECUTIVE");
                    setDesignation("");
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    memberCategory === "EXECUTIVE"
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <Crown className="h-3.5 w-3.5 text-sky-400" />
                  <span>1. Executive Committee</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMemberCategory("MEMBER");
                    setDesignation("Student Member");
                  }}
                  className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold transition-all ${
                    memberCategory === "MEMBER"
                      ? "bg-sky-500/20 text-sky-300 border border-sky-500/40 shadow-sm"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <User className="h-3.5 w-3.5 text-sky-400" />
                  <span>2. General Member</span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Academic Year</label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full h-10 rounded-lg border border-slate-800 bg-slate-950 px-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="2025-2026">A.Y. 2025 - 2026 (Current)</option>
                <option value="2024-2025">A.Y. 2024 - 2025</option>
                <option value="2023-2024">A.Y. 2023 - 2024</option>
                <option value="2022-2023">A.Y. 2022 - 2023</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Full Name</label>
              <Input
                placeholder="Rohan Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Designation / Role</label>
              <Input
                placeholder={memberCategory === "EXECUTIVE" ? "Chairperson / Branch Counselor" : "Student Member"}
                value={designation}
                onChange={(e) => setDesignation(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">IEEE Membership ID</label>
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  placeholder="e.g. 98765432"
                  value={ieeeMemberId}
                  onChange={(e) => setIeeeMemberId(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">LinkedIn Profile URL</label>
              <div className="relative">
                <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <Input
                  type="url"
                  placeholder="https://linkedin.com/in/username"
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Avatar Photo</label>
              <ImageUploader
                folder="mmit-ieee/committee"
                value={avatarUrl}
                onChange={(url) => setAvatarUrl(url)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-300">Short Bio</label>
              <textarea
                rows={2}
                placeholder="Brief introduction..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <Button type="submit" variant="gradient" className="w-full gap-2" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Add Member</span>
                </>
              )}
            </Button>
          </form>
        </GlassCard>

        {/* Member Roster List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base">Roster Directory ({filteredMembers.length})</h3>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-sky-400" />
              <select
                value={selectedYearFilter}
                onChange={(e) => setSelectedYearFilter(e.target.value)}
                className="h-8 rounded-lg border border-slate-800 bg-slate-950 px-2 text-xs text-sky-300 focus:outline-none focus:ring-1 focus:ring-sky-500"
              >
                <option value="ALL">All Academic Years</option>
                <option value="2025-2026">A.Y. 2025 - 2026</option>
                <option value="2024-2025">A.Y. 2024 - 2025</option>
                <option value="2023-2024">A.Y. 2023 - 2024</option>
                <option value="2022-2023">A.Y. 2022 - 2023</option>
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center p-12">
              <Loader2 className="h-8 w-8 animate-spin text-sky-400" />
            </div>
          ) : filteredMembers.length === 0 ? (
            <GlassCard className="text-center py-12 space-y-2">
              <Users className="h-10 w-10 mx-auto text-slate-500" />
              <h3 className="font-bold text-white">No Members Found</h3>
              <p className="text-xs text-slate-400">Add member records using the form on the left.</p>
            </GlassCard>
          ) : (
            filteredMembers.map((member) => (
              <GlassCard key={member._id} className="flex items-center justify-between p-4 gap-4 border-slate-800 hover:border-sky-500/30 transition-all">
                <div className="flex items-center gap-4">
                  <Avatar
                    src={member.avatarUrl}
                    alt={member.name}
                    fallback={member.name ? member.name.substring(0, 2).toUpperCase() : "EX"}
                    className="h-12 w-12 border border-sky-500/30 shadow-md shadow-sky-500/10"
                  />
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-white text-base">{member.name}</h3>
                      <Badge variant={member.isExecutive !== false ? "ieee" : "outline"} className="text-[10px]">
                        {member.isExecutive !== false ? "Executive Committee" : "Member"}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        A.Y. {member.academicYear || "2025-2026"}
                      </Badge>
                      {member.ieeeMemberId && (
                        <span className="text-[10px] text-slate-400 font-mono">
                          ID: {member.ieeeMemberId}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-sky-400 font-semibold">{member.designation}</p>
                    {member.socialLinks?.linkedin && (
                      <a
                        href={member.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:underline pt-0.5"
                      >
                        <Linkedin className="h-3 w-3 text-sky-400" />
                        <span>LinkedIn Profile</span>
                      </a>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(member._id, member.name)}
                  className="p-2.5 rounded-lg border border-slate-800 text-rose-400 hover:bg-rose-500/20 hover:border-rose-500/40 transition-all"
                  title={`Delete ${member.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </GlassCard>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
